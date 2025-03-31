import { useRouter } from "next/navigation";
import { FC } from "react";
import { uuid } from "uuidv4";
import { Button, ButtonProps } from "../ui/button";
import { Plus } from "lucide-react";

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
      <span className="hidden md:inline">Create new room</span>
      <Plus className="md:hidden" />
    </Button>
  );
};

export default CreateNewRoomButton;
