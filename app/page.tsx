"use client";
import { Button } from "@/components/ui/button";
import pokerImage from "@/public/assets/poker-gif.gif";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uuid } from "uuidv4";

export default function Home() {
  const router = useRouter();
  const createRoom = () => router.push(`/room/${uuid()}`);

  return (
    <div>
      <div className="h-20 w-full flex items-center justify-between px-10 shadow-md">
        <div>LOGO</div>
        <Button onClick={createRoom}>Create new room</Button>
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-4 py-20 px-20 max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-6 items-center lg:items-start">
          <h1 className="text-6xl leading-[68px] font-bold text-center lg:text-left">
            Scrum Poker for <br /> agile teams
          </h1>
          <p className="opacity-60">
            Easy-to-use and fun story point estimations.
          </p>
          <Button className="w-48" size="lg" onClick={createRoom}>
            Create new room
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg object-cover">
          <Image src={pokerImage} alt="poker-img" />
        </div>
      </div>
    </div>
  );
}
