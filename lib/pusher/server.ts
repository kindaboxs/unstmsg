import Pusher from "pusher";

import { env } from "@/env";

export const pusherServer = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: env.PUSHER_APP_CLUSTER,
  encrypted: true,
});
