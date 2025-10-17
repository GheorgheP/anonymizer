import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { actions, selectors } from "store/contentSlice.ts";
import { useAppDispatch, useAppSelector } from "store/hooks.ts";
import { Button } from "ui/button";
import { ButtonGroup } from "ui/button-group";
import { Input } from "ui/input";

export function HistoryFilters() {
  return (
    <div className="flex items-center space-x-4 p-[2px]">
      <Search />
      <DismissFilters />
      <DismissAll />
    </div>
  );
}

function Search() {
  const search = useAppSelector(selectors.filtersSearch);
  const dispatch = useAppDispatch();

  return (
    <Input
      placeholder="Search issues..."
      value={search}
      onChange={(v) => dispatch(actions.search(v.target.value))}
      className="flex-1"
    />
  );
}

function DismissFilters() {
  const status = useAppSelector(selectors.filtersStatus);
  const dispatch = useAppDispatch();

  return (
    <ButtonGroup>
      <Button
        variant={status === "active" ? "default" : "secondary"}
        onClick={() => dispatch(actions.setStatus("active"))}
      >
        Active
      </Button>
      <Button
        variant={status === "dismissed" ? "default" : "secondary"}
        onClick={() => dispatch(actions.setStatus("dismissed"))}
      >
        Dismissed
      </Button>
    </ButtonGroup>
  );
}

function DismissAll() {
  const hasDismissable = useAppSelector(selectors.filteredHasDismissable);
  const dispatch = useAppDispatch();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="destructive" disabled={!hasDismissable}>
          Dismiss All
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => dispatch(actions.dismissAll())}>
            Confirm
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
