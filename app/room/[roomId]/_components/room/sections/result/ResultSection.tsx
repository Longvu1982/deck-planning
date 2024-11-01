import { Button } from "@/components/ui/button";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import ResultCard from "./ResultCard";
import { EState } from "@/liveblocks.config";
import ResultChart from "./ResultChart";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ResultSection = () => {
  const selections = useStorage((state) => state.selections);
  const gameState = useStorage((state) => state.gameState);

  const handleViewResult = useMutation(({ storage }) => {
    const gameStateStorage = storage.get("gameState");
    gameStateStorage.set("state", EState.REVEALED);
  }, []);

  const handleReset = useMutation(({ storage }) => {
    const gameStateStorage = storage.get("gameState");
    gameStateStorage.set("state", EState.PENDING);

    const selections = storage.get("selections");
    selections.forEach((item) => item.set("value", null));
  }, []);

  const onCheckChange = useMutation(({ storage }, checked) => {
    const gameStateStorage = storage.get("gameState");
    gameStateStorage.set("allowEmpty", checked);
  }, []);

  const renderActionButton = () => {
    if (gameState.state === EState.PENDING) {
      const isDisabled =
        selections.some((item) => item.value === null) && !gameState.allowEmpty;

      return (
        <div className="flex flex-col gap-8 items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1 -mt-10">
            <p className="text-white text-sm font-semibold">Allow Spectators</p>
            <Switch
              checked={gameState.allowEmpty}
              onCheckedChange={onCheckChange}
            />
          </div>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <Button
                  disabled={isDisabled}
                  onClick={handleViewResult}
                  className="p-6 hover:scale-105 transition-all"
                >
                  View Result
                </Button>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>
                    If allow empty is disabled, all participants must enter
                    their vote.
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

  return (
    <div className="h-[60vh] flex items-center justify-center gap-40">
      <div className="w-60 h-60 rounded-full bg-blue-300 relative origin-center">
        {selections.map((item, index) => (
          <ResultCard
            key={item.name}
            item={item}
            index={index}
            cardCount={selections.length}
          />
        ))}
        {renderActionButton()}
      </div>
      {gameState.state === EState.REVEALED && <ResultChart />}
    </div>
  );
};

export default ResultSection;
