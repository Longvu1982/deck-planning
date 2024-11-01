"use client";
import { useStorage } from "@liveblocks/react/suspense";
import { FC } from "react";
import CardSection from "./sections/card/CardSection";
import ResultSection from "./sections/result/ResultSection";

interface GameRoomProps {
  currentUserName: string | undefined;
  setCurrentUserName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const GameRoom: FC<GameRoomProps> = ({ currentUserName }) => {
  const roomInfo = useStorage((state) => state.roomInfo);
  const selectValues = roomInfo.value ?? [];

  if (!roomInfo.name) return <></>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">🃏 {roomInfo.name}</h1>
        <div className="flex items-center">
          <p className="mr-2 bg-blue-100 text-blue-400 font-semibold size-10 flex items-center justify-center rounded-full">
            {currentUserName?.slice(0, 1)}
          </p>
          <span className="text-base font-semibold">{currentUserName}</span>
        </div>
      </div>

      <ResultSection />

      <CardSection selectValues={selectValues} />
    </div>
  );
};

export default GameRoom;
