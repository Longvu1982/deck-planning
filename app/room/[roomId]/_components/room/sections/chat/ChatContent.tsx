import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Message } from "@/liveblocks.config";
import { format } from "date-fns";
import { forwardRef, useImperativeHandle, useRef } from "react";
import ContentPreview from "./ContentPreview";

interface ChatContentProps {
  messages: readonly Message[];
  currentUserName: string;
}

const ChatContent = forwardRef<any, ChatContentProps>(
  ({ messages, currentUserName }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      scrollToBottom: () =>
        scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
    }));

    return (
      <ScrollArea className="flex-1 p-3">
        {messages.map((item) => {
          const isCurrent = currentUserName === item.sender;

          return (
            <div
              key={item.datetime}
              className={cn(
                "flex items-center gap-3 mb-4",
                isCurrent && "justify-end"
              )}
            >
              {!isCurrent && (
                <div className="size-9 rounded-md text-sm flex items-center justify-center bg-purple-200 text-purple-500 font-semibold">
                  {item.sender.slice(0, 1)}
                </div>
              )}
              <div
                className={cn("flex-1 flex flex-col", isCurrent && "items-end")}
              >
                <div
                  className={cn(
                    "flex font-semibold mb-1 items-center justify-between text-xs",
                    isCurrent && "w-4/5"
                  )}
                >
                  <p
                    className={cn(
                      isCurrent ? "text-blue-500" : "text-purple-500"
                    )}
                  >
                    {item.sender}
                    {isCurrent ? " (you)" : ""}
                  </p>
                  <p className="opacity-40">
                    {format(new Date(item.datetime), "Pp")}
                  </p>
                </div>
                <div
                  className={cn(
                    "whitespace-pre-wrap p-[10px] text-sm rounded-md w-4/5 grow-0 basis-0",
                    isCurrent ? "bg-blue-100" : "bg-gray-200"
                  )}
                >
                  <ContentPreview content={item.content} />
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef}></div>
      </ScrollArea>
    );
  }
);

ChatContent.displayName = "ChatContent";
export default ChatContent;
