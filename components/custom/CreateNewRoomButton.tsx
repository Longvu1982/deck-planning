import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { uuid } from "uuidv4";
import { Button, ButtonProps } from "../ui/button";

const CreateNewRoomButton: FC<ButtonProps & { isNewPage?: boolean }> = ({
  isNewPage = false,
  ...props
}) => {
  const router = useRouter();
  const createRoom = () => {
    if (isNewPage) {
      window.open(`/room/${uuid()}`);
      return;
    }
    router.push(`/room/${uuid()}`);
  };

  return (
    <Button {...props} onClick={createRoom}>
      Create new room
    </Button>
  );
};

export default CreateNewRoomButton;
