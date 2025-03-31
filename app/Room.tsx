"use client";

import FullPageLoading from "@/components/loading/FullPageLoading";
import { EState } from "@/liveblocks.config";
import { LiveList, LiveObject } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { useParams, useRouter } from "next/navigation";
import { ReactNode } from "react";

export function Room({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams();

  if (!params.roomId) router.push("");

  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}
    >
      <RoomProvider
        initialPresence={{
          typing: {
            isTyping: false,
            name: global?.window
              ? localStorage?.getItem("currentUserName") ?? ""
              : "",
          },
        }}
        id={params.roomId as string}
        initialStorage={{
          selections: new LiveList([]),
          roomInfo: new LiveObject({ id: "", name: "", value: [] }),
          gameState: new LiveObject({
            allowEmpty: true,
            state: EState.PENDING,
            isResultRounded: true,
            showChat: true,
          }),
          messages: new LiveList([]),
        }}
      >
        <ClientSideSuspense fallback={<FullPageLoading />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
