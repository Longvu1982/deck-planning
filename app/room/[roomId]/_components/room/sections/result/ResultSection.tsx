import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { EState } from "@/liveblocks.config";
import {
  useBroadcastEvent,
  useEventListener,
  useMutation,
  useStorage,
} from "@liveblocks/react/suspense";
import { useState } from "react";
import Confetti from "react-confetti";
import ResultCard from "./ResultCard";
import ResultChart from "./ResultChart";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const ResultSection = () => {
  const selections = useStorage((state) => state.selections);
  const gameState = useStorage((state) => state.gameState);
  const [isShowConfetti, setIsShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const broadcast = useBroadcastEvent();
  const sortedMessages = useStorage((state) => state.messages).toSorted(
    (a, b) => b.datetime.localeCompare(a.datetime)
  );

  const startConfetti = () => {
    setIsShowConfetti(true);
    setTimeout(() => setIsShowConfetti(false), 3500);
  };

  const handleViewResult = useMutation(({ storage }) => {
    const gameStateStorage = storage.get("gameState");
    gameStateStorage.set("state", EState.REVEALED);

    broadcast({ type: "Hooray" });
    startConfetti();
  }, []);

  const handleReset = useMutation(({ storage }) => {
    const gameStateStorage = storage.get("gameState");
    gameStateStorage.set("state", EState.PENDING);

    const selections = storage.get("selections");
    selections.forEach((item) => item.set("value", null));
  }, []);

  const onCheckChange = useMutation(({ storage }, checked, name) => {
    const gameStateStorage = storage.get("gameState");
    gameStateStorage.set(name, checked);
  }, []);

  const renderActionButton = () => {
    if (gameState.state === EState.PENDING) {
      const isDisabledByNumber =
        selections.filter((item) => item.value !== null).length < 2;
      const isDisabledBySpectatorRule =
        selections.some((item) => item.value === null) && !gameState.allowEmpty;

      const isDisabled = isDisabledByNumber || isDisabledBySpectatorRule;

      return (
        <div className="flex flex-col gap-4 items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-2 -mt-12">
            <div className="flex items-center gap-1">
              <p className="text-white text-sm font-semibold">Spectators?</p>
              <Checkbox
                className="bg-white"
                checked={gameState.allowEmpty}
                onCheckedChange={(checked) =>
                  onCheckChange(checked, "allowEmpty")
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-semibold">Show chat?</p>
              <Checkbox
                className="bg-white"
                checked={gameState.showChat}
                onCheckedChange={(checked) =>
                  onCheckChange(checked, "showChat")
                }
              />
            </div>
          </div>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button
                    disabled={isDisabled}
                    onClick={handleViewResult}
                    className="p-6 hover:scale-105 transition-all"
                  >
                    View Result
                  </Button>
                </span>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>
                    {isDisabledByNumber
                      ? "Should have at least 2 votes."
                      : "If allow spectator is disabled, all participants must enter their votes."}
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }

    return (
      <Button
        onClick={handleReset}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        Reset vote
      </Button>
    );
  };

  useEventListener(({ event }) => {
    if (event.type === "Hooray") {
      startConfetti();
    }
  });

  return (
    <div className="h-[60vh] flex items-center justify-center gap-40">
      <div
        className={cn(
          "w-60 h-60 rounded-full bg-blue-300 relative origin-center md:block",
          gameState.state === EState.REVEALED ? "hidden" : ""
        )}
      >
        {selections.map((item, index) => (
          <ResultCard
            key={item.name}
            item={item}
            index={index}
            cardCount={selections.length}
            lastMessage={
              sortedMessages.find((mes) => mes.sender === item.name)?.content
            }
          />
        ))}
        {renderActionButton()}
      </div>
      {gameState.state === EState.REVEALED && (
        <div>
          <ResultChart />
          <div className="md:hidden relative">{renderActionButton()}</div>
        </div>
      )}
      {isShowConfetti && (
        <Confetti width={width} height={height} tweenDuration={100} />
      )}
    </div>
  );
};

export default ResultSection;
