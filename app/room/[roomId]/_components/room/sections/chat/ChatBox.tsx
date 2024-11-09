import AutoHeightTextArea from "@/components/ui/auto-height-text-area";
import { cn } from "@/lib/utils";
import { Message } from "@/liveblocks.config";
import { useMutation } from "@liveblocks/react";
import {
  useBroadcastEvent,
  useEventListener,
  useOthers,
  useStorage,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense";
import EmojiPicker from "emoji-picker-react";
import { ChevronDown, ChevronUp, Send, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useLocalStorage from "use-local-storage";
import ChatContent from "./ChatContent";

const ChatBox = () => {
  const [isMinimized, setMinimized] = useState<boolean>(true);
  const [isOpenEmoji, setIsOpenEmoji] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");

  const messages = useStorage((state) => state.messages);
  const updateMyPresence = useUpdateMyPresence();
  const [unReadCount, setUnreadCount] = useState<number>(messages.length);
  const [currentUserName] = useLocalStorage(
    "currentUserName",
    localStorage.getItem("currentUserName") ?? ""
  );
  const typingList = useOthers((others) => {
    const names = others
      .filter(
        (o) =>
          o.presence.typing.isTyping &&
          o.presence.typing.name !== currentUserName
      )
      .map((item) => item.presence.typing.name);
    return names;
  });

  const chatContentRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollOnFirstLoad = useRef<boolean>(true);
  const broadcast = useBroadcastEvent();

  const onClickMinimize = () => {
    setMinimized(!isMinimized);
    setUnreadCount(0);

    if (isMinimized) {
      inputRef.current?.focus();
      setTimeout(() => chatContentRef.current?.scrollToBottom(), 100);
    }
  };

  const getTypingState = (isTyping: boolean) => {
    return { typing: { isTyping, name: currentUserName } };
  };

  const onMessageSend = useMutation(
    ({ storage }, content: string) => {
      if (!content.trim()) return;
      const newMessages: Message = {
        sender: currentUserName,
        datetime: new Date().toISOString(),
        content,
      };
      storage.get("messages").push(newMessages);
      setInputValue("");
      setIsOpenEmoji(false);
      updateMyPresence(getTypingState(false));
      broadcast({ type: "New Message" });
      setTimeout(() => chatContentRef.current?.scrollToBottom(), 100);
    },
    [currentUserName, chatContentRef.current, updateMyPresence, getTypingState]
  );

  useEventListener(({ event }) => {
    if (event.type === "New Message") {
      setUnreadCount(unReadCount + 1);
    }
  });

  useEffect(() => {
    if (messages.length > 0 && scrollOnFirstLoad.current) {
      chatContentRef.current?.scrollToBottom();
      scrollOnFirstLoad.current = false;
    }
  }, [messages.length]);

  return (
    <div
      className={cn(
        "fixed bottom-0 right-4 h-[80vh] w-[300px] bg-gray-100 overflow-hidden shadow-md flex flex-col transition-[bottom]",
        isMinimized && "-bottom-[calc(80vh-40px)]",
        "animate-in-down-from-bottom-250"
      )}
    >
      {unReadCount > 0 && (
        <div className="absolute top-2 right-2 bg-red-500 size-6 rounded-full text-white font-semibold flex items-center justify-center text-xs z-20">
          {unReadCount}
        </div>
      )}
      <div
        className={cn(
          "bg-blue-500 text-white text-sm shadow-md p-4 py-2",
          isMinimized && "opacity-55"
        )}
      >
        <div
          onClick={onClickMinimize}
          className="hover:opacity-75 cursor-pointer flex items-center gap-1"
        >
          {!isMinimized ? "Minimize" : "Open"} chat{" "}
          {isMinimized ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      <ChatContent
        ref={chatContentRef}
        messages={messages}
        currentUserName={currentUserName}
      />
      {typingList.length > 0 && (
        <p className="px-2 text-sm text-blue-500 italic animate-bounce duration-[350]">
          {typingList.join(",")} {typingList.length > 2 ? "are" : "is"}{" "}
          typing...
        </p>
      )}
      <div className="p-1">
        <div className="flex items-top gap-2 pl-1">
          <AutoHeightTextArea
            onFocus={() => setUnreadCount(0)}
            onClick={() => setIsOpenEmoji(false)}
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              updateMyPresence(getTypingState(true));
            }}
            onKeyDown={(e) => {
              if (e.code !== "Enter") return;
              if (e.shiftKey) return;

              e.preventDefault();
              onMessageSend(inputValue);
            }}
            onBlur={() => updateMyPresence(getTypingState(false))}
            placeholder="Type something (Enter to send)..."
            className="resize-none max-h-[100px] min-h-10 overflow-y-auto"
          />
          <div className="flex flex-col justify-between py-1 relative">
            <Smile
              className="cursor-pointer hover:opacity-75"
              size={18}
              onClick={() => setIsOpenEmoji(!isOpenEmoji)}
            />
            <Send
              size={18}
              className="text-blue-500 cursor-pointer hover:opacity-75"
              onClick={() => onMessageSend(inputValue)}
            />
            <div className="absolute -translate-y-[100px] right-0 bottom-0">
              <EmojiPicker
                width="100%"
                reactionsDefaultOpen={false}
                open={isOpenEmoji}
                autoFocusSearch={false}
                previewConfig={{ showPreview: false }}
                onEmojiClick={(value) => {
                  setInputValue((prev) => prev + value.emoji);
                  inputRef.current?.focus();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
