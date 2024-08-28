import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
import { DataModel } from "./_generated/dataModel";
import { z } from "zod";

const ParamsSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export default Password<DataModel>({
  profile(params) {
    const { error, data } = ParamsSchema.safeParse(params);
    if (error) {
      throw new ConvexError(error.format());
    }
    return {
      email: data.email as string,
      name: data.name as string,
    };
  },
});
