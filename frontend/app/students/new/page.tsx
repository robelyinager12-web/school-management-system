"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  createStudentFormSchema,
  CreateStudentFormValues,
} from "@/lib/validators/student";
import { useCreateStudent } from "@/hooks/use-create-student";
import { TextField } from "@/components/forms/text-field";
import { cn } from "@/lib/utils";

export default function NewStudentPage() {
  const router = useRouter();
  const createStudent = useCreateStudent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentFormSchema),
  });

  async function onSubmit(values: CreateStudentFormValues) {
    try {
      await createStudent.mutateAsync(values);
      router.push("/students");
    } catch {
      // error surfaced via createStudent.error below
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/students"
        className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Students
      </Link>

      <div>
        <h1 className="gradient-text text-3xl font-bold">Add Student</h1>
        <p className="mt-1 text-white/60">Enroll a new student into the system</p>
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

        <TextField
          label="Email"
          type="email"
          placeholder="student@school.com"
          registration={register("email")}
          error={errors.email?.message}
        />

        <TextField
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          registration={register("password")}
          error={errors.password?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Admission Number"
            placeholder="ADM-1010"
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

        <TextField
          label="Blood Group (optional)"
          placeholder="O+"
          registration={register("bloodGroup")}
        />

        {createStudent.isError && (
          <p className="text-sm text-red-400">
            {(createStudent.error as any)?.response?.data?.error || "Failed to create student"}
          </p>
        )}

        <button
          type="submit"
          disabled={createStudent.isPending}
          className={cn(
            "w-full rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 px-4 py-2.5 font-medium text-white transition hover:opacity-90",
            createStudent.isPending && "cursor-not-allowed opacity-60"
          )}
        >
          {createStudent.isPending ? "Creating..." : "Create Student"}
        </button>
      </form>
    </div>
  );
}