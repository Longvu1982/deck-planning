"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams, useRouter } from "next/navigation";
import { LiveList, LiveObject } from "@liveblocks/client";
import { EState } from "@/liveblocks.config";

export function Room({ children }: { children: ReactNode }) {
  console.log(process.env.LIVEBLOCKS_PUBLIC_API_KEY);
  const router = useRouter();
  const params = useParams();

  if (!params.roomId) router.push("");

  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}
    >
      <RoomProvider
        id={params.roomId as string}
        initialStorage={{
          selections: new LiveList([]),
          roomInfo: new LiveObject({ id: "", name: "", value: [] }),
          gameState: new LiveObject({
            allowEmpty: true,
            state: EState.PENDING,
            isResultRounded: true,
          }),
        }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
