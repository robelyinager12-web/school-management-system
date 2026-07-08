import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  const school = await prisma.school.findFirst();
  if (!school) {
    throw new Error("No school found. Register at least one admin user first.");
  }

  const department = await prisma.department.create({
    data: { name: "Science Department", schoolId: school.id },
  });

  const klass = await prisma.class.create({
    data: { name: "Grade 9", schoolId: school.id },
  });

  const section = await prisma.section.create({
    data: { name: "Section A", classId: klass.id, capacity: 40 },
  });

  const subject = await prisma.subject.create({
    data: { name: "Mathematics", code: "MATH101", departmentId: department.id },
  });

  const passwordHash = await bcrypt.hash("password123", 10);

  // ---- Teachers ----
  const teacherNames = [
    ["Amanuel", "Tesfaye"],
    ["Selam", "Bekele"],
    ["Dawit", "Alemu"],
  ];

  const teachers = [];
  for (let i = 0; i < teacherNames.length; i++) {
    const [firstName, lastName] = teacherNames[i];
    const user = await prisma.user.create({
      data: {
        email: `teacher${i + 1}@heroy.com`,
        passwordHash,
        firstName,
        lastName,
        role: "TEACHER",
        schoolId: school.id,
        status: "ACTIVE",
      },
    });
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        employeeNo: `EMP-T${i + 1}`,
        departmentId: department.id,
      },
    });
    teachers.push(teacher);
  }

  // ---- Fee structure ----
  const feeStructure = await prisma.feeStructure.create({
    data: {
      name: "Term Fee",
      amount: 500,
      classId: klass.id,
      frequency: "TERM",
    },
  });

  // ---- Students + Parents + Attendance + Invoices ----
  const studentNames = [
    ["Hana", "Girma"],
    ["Yonas", "Kebede"],
    ["Marta", "Assefa"],
    ["Nahom", "Wolde"],
    ["Ruth", "Mekonnen"],
    ["Samuel", "Getachew"],
    ["Bethel", "Tadesse"],
    ["Kalkidan", "Haile"],
  ];

  for (let i = 0; i < studentNames.length; i++) {
    const [firstName, lastName] = studentNames[i];

    const studentUser = await prisma.user.create({
      data: {
        email: `student${i + 1}@heroy.com`,
        passwordHash,
        firstName,
        lastName,
        role: "STUDENT",
        schoolId: school.id,
        status: "ACTIVE",
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        admissionNo: `ADM-${1000 + i}`,
        dateOfBirth: new Date(2010, i % 12, (i % 28) + 1),
        sectionId: section.id,
      },
    });

    const parentUser = await prisma.user.create({
      data: {
        email: `parent${i + 1}@heroy.com`,
        passwordHash,
        firstName: `${firstName}'s`,
        lastName: `Parent`,
        role: "PARENT",
        schoolId: school.id,
        status: "ACTIVE",
      },
    });

    const parent = await prisma.parent.create({
      data: { userId: parentUser.id },
    });

    await prisma.parentStudent.create({
      data: { parentId: parent.id, studentId: student.id, relation: "Parent" },
    });

    // Attendance for the last 14 days
    for (let day = 0; day < 14; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);

      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      if (isWeekend) continue;

      const roll = Math.random();
      const status = roll > 0.9 ? "ABSENT" : roll > 0.85 ? "LATE" : "PRESENT";

      await prisma.attendance.create({
        data: {
          studentId: student.id,
          date,
          status,
          markedById: teachers[i % teachers.length].id,
        },
      });
    }

    // Invoice + partial/paid payments over last 30 days
    const invoice = await prisma.invoice.create({
      data: {
        studentId: student.id,
        feeStructureId: feeStructure.id,
        amountDue: 500,
        amountPaid: 500,
        status: "PAID",
        dueDate: new Date(),
      },
    });

    const paymentDate = new Date();
    paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 30));

    await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: 500,
        method: "BANK_TRANSFER",
        paidAt: paymentDate,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });