import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useMessageFilters } from "@/features/messages/hooks/use-message-filters";

export const MessageSearchFilter = () => {
  const [filters, setFilters] = useMessageFilters();

  return (
    <InputGroup>
      <InputGroupInput
        placeholder="Search messages..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};
