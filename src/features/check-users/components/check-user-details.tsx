"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { DetailList } from "@/components/shared/detail-list";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatPhone, orDash } from "@/lib/formatters";
import { displayBS } from "@/lib/bs-date";
import type { CheckUser } from "@/features/check-users/types";

interface CheckUserDetailsProps {
  user: CheckUser | null;
  onClose: () => void;
}

export function CheckUserDetails({ user, onClose }: CheckUserDetailsProps) {
  return (
    <Drawer open={Boolean(user)} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent side="right" className="max-w-md">
        <DrawerHeader>
          <DrawerTitle>{user?.name ?? "Check User"}</DrawerTitle>
          <DrawerDescription>
            Read-only view. Use Edit to make changes.
          </DrawerDescription>
        </DrawerHeader>
        {user && (
          <DetailList
            rows={[
              { label: "Name", value: user.name },
              {
                label: "Status",
                value: (
                  <StatusBadge
                    label={user.status ? "Active" : "Inactive"}
                    variant={user.status ? "ok" : "muted"}
                  />
                ),
              },
              { label: "Mobile", value: formatPhone(user.mobileNumber) },
              { label: "Email", value: orDash(user.email) },
              { label: "Address", value: orDash(user.streetAddress) },
              { label: "Created", value: displayBS(user.createdAtBS) },
            ]}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}