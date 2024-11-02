import { cn } from "@/lib/utils";
import { EState, UserSelection } from "@/liveblocks.config";
import { useStorage } from "@liveblocks/react/suspense";
import React, { FC } from "react";
import useLocalStorage from "use-local-storage";

interface ResultCardProps {
  item: UserSelection;
  index: number;
  cardCount: number;
}

const ResultCard: FC<ResultCardProps> = ({ item, index, cardCount }) => {
  const gameState = useStorage((state) => state.gameState);
  const isSelected = item.value != null;
  const isRevealed = isSelected && gameState.state === EState.REVEALED;
  const [currentUserName] = useLocalStorage(
    "currentUserName",
    localStorage.getItem("currentUserName")
  );

  const renderCardContent = () => {
    return (
      <>
        {/* front face */}
        <div
          className={cn(
            "flip-card-front rounded-md",
            item.value != null ? "bg-blue-400" : "stripe"
          )}
        >
          {isSelected && <span className="-mt-2 flip-card-emoji">👍</span>}
        </div>
        {/* back face */}
        {isRevealed && (
          <p className="flip-card-back rounded-md">{item.value}</p>
        )}
      </>
    );
  };

  return (
    <div
      key={item.name}
      className="w-10 h-60 left-[100px] absolute"
      style={{
        rotate: `${(index * 360) / cardCount}deg`,
      }}
    >
      <div
        key={item.name}
        className={cn(
          "absolute left-1/2 -top-28 w-10 h-20 rounded-md origin-center flip-card",
          isRevealed && "flip-card-revealed"
          //   item.value != null ? "bg-blue-400" : "stripe"
        )}
        style={{
          translate: "-50%",
          rotate: `${360 - (index * 360) / cardCount}deg`,
        }}
      >
        <p className="absolute -top-6 whitespace-nowrap left-1/2 -translate-x-1/2 text-center text-xs">
          {item.name}{" "}
          {currentUserName === item.name && (
            <span className="text-blue-400">(you)</span>
          )}
        </p>
        <div className="flip-card-inner rounded-md">{renderCardContent()}</div>
      </div>
    </div>
  );
};

export default ResultCard;
