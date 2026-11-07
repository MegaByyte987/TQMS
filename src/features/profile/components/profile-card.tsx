"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DetailList } from "@/components/shared/detail-list";
import type { AuthUser } from "@/lib/auth";

interface Props {
  user: AuthUser;
}

export function ProfileCard({ user }: Props) {
  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Your account details."
        actions={
          <Button asChild>
            <Link href="/profile/change-password">
              <KeyRound className="size-4" aria-hidden="true" />
              Change password
            </Link>
          </Button>
        }
      />
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-4">
        <DetailList
          rows={[
            { label: "Name", value: user.name },
            { label: "Role", value: user.role },
            { label: "Checkpoint", value: user.checkpoint },
          ]}
        />
      </div>
    </div>
  );
}