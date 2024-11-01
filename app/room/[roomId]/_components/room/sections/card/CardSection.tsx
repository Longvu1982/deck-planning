import { cn } from "@/lib/utils";
import { EState } from "@/liveblocks.config";
import { useMutation } from "@liveblocks/react";
import { useStorage } from "@liveblocks/react/suspense";
import useLocalStorage from "use-local-storage";

const CardSection = ({ selectValues }: { selectValues: number[] }) => {
  const [currentUserName] = useLocalStorage("currentUserName", "");
  const selections = useStorage((state) => state.selections);
  const gameState = useStorage((state) => state.gameState);

  console.log(gameState.state);

  const onSelect = useMutation(
    ({ storage }, value: number, index: number) => {
      if (gameState.state === EState.REVEALED) return;
      const currentUserSelect = storage.get("selections").get(index);
      currentUserSelect?.set(
        "value",
        currentUserSelect?.get("value") === value ? null : value
      );
    },
    [gameState]
  );

  const currentSelected = selections?.find(
    (item) => item.name === currentUserName
  )?.value;

  return (
    <div className="flex items-center justify-center fixed left-0 right-0 bottom-10 h-40">
      {selectValues.map((item, index) => {
        const userIndex = selections.findIndex(
          (item) => item.name === currentUserName
        );
        const isSelected = item === currentSelected;

        return (
          <div key={item} onClick={() => onSelect(item, userIndex)}>
            <div
              className={cn(
                "cursor-pointer h-40 w-24 -ml-2 rounded-md flex items-center justify-center text-white shadow-lg transition-all",
                !isSelected ? "bg-blue-300" : "bg-blue-500",
                gameState.state === EState.REVEALED
                  ? "cursor-not-allowed"
                  : "hover:scale-105 hover:border-[3px] hover:border-green-300"
              )}
              style={{
                rotate: `${index * 5 - (selectValues.length * 5) / 2}deg`,
                translate: `0 ${
                  Math.abs(index - selectValues.length / 2) * 10 -
                  (item === currentSelected ? 50 : 0)
                }px`,
              }}
            >
              {item}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardSection;
