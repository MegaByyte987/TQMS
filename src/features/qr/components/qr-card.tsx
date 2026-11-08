"use client";

import Image from "next/image";
import { Copy, Download, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useQr } from "../hooks/use-qr";
import { useToast } from "@/providers/toast-provider";

export function QrCard() {
  const query = useQr();
  const { toast } = useToast();

  if (query.isPending) {
    return <Skeleton className="h-80 w-80 rounded-[12px]" />;
  }

  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  }

  const { dataUrl, payload } = query.data.data;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      toast("success", "Token copied.");
    } catch {
      toast("error", "Could not copy.");
    }
  };

  const onDownload = () => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `tqms-qr-${payload.slice(0, 8)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast("success", "QR downloaded.");
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-6">
      <Image
        src={dataUrl}
        alt={`QR code encoding token ${payload.slice(0, 8)}…`}
        width={288}
        height={288}
        unoptimized
        className="rounded-[8px]"
      />
      <p className="text-[12px] text-[var(--color-mut)]">
        Token: <span className="font-mono text-[var(--color-fg)]">{payload}</span>
      </p>
      <p className="max-w-md text-center text-[12px] text-[var(--color-mut)]">
        Scan this code at a checkpoint to identify the current session. The
        token expires when the page is closed.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" onClick={() => query.refetch()}>
          <RotateCw className="size-4" aria-hidden="true" />
          Regenerate
        </Button>
        <Button variant="outline" onClick={onCopy}>
          <Copy className="size-4" aria-hidden="true" />
          Copy token
        </Button>
        <Button onClick={onDownload}>
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
      </div>
    </div>
  );
}