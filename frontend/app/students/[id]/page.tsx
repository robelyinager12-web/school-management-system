"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Droplet, Calendar, Mail, Users } from "lucide-react";
import { useStudent } from "@/hooks/use-student";
import { useDeleteStudent } from "@/hooks/use-delete-student";
import { StatusBadge } from "@/components/tables/status-badge";
import { InfoRow } from "@/components/cards/info-row";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: student, isLoading } = useStudent(id);
  const deleteStudent = useDeleteStudent();
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await deleteStudent.mutateAsync(id);
    router.push("/students");
  }

  if (isLoading) {
    return <div className="glass-panel h-64 animate-pulse rounded-2xl" />;
  }

  if (!student) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-white/50">
        Student not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/students"
        className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Students
      </Link>

      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-semibold text-white">
              {student.user.firstName[0]}
              {student.user.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {student.user.firstName} {student.user.lastName}
              </h1>
              <p className="text-sm text-white/50">{student.admissionNo}</p>
              <div className="mt-1">
                <StatusBadge status={student.user.status} />
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
          >
            <Trash2 size={14} />
            {confirmDelete ? "Confirm Delete" : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/70">
            <Mail size={14} /> Personal Information
          </h2>
          <InfoRow label="Email" value={student.user.email} />
          <InfoRow
            label="Date of Birth"
            value={formatDate(student.dateOfBirth)}
          />
          <InfoRow label="Gender" value={student.user.gender || "Not specified"} />
          <InfoRow
            label="Blood Group"
            value={student.bloodGroup || "Not specified"}
          />
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/70">
            <Calendar size={14} /> Academic Information
          </h2>
          <InfoRow
            label="Class"
            value={student.section?.class.name || "Unassigned"}
          />
          <InfoRow
            label="Section"
            value={student.section?.name || "Unassigned"}
          />
          <InfoRow label="Admission No" value={student.admissionNo} />
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/70">
          <Users size={14} /> Guardians
        </h2>
        {student.guardians.length === 0 ? (
          <p className="py-4 text-sm text-white/40">No guardians linked</p>
        ) : (
          student.guardians.map((g, i) => (
            <InfoRow
              key={i}
              label={`${g.parent.user.firstName} ${g.parent.user.lastName} (${g.relation})`}
              value={g.parent.user.email}
            />
          ))
        )}
      </div>
    </div>
  );
}