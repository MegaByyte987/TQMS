"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { checkUsersApi } from "../api";
import type { CheckUserListParams } from "../types";

export function useCheckUsers(params: CheckUserListParams) {
  return useQuery({
    queryKey: ["check-users", params],
    queryFn: () => checkUsersApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCheckUser(id: string | null | undefined) {
  return useQuery({
    queryKey: ["check-users", id],
    queryFn: () => checkUsersApi.get(id!),
    enabled: Boolean(id),
  });
}