import AutoHeightTextArea from "@/components/ui/auto-height-text-area";
import { cn } from "@/lib/utils";
import { Message } from "@/liveblocks.config";
import { useMutation } from "@liveblocks/react";
import { useStorage } from "@liveblocks/react/suspense";
import { ChevronDown, ChevronUp, Send, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useLocalStorage from "use-local-storage";
import ChatContent from "./ChatContent";
import EmojiPicker from "emoji-picker-react";

const ChatBox = () => {
  const [isMinimized, setMinimized] = useState<boolean>(true);
  const [isOpenEmoji, setIsOpenEmoji] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [currentUserName] = useLocalStorage(
    "currentUserName",
    localStorage.getItem("currentUserName") ?? ""
  );
  const messages = useStorage((state) => state.messages);

  const chatContentRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollOnFirstLoad = useRef<boolean>(true);

  const onClickMinimize = () => {
    setMinimized(!isMinimized);
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
      setTimeout(() => chatContentRef.current?.scrollToBottom(), 100);
    },
    [currentUserName, chatContentRef.current]
  );

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
        isMinimized && "-bottom-[calc(80vh-40px)] opacity-55",
        "animate-in-down-from-bottom-250"
      )}
    >
      <div className="bg-blue-500 text-white text-sm shadow-md p-4 py-2">
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
      <div className="p-1">
        <div className="flex items-top gap-2 pl-1">
          <AutoHeightTextArea
            onClick={() => setIsOpenEmoji(false)}
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.code !== "Enter") return;
              if (e.shiftKey) return;

              e.preventDefault();
              onMessageSend(inputValue);
            }}
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
