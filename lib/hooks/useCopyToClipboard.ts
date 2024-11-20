import { useCallback, useState } from "react";
import { toast } from "sonner";

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      toast.error("Clipboard not supported!");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success("URL copied successfully");
      return true;
    } catch (error) {
      toast.error("Copy failed, please manually copy the URL");
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy];
}
