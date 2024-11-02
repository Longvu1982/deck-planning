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
import FullPageLoading from "@/components/loading/FullPageLoading";

export function Room({ children }: { children: ReactNode }) {
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
        <ClientSideSuspense fallback={<FullPageLoading />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
