"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextField } from "@/components/shared/form-field";
import { useUpdateNarration } from "../hooks/use-narration-mutations";
import { narrationEditSchema, type NarrationEditValues } from "../schemas";
import type { Narration } from "../types";

interface Props {
  narration: Narration | null;
  onClose: () => void;
}

export function NarrationEditDialog({ narration, onClose }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<NarrationEditValues>({
    resolver: zodResolver(narrationEditSchema),
    defaultValues: { text: narration?.text ?? "" },
  });

  useEffect(() => {
    reset({ text: narration?.text ?? "" });
  }, [narration, reset]);

  const update = useUpdateNarration();

  return (
    <Dialog open={Boolean(narration)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit narration</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) =>
            narration &&
            update.mutate(
              { id: narration.id, body: values },
              { onSuccess: onClose }
            )
          )}
          className="flex flex-col gap-4"
          noValidate
        >
          <TextField
            name="text"
            control={control}
            label="Narration"
            placeholder="Enter narration"
            required
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={update.isPending || !isDirty}
            >
              {update.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}