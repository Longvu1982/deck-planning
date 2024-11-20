"use client";
import CreateNewRoomButton from "@/components/custom/CreateNewRoomButton";
import FullPageLoading from "@/components/loading/FullPageLoading";
import pokerImage from "@/public/assets/poker-gif.gif";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isClicked, setIsClicked] = useState(false);

  const createNewRoomClick = () => setIsClicked(true);

  return (
    <>
      {isClicked ? (
        <FullPageLoading />
      ) : (
        <div className="min-h-[100vh] flex flex-col">
          <div className="h-20 w-full flex items-center justify-between px-10 shadow-md">
            <div className="flex items-center gap-2">
              <p className="text-3xl">🃏</p>
              <div className="flex flex-col text-sm font-semibold">
                <span>Deck</span> <span>Planning</span>
              </div>
            </div>
            <CreateNewRoomButton onClick={createNewRoomClick} />
          </div>
          <div className="flex-1 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-4 py-20 px-20 max-w-[1280px] mx-auto">
            <div className="flex flex-col gap-6 items-center lg:items-start">
              <h1 className="text-6xl leading-[68px] font-bold text-center lg:text-left">
                Scrum Poker for <br /> agile teams
              </h1>
              <p className="opacity-60">
                Easy-to-use and fun story point estimations.
              </p>
              <CreateNewRoomButton
                onClick={createNewRoomClick}
                className="w-48"
                size="lg"
              />
            </div>
            <div className="overflow-hidden rounded-lg object-cover">
              <Image src={pokerImage} alt="poker-img" />
            </div>
          </div>
          <div className="h-10 px-4 text-right">
            Powered by @Liveblocks @Kris.nguyen 2024
          </div>
        </div>
      )}
    </>
  );
}
