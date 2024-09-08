import { format } from "date-fns";

interface ChannelHeroProps {
  channelName: string;
  channelCreationTime: number;
}

export const ChannelHero = ({
  channelName,
  channelCreationTime,
}: ChannelHeroProps) => {
  return (
    <div className="mx-5 mb-4 mt-[88px]">
      <p className="mb-2 flex items-center text-2xl font-bold">
        # {channelName}
      </p>
      <p className="mb-4 font-normal">
        This channel was created on{" "}
        {format(channelCreationTime, "MMMM d, yyyy")} . This is the very
        beginning of the <strong>{channelName}</strong> channel
      </p>
    </div>
  );
};
