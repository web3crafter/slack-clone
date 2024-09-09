import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!member) return [];

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId),
      )
      .collect();

    const results = await Promise.allSettled(
      data.map(async (member) => {
        const user = await populateUser(ctx, member.userId);
        if (user) {
          return { ...member, user };
        }
      }),
    );

    const combinedMembers = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<
          Doc<"members"> & { user: Doc<"users"> }
        > => result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value);

    // const results = await Promise.allSettled(
    //   data.map((item) => populateUser(ctx, item.userId)),
    // );

    // const combinedMembers = data.map((item) => {
    //   const userResult = results.find(
    //     (result) =>
    //       result.status === "fulfilled" &&
    //       result.value &&
    //       result.value._id === item.userId,
    //   );

    //   return {
    //     ...item,
    //     user:
    //       userResult && userResult.status === "fulfilled"
    //         ? userResult.value
    //         : null,
    //   };
    // });

    return combinedMembers;
  },
});

export const getById = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    const member = await ctx.db.get(args.memberId);

    if (!member) return null;

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!currentMember) return null;

    //TODO: Remove sensitive data from user
    const user = await populateUser(ctx, member.userId);

    if (!user) return null;

    return {
      ...member,
      user,
    };
  },
});

export const current = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!member) return null;

    return member;
  },
});

export const update = mutation({
  args: {
    memberId: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db.get(args.memberId);

    if (!member) throw new Error("Member not found");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!currentMember || currentMember.role !== "admin") {
      throw new Error("unauthorized");
    }

    await ctx.db.patch(args.memberId, {
      role: args.role,
    });

    return { updatedMemberId: args.memberId };
  },
});

export const remove = mutation({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db.get(args.memberId);

    if (!member) throw new Error("Member not found");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!currentMember) {
      throw new Error("unauthorized");
    }

    if (member.role === "admin") {
      throw new Error("Cannot remove an admin");
    }

    if (currentMember._id === args.memberId && currentMember.role === "admin") {
      throw new Error("Cannot remove yourself if is an admin");
    }

    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), member._id),
            q.eq(q.field("memberTwoId"), member._id),
          ),
        )
        .collect(),
    ]);

    await Promise.all([
      ...messages.map((message) => ctx.db.delete(message._id)),
      ...reactions.map((reaction) => ctx.db.delete(reaction._id)),
      ...conversations.map((conversation) => ctx.db.delete(conversation._id)),
    ]);

    await ctx.db.delete(args.memberId);

    return { removedMemberId: args.memberId };
  },
});
