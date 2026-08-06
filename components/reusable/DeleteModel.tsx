"use client";

import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

interface DeleteModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onDelete: () => void;
  loading: boolean;
  requireAcceptCheckbox?: boolean;
  acceptLabel?: string;
  confirmLabel?: string;
}

export function DeleteModel({
  open,
  onOpenChange,
  title,
  description,
  onDelete,
  loading,
  requireAcceptCheckbox = false,
  acceptLabel = "I understand and accept this action",
  confirmLabel = "Delete",
}: DeleteModelProps) {
  const [acceptChecked, setAcceptChecked] = useState(false);

  useEffect(() => {
    if (!open) setAcceptChecked(false);
  }, [open]);

  const canConfirm = !requireAcceptCheckbox || acceptChecked;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">

        <AlertDialogHeader>

          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>

          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>

          {requireAcceptCheckbox && (
            <div className="flex items-start gap-2 mt-3">
              <Checkbox
                checked={acceptChecked}
                onCheckedChange={(v) => setAcceptChecked(!!v)}
              />
              <span className="text-sm text-gray-600">
                {acceptLabel}
              </span>
            </div>
          )}

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel variant="outline" disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            onClick={onDelete}
            disabled={loading || !canConfirm}
          >
            {loading ? "Deleting..." : confirmLabel}
          </AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}