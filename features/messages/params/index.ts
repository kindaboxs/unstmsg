import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

import { DEFAULT_LIMIT_MESSAGES } from "@/constants";

export const messagesSearchParams = {
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
    history: "push",
  }),
  limit: parseAsInteger.withDefault(DEFAULT_LIMIT_MESSAGES).withOptions({
    clearOnDefault: true,
    history: "push",
  }),
};

export const messagesLoader = createLoader(messagesSearchParams);
