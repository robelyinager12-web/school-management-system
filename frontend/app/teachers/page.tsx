"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useTeachers } from "@/hooks/use-teachers";
import { StatusBadge } from "@/components/tables/status-badge";

export default function TeachersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useTeachers(page, search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="gradient-text text-3xl font-bold">Teachers</h1>
          <p className="mt-1 text-white/60">Manage all teaching staff</p>
        </div>
        <Link
          href="/teachers/new"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} />
          Add Teacher
        </Link>
      </div>

      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/50">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full bg-transparent outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="px-5 py-3 font-medium">Teacher</th>
              <th className="px-5 py-3 font-medium">Employee No</th>
              <th className="px-5 py-3 font-medium">Department</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-white/40">
                  Loading...
                </td>
              </tr>
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-white/40">
                  No teachers found
                </td>
              </tr>
            ) : (
              data?.data.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="border-b border-white/5 text-white/80 hover:bg-white/5"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-semibold text-white">
                        {teacher.user.firstName[0]}
                        {teacher.user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {teacher.user.firstName} {teacher.user.lastName}
                        </p>
                        <p className="text-xs text-white/40">{teacher.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">{teacher.employeeNo}</td>
                  <td className="px-5 py-3">{teacher.department?.name || "Unassigned"}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={teacher.user.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/teachers/${teacher.id}`}
                      className="text-purple-400 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-sm text-white/50">
            <p>
              Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg p-1.5 hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                disabled={page === data.meta.totalPages}
                className="rounded-lg p-1.5 hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}