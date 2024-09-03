"use client";
import { useChannelId } from "@/hooks/use-channel-id";

interface ChannelIdPage {
  params: {
    channelId: string;
  };
}

const ChannelIdPage = ({ params }: ChannelIdPage) => {
  const channelId = useChannelId();
  return <div>ChannelIdPage</div>;
};
export default ChannelIdPage;
