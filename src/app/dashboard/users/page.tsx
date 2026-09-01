"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import {
  deactivateUser,
  getAllUsers,
  reactivateUser,
  updateUserRole,
} from "@/services/users.service";
import { ApiResponse } from "@/types/api";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type RoleFilter = "all" | "admin" | "user";

export default function AdminUsersPage() {
  const { isOwner } = useAuth();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [search, setSearch] = useState("");

  const queryClient = useQueryClient();

  // Only the owner can access the Users page
  if (!isOwner) {
    router.replace("/dashboard");
    return null;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, roleFilter, search],
    queryFn: () =>
      getAllUsers({
        page,
        limit: 20,
        role: roleFilter === "all" ? undefined : roleFilter,
        search: search || undefined,
      }),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: "admin" | "user" }) =>
      updateUserRole(id, role),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deactivateMutation = useMutation<ApiResponse<User>, Error, string>({
    mutationFn: deactivateUser,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const reactivateMutation = useMutation<ApiResponse<User>, Error, string>({
    mutationFn: reactivateUser,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const users = data?.data || [];

  const TABS: { label: string; value: RoleFilter }[] = [
    { label: "All", value: "all" },
    { label: "Users", value: "user" },
    { label: "Admins", value: "admin" },
  ];

  return (
    <div className="p-6 md:p-10">
      {/* Breadcrumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Users",
          },
        ]}
      />

      {/* Heading */}
      <h1 className="mb-6 font-serif text-3xl text-black">Users</h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Role filters */}
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setRoleFilter(tab.value);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                roleFilter === tab.value
                  ? "bg-gold text-white"
                  : "bg-beige text-gray hover:bg-gold/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by username or email..."
          className="w-full rounded-md border border-beige bg-white px-4 py-2 text-sm text-black outline-none focus:border-gold sm:w-72"
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <p className="p-10 text-gray">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="rounded-xl border border-beige bg-white py-16 text-center text-gray">
          {search ? `No users match "${search}".` : "No users found."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user: User) => (
            <div
              key={user._id}
              className="flex flex-col items-start justify-between gap-3 rounded-xl border border-beige bg-white p-4 md:flex-row md:items-center"
            >
              <div>
                <p className="font-medium text-black">{user.username}</p>

                <p className="text-sm text-gray">{user.email}</p>

                <span className="mt-1 inline-block rounded bg-beige px-2 py-0.5 text-xs text-gold-dark">
                  {user.role}
                </span>

                {!user.isActive && (
                  <span className="ml-2 inline-block rounded bg-red-100 px-2 py-0.5 text-xs text-red-600">
                    Deactivated
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Promote / Demote */}
                <button
                  onClick={() =>
                    roleMutation.mutate({
                      id: user._id,
                      role: user.role === "admin" ? "user" : "admin",
                    })
                  }
                  disabled={roleMutation.isPending}
                  className="rounded-md bg-gold px-3 py-1.5 text-xs font-medium text-white hover:bg-gold-dark disabled:opacity-50"
                >
                  {user.role === "admin"
                    ? "Demote to User"
                    : "Promote to Admin"}
                </button>

                {/* Deactivate / Reactivate */}
                {user.isActive ? (
                  <button
                    onClick={() => deactivateMutation.mutate(user._id)}
                    disabled={deactivateMutation.isPending}
                    className="rounded-md border border-red-400 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => reactivateMutation.mutate(user._id)}
                    disabled={reactivateMutation.isPending}
                    className="rounded-md border border-green-500 px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 disabled:opacity-50"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border border-beige px-3 py-1.5 text-xs text-gray disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-xs text-gray">
            Page {data.currentPage} of {data.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === data.totalPages}
            className="rounded-md border border-beige px-3 py-1.5 text-xs text-gray disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
