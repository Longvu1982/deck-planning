// Define Liveblocks types for your application

import { LiveList, LiveObject } from "@liveblocks/client";

// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
export type UserSelection = {
  name: string;
  value: number | null;
};

export type TRoomInfo = {
  id: string;
  name: string;
  value: number[];
};

export enum EState {
  PENDING = 0,
  REVEALED = 1,
}
export type GameState = {
  allowEmpty: boolean;
  showChat: boolean;
  state: EState;
  isResultRounded: boolean;
};

export type Message = {
  sender: string;
  content: string;
  datetime: string;
};

export type Typing = { isTyping: boolean; name: string };

declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Example, real-time cursor coordinates
      typing: Typing;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      selections: LiveList<LiveObject<UserSelection>>;
      roomInfo: LiveObject<TRoomInfo>;
      gameState: LiveObject<GameState>;
      messages: LiveList<Message>;
      // Example, a conflict-free list
      // animals: LiveList<string>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        // Example properties, for useSelf, useUser, useOthers, etc.
        // name: string;
        // avatar: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {
      type: "Hooray" | "New Message";
    };
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export {};
