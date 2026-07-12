"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import {
  updateStudentFormSchema,
  UpdateStudentFormValues,
} from "@/lib/validators/student";
import { useStudent } from "@/hooks/use-student";
import { useUpdateStudent } from "@/hooks/use-update-student";
import { useSections } from "@/hooks/use-sections";
import { TextField } from "@/components/forms/text-field";
import { SelectField } from "@/components/forms/select-field";
import { cn } from "@/lib/utils";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: student, isLoading } = useStudent(id);
  const { data: sections } = useSections();
  const updateStudent = useUpdateStudent(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateStudentFormValues>({
    resolver: zodResolver(updateStudentFormSchema),
  });

  useEffect(() => {
    if (student) {
      reset({
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        admissionNo: student.admissionNo,
        dateOfBirth: student.dateOfBirth.split("T")[0],
        bloodGroup: student.bloodGroup || undefined,
        gender: (student.user.gender as any) || undefined,
        status: student.user.status as any,
        sectionId: (student as any).sectionId || undefined,
      });
    }
  }, [student, reset]);

  async function onSubmit(values: UpdateStudentFormValues) {
    try {
      await updateStudent.mutateAsync(values);
      router.push(`/students/${id}`);
    } catch {
      // error surfaced below
    }
  }

  function getErrorMessage(): string {
    const err = (updateStudent.error as any)?.response?.data?.error;
    if (!err) return "Failed to update student";
    if (typeof err === "string") return err;
    if (err?.fieldErrors) {
      const messages = Object.values(err.fieldErrors).flat();
      if (messages.length > 0) return messages.join(", ");
    }
    return "Failed to update student";
  }

  if (isLoading) {
    return <div className="glass-panel h-64 animate-pulse rounded-2xl" />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/students/${id}`}
        className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Profile
      </Link>

      <div>
        <h1 className="gradient-text text-3xl font-bold">Edit Student</h1>
        <p className="mt-1 text-white/60">Update student information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel space-y-4 rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="First Name"
            registration={register("firstName")}
            error={errors.firstName?.message}
          />
          <TextField
            label="Last Name"
            registration={register("lastName")}
            error={errors.lastName?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Admission Number"
            registration={register("admissionNo")}
            error={errors.admissionNo?.message}
          />
          <TextField
            label="Date of Birth"
            type="date"
            registration={register("dateOfBirth")}
            error={errors.dateOfBirth?.message}
          />
        </div>

        <SelectField
          label="Class / Section"
          placeholder="Select section"
          registration={register("sectionId")}
          options={(sections || []).map((s) => ({
            value: s.id,
            label: `${s.class.name} - ${s.name}`,
          }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Blood Group"
            placeholder="Select blood group"
            registration={register("bloodGroup")}
            options={[
              { value: "A+", label: "A+" },
              { value: "A-", label: "A-" },
              { value: "B+", label: "B+" },
              { value: "B-", label: "B-" },
              { value: "AB+", label: "AB+" },
              { value: "AB-", label: "AB-" },
              { value: "O+", label: "O+" },
              { value: "O-", label: "O-" },
            ]}
          />
          <SelectField
            label="Status"
            registration={register("status")}
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "PENDING", label: "Pending" },
              { value: "SUSPENDED", label: "Suspended" },
              { value: "DEACTIVATED", label: "Deactivated" },
            ]}
          />
        </div>

        <SelectField
          label="Gender"
          placeholder="Select gender"
          registration={register("gender")}
          options={[
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
            { value: "OTHER", label: "Other" },
          ]}
        />

        {updateStudent.isError && (
          <p className="text-sm text-red-400">{getErrorMessage()}</p>
        )}

        <button
          type="submit"
          disabled={updateStudent.isPending}
          className={cn(
            "w-full rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 px-4 py-2.5 font-medium text-white transition hover:opacity-90",
            updateStudent.isPending && "cursor-not-allowed opacity-60"
          )}
        >
          {updateStudent.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}