"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { LiveObject } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CreateRoomFormProps {
  isOpenDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserName: string | undefined;
  setCurrentUserName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
});

export type CreateRoomFormValues = z.infer<typeof formSchema>;

const JoinRoomForm: React.FC<CreateRoomFormProps> = ({
  isOpenDialog,
  setOpenDialog,
  currentUserName,
  setCurrentUserName,
}) => {
  const form = useForm<CreateRoomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUserName ?? "",
    },
  });

  const onSave = useMutation(
    ({ storage }, formValues: CreateRoomFormValues) => {
      const { username } = formValues;

      const selections = storage.get("selections");
      if (
        selections.some((item) => item.get("name")?.trim() === username?.trim())
      ) {
        toast.warning("There is already an user with that name", {
          position: "top-center",
        });
        return;
      }

      setCurrentUserName(username);
      const newSelectUser = new LiveObject({ name: username, value: null });

      selections.push(newSelectUser);
      setOpenDialog(false);
    },
    [setCurrentUserName, setOpenDialog]
  );

  const onSubmit = (values: CreateRoomFormValues) => {
    onSave(values);
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={setOpenDialog}>
      <DialogContent
        closable={false}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Join existing room</DialogTitle>
              <DialogDescription>Change your display name</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Your name
                      </Label>
                      <div className="flex flex-col col-span-3">
                        <FormControl>
                          <Input id="name" className="col-span-3" {...field} />
                        </FormControl>
                        <FormMessage className="pt-1 text-xs" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Join room</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomForm;
