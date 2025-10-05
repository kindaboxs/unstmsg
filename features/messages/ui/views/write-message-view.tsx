import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WriteMessageForm } from "@/features/messages/ui/components/write-message-form";

export const WriteMessageView = () => {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Write Message</CardTitle>
          <CardDescription>Write a message to someone</CardDescription>
        </CardHeader>

        <CardContent>
          <WriteMessageForm />
        </CardContent>
      </Card>
    </div>
  );
};
