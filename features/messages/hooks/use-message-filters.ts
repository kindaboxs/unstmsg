import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { DEFAULT_LIMIT_MESSAGES } from "@/constants";

export const useMessageFilters = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
      history: "push",
    }),
    limit: parseAsInteger.withDefault(DEFAULT_LIMIT_MESSAGES).withOptions({
      clearOnDefault: true,
      history: "push",
    }),
  });
};
