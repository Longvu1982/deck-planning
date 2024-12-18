"use client";
import CreateNewRoomButton from "@/components/custom/CreateNewRoomButton";
import { useStorage } from "@liveblocks/react/suspense";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import CardSection from "./sections/card/CardSection";
import ChatBox from "./sections/chat/ChatBox";
import ResultSection from "./sections/result/ResultSection";
import ShareButton from "./sections/share/ShareButton";

interface GameRoomProps {
  currentUserName: string | undefined;
}

const channel = new BroadcastChannel("New Room Channel");
const GameRoom: FC<GameRoomProps> = ({ currentUserName }) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const roomInfo = useStorage((state) => state.roomInfo);
  const selectValues = roomInfo.value ?? [];
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.roomId)
      channel.postMessage({ type: "new", payload: params.roomId });

    channel.onmessage = (ev) => {
      const { payload, type } = ev.data ?? {};
      if (type !== "new" || !payload || !params.roomId) return;
      if (payload !== params.roomId) router.push("/");
    };
  }, [params.roomId, router]);

  if (!roomInfo.name) return <></>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">🃏 {roomInfo.name}</h1>
        <div className="flex items-center gap-4">
          <CreateNewRoomButton isNewPage />
          <ShareButton
            isOpenDialog={isOpenDialog}
            setIsOpenDialog={setIsOpenDialog}
          />
          <div className="flex items-center">
            <p className="mr-2 bg-blue-100 text-blue-400 font-semibold size-10 flex items-center justify-center rounded-full">
              {currentUserName?.slice(0, 1)}
            </p>
            <span className="text-base font-semibold">{currentUserName}</span>
          </div>
        </div>
      </div>
      <ResultSection />
      <CardSection selectValues={selectValues} />
      <ChatBox />
    </div>
  );
};

export default GameRoom;
