"use client";
import { useStorage } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import CreateRoomForm from "./_components/form/CreateRoomForm";
import JoinRoomForm from "./_components/form/JoinRoomForm";
import GameRoom from "./_components/room/GameRoom";

const RoomPage = () => {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isOpenJoinDialog, setOpenJoinDialog] = useState(false);
  const roomInfo = useStorage((state) => state.roomInfo);
  const selections = useStorage((state) => state.selections);

  const [currentUserName, setCurrentUserName] = useLocalStorage(
    "currentUserName",
    ""
  );

  useEffect(() => {
    if (!roomInfo.name) {
      setOpenDialog(true);
      return;
    }
    setOpenDialog(false);
    if (
      !currentUserName ||
      selections.every((item) => item.name !== currentUserName)
    )
      setOpenJoinDialog(true);
    else {
      setOpenJoinDialog(false);
    }
  }, [roomInfo.name, selections, currentUserName]);

  return (
    <>
      <CreateRoomForm
        currentUserName={currentUserName}
        setCurrentUserName={setCurrentUserName}
        isOpenDialog={isOpenDialog}
        setOpenDialog={setOpenDialog}
      />
      <JoinRoomForm
        currentUserName={currentUserName}
        setCurrentUserName={setCurrentUserName}
        isOpenDialog={isOpenJoinDialog}
        setOpenDialog={setOpenJoinDialog}
      />
      <GameRoom currentUserName={currentUserName} />
    </>
  );
};

export default RoomPage;
