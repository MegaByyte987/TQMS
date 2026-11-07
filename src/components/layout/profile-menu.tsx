"use client";

import Link from "next/link";
import { KeyRound, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/hooks/use-logout";
import type { AuthUser } from "@/lib/auth";

export function ProfileMenu({ user }: { user: AuthUser }) {
  const logout = useLogout();
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open profile menu"
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {initials || "CU"}
          </span>
          <span className="hidden max-w-32 truncate sm:inline">
            {user.name}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-slate-900">
            {user.name}
          </span>
          <span className="text-xs font-normal text-slate-500">
            {user.checkpoint}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="size-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/change-password" className="cursor-pointer">
            <KeyRound className="size-4" />
            Change Password
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700"
          disabled={logout.isPending}
          onSelect={() => logout.mutate()}
        >
          <LogOut className="size-4" />
          {logout.isPending ? "Signing out…" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}