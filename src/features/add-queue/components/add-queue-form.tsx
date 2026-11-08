"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  SelectField,
  DateBSField,
} from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { useLookup } from "@/lib/use-lookup";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { todayBS } from "@/lib/bs-date";
import {
  addQueueFormSchema,
  type AddQueueFormValues,
} from "../schemas";
import { ReceiptPreview } from "./receipt-preview";
import { useCreateQueue } from "../hooks/use-create-queue";
import type { CreateQueueResponse, ReceiptDraft } from "../types";

interface AddQueueFormProps {
  onIssued: (data: CreateQueueResponse) => void;
}

const DEFAULT_FEES = [{ label: "काटा शुल्क", amount: 50 }];

export function AddQueueForm({ onIssued }: AddQueueFormProps) {
  const { control, handleSubmit, watch } = useForm<AddQueueFormValues>({
    resolver: zodResolver(addQueueFormSchema),
    defaultValues: {
      vehicleId: "",
      fromCheckpointId: "",
      toCheckpointId: "",
      grossWeight: undefined,
      entryDateBS: todayBS(),
      transportCompany: "",
      loadDetails: "",
      narration: "",
      driverPhone: "",
    },
  });

  const createMutation = useCreateQueue(onIssued);

  const vehiclesQuery = useQuery({
    queryKey: ["vehicles", "lookup"],
    queryFn: async () => {
      const res = await api.get<{ id: string; plateNo: string }[]>(
        "/vehicles?pageSize=100"
      );
      return res.data.map((v) => ({ value: v.id, label: v.plateNo }));
    },
    staleTime: 60_000,
  });

  const checkpointsQuery = useLookup("checkpoints");

  const narrationsQuery = useQuery({
    queryKey: ["narrations", "lookup"],
    queryFn: async () => {
      const res = await api.get<{ id: string; text: string }[]>(
        "/narrations?pageSize=100"
      );
      return res.data.map((n) => ({ value: n.id, label: n.text }));
    },
    staleTime: 60_000,
  });

  const values = watch();
  const selectedVehicle = vehiclesQuery.data?.find(
    (v) => v.value === values.vehicleId
  );
  const selectedFrom = checkpointsQuery.data?.find(
    (c) => c.value === values.fromCheckpointId
  );
  const selectedNarration = narrationsQuery.data?.find(
    (n) => n.value === values.narration
  );

  const draft: ReceiptDraft = {
    receiptNo: undefined,
    dateBS: values.entryDateBS,
    time: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    weighStation: selectedFrom?.label ?? "",
    vehicleNo: selectedVehicle?.label ?? "",
    goods: values.loadDetails ?? "",
    description: selectedNarration?.label ?? "",
    weightKg: Number(values.grossWeight) || 0,
    feeLines: DEFAULT_FEES,
  };

  return (
    <form noValidate>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(280px,320px)]">
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-tight text-[var(--color-fg)]">
            Queue entry
          </h2>
          <SelectField
            name="vehicleId"
            control={control}
            label="Vehicle"
            options={vehiclesQuery.data ?? []}
            placeholder="Select vehicle…"
            required
            isLoading={vehiclesQuery.isPending}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              name="fromCheckpointId"
              control={control}
              label="From"
              options={checkpointsQuery.data ?? []}
              placeholder="Select start point…"
              required
            />
            <SelectField
              name="toCheckpointId"
              control={control}
              label="To"
              options={checkpointsQuery.data ?? []}
              placeholder="Select destination…"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              name="grossWeight"
              control={control}
              label="Gross weight (kg)"
              type="number"
              placeholder="e.g. 12000"
              required
              valueAsNumber
            />
            <DateBSField
              name="entryDateBS"
              control={control}
              label="Entry date"
              required
            />
          </div>
          <TextField
            name="transportCompany"
            control={control}
            label="Transport company"
            placeholder="Optional"
          />
          <TextField
            name="loadDetails"
            control={control}
            label="Load details (समान)"
            placeholder="e.g. Cement bags — 200 units"
            required
          />
          <SelectField
            name="narration"
            control={control}
            label="Narration (विवरण)"
            options={narrationsQuery.data ?? []}
            placeholder="Select narration…"
          />
          <TextField
            name="driverPhone"
            control={control}
            label="Driver phone"
            type="tel"
            placeholder="98XXXXXXXX"
          />
          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              size="lg"
            >
              {createMutation.isPending ? "Issuing receipt…" : "Issue receipt"}
            </Button>
          </div>
        </div>
        <div className="lg:sticky lg:top-4 lg:self-start">
          <h2 className="mb-2 text-sm font-semibold tracking-tight text-[var(--color-fg)]">
            Receipt preview
          </h2>
          <ReceiptPreview draft={draft} />
        </div>
      </div>
    </form>
  );
}