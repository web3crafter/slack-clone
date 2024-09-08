import { getAvatarFallback } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationHeroProps {
  memberName?: string;
  memberImage?: string;
}

export const ConversationHero = ({
  memberName = "Member",
  memberImage,
}: ConversationHeroProps) => {
  return (
    <div className="mx-5 mb-4 mt-[88px]">
      <div className="mb-2 flex items-center gap-x-1">
        <Avatar className="mr-2 size-14">
          <AvatarImage src={memberImage} />
          <AvatarFallback>{getAvatarFallback(memberName)}</AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">{memberName}</p>
      </div>
      <p className="mb-4 font-normal">
        This conversation is just between you and <strong>{memberName}</strong>
      </p>
    </div>
  );
};
