"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  createMessageSchema,
  type CreateMessageSchema,
} from "@/features/messages/schemas";
import { SpotifySearchDialog } from "@/features/spotify/ui/components/spotify-search-dialog";
import { useTRPC } from "@/trpc/client";

export const WriteMessageForm = () => {
  const [isAnonymousFrom, setIsAnonymousFrom] = useState<boolean>(false);
  const [isAnonymousTo, setIsAnonymousTo] = useState<boolean>(false);

  const router = useRouter();
  const trpc = useTRPC();

  const form = useForm<CreateMessageSchema>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      from: "",
      to: "",
      trackId: "",
      content: "",
    },
    mode: "onChange",
  });

  const createMessageMutation = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: async (data) => {
        setIsAnonymousFrom(false);
        setIsAnonymousTo(false);
        form.reset();

        router.push(`/messages/${data.id}`);

        toast.success("Message has been created!");
      },

      onError: (error) => {
        toast.error("Oops! message creation failed", {
          description: error.message,
        });
      },
    })
  );

  const handleSubmitForm = (values: CreateMessageSchema) => {
    createMessageMutation.mutate(values);
  };

  const handleAnonymousFromChange = (checked: boolean) => {
    setIsAnonymousFrom(checked);
    if (checked) {
      form.setValue("from", "someone");
    } else {
      form.setValue("from", "");
    }
  };

  const handleAnonymousToChange = (checked: boolean) => {
    setIsAnonymousTo(checked);
    if (checked) {
      form.setValue("to", "someone");
    } else {
      form.setValue("to", "");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="grid gap-y-6"
      >
        <div className="grid gap-y-4">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name or alias"
                    {...field}
                    disabled={
                      isAnonymousFrom || createMessageMutation.isPending
                    }
                    aria-disabled={
                      isAnonymousFrom || createMessageMutation.isPending
                    }
                  />
                </FormControl>
                <div className="mt-2 flex items-center gap-x-2">
                  <Checkbox
                    id={"anonymousFrom"}
                    checked={isAnonymousFrom}
                    onCheckedChange={handleAnonymousFromChange}
                  />
                  <Label htmlFor="anonymousFrom">Send as anonymously</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Recipient's name"
                    {...field}
                    disabled={isAnonymousTo || createMessageMutation.isPending}
                    aria-disabled={
                      isAnonymousTo || createMessageMutation.isPending
                    }
                  />
                </FormControl>
                <div className="mt-2 flex items-center gap-x-2">
                  <Checkbox
                    id={"anonymousTo"}
                    checked={isAnonymousTo}
                    onCheckedChange={handleAnonymousToChange}
                  />
                  <Label htmlFor="anonymousTo">To someone</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trackId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track / Song</FormLabel>
                <SpotifySearchDialog {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Unsent Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write what you never said..."
                    rows={4}
                    {...field}
                    disabled={createMessageMutation.isPending}
                    aria-disabled={createMessageMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={createMessageMutation.isPending || !form.formState.isValid}
        >
          {createMessageMutation.isPending ? (
            <>
              <Spinner /> Sending...
            </>
          ) : (
            "Send"
          )}
        </Button>
      </form>
    </Form>
  );
};
