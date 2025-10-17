import type { ReactNode } from "react";
import { actions, selectors } from "store/contentSlice.ts";
import { useAppDispatch, useAppSelector } from "store/hooks.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "ui/dialog.tsx";

export interface IssuesDialogProps {
  children?: ReactNode;
}

export function IssuesDialog(p: IssuesDialogProps) {
  const isOpen = useAppSelector(selectors.isOpen);
  const dispatch = useAppDispatch();

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(actions.close())}>
      <DialogContent className="sm:max-w-[600px] sm:h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Anonymizer</DialogTitle>
          <DialogDescription>
            View issues and history for the anonymized emails.
          </DialogDescription>
        </DialogHeader>
        {p.children}
      </DialogContent>
    </Dialog>
  );
}
