import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";
import { Copy, CopyCheck, Share } from "lucide-react";
import { FC, useRef, useState } from "react";

interface ShareButtonProps {
  setIsOpenDialog: (isOpen: boolean) => void;
  isOpenDialog: boolean;
}
const ShareButton: FC<ShareButtonProps> = ({
  isOpenDialog,
  setIsOpenDialog,
}) => {
  const [isCopyButtonClicked, setIsCopyButtonClicked] = useState(false);
  const [, handleCopy] = useCopyToClipboard();
  const inputRef = useRef<HTMLInputElement>(null);

  const onCopy = async () => {
    const isSuccess = await handleCopy(window.location.href);
    if (isSuccess) {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, window.location.href.length);
      setIsCopyButtonClicked(true);
      setTimeout(() => setIsCopyButtonClicked(false), 1000);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpenDialog(true)}
        variant="ghost"
        className="p-1 px-2"
      >
        <Share className="text-blue-400" />
      </Button>
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite people into your room</DialogTitle>
            <DialogDescription>
              Copy below link and send to your co-workers
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Input
              readOnly
              defaultValue={window.location.href}
              ref={inputRef}
            />
            <Button
              onClick={onCopy}
              variant="ghost"
              className="p-2 text-blue-400"
            >
              {!isCopyButtonClicked ? <Copy /> : <CopyCheck />}
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOpenDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareButton;
