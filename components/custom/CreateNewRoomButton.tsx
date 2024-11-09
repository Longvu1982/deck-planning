import { useRouter } from "next/navigation";
import { FC } from "react";
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
    <Button
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        createRoom();
        console.log("here");
      }}
    >
      Create new room
    </Button>
  );
};

export default CreateNewRoomButton;
