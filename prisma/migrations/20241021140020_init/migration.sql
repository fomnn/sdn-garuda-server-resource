-- CreateEnum
CREATE TYPE "agama" AS ENUM ('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha');

-- CreateEnum
CREATE TYPE "attendance_status" AS ENUM ('present', 'absent', 'excused');

-- CreateEnum
CREATE TYPE "jenis_kelamin" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "jenis_tinggal" AS ENUM ('Bersama Orang Tua', 'Lainnya');

-- CreateEnum
CREATE TYPE "parent_student_relationships" AS ENUM ('father', 'mother', 'guardian');

-- CreateEnum
CREATE TYPE "status_kepegawaian" AS ENUM ('PNS', 'Guru Honor Sekolah', 'GTY/PTY', 'PPPK');

-- CreateEnum
CREATE TYPE "teacher_roles" AS ENUM ('teacher', 'staff');

-- CreateTable
CREATE TABLE "class_subjects" (
    "class_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,

    CONSTRAINT "class_subjects_pkey" PRIMARY KEY ("class_id","subject_id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "class_name" TEXT NOT NULL,
    "teacher_id" INTEGER,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" SERIAL NOT NULL,
    "feedback_text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "parent_id" INTEGER NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tahun_lahir" INTEGER,
    "jenjang_pendidikan" TEXT NOT NULL,
    "pekerjaan" TEXT NOT NULL,
    "penghasilan" TEXT NOT NULL,
    "NIK" TEXT NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents_students" (
    "parent_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "relationship" "parent_student_relationships",

    CONSTRAINT "parents_students_pkey" PRIMARY KEY ("parent_id","student_id")
);

-- CreateTable
CREATE TABLE "student_grades" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "student_assignment_id" INTEGER NOT NULL,
    "grade" DECIMAL(5,2) NOT NULL,
    "term" TEXT NOT NULL,

    CONSTRAINT "student_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "jenis_kelamin" "jenis_kelamin" NOT NULL,
    "NISN" TEXT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_teachers" (
    "subject_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "subject_teachers_pkey" PRIMARY KEY ("subject_id","teacher_id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "subject_name" TEXT NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "jenis_kelamin" "jenis_kelamin" NOT NULL,
    "NIP" TEXT NOT NULL,
    "tanggal_lahir" DATE,
    "NUPTK" TEXT NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "date" DATE,
    "status" "attendance_status",

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "principals" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,

    CONSTRAINT "principals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_assignments" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "deadline_date" DATE,
    "title" TEXT NOT NULL,

    CONSTRAINT "student_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parents_students_parent_id_student_id_idx" ON "parents_students"("parent_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_NISN_key" ON "students"("NISN");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_NIP_key" ON "teachers"("NIP");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_NUPTK_key" ON "teachers"("NUPTK");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_student_id_class_id_date_idx" ON "attendances"("student_id", "class_id", "date");

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parents_students" ADD CONSTRAINT "parents_students_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parents_students" ADD CONSTRAINT "parents_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_grades" ADD CONSTRAINT "student_grades_student_assignment_id_fkey" FOREIGN KEY ("student_assignment_id") REFERENCES "student_assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_grades" ADD CONSTRAINT "student_grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_teachers" ADD CONSTRAINT "subject_teachers_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_teachers" ADD CONSTRAINT "subject_teachers_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_assignments" ADD CONSTRAINT "student_assignments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
