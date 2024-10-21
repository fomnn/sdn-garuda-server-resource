CREATE TYPE "jenis_kelamin" AS ENUM (
  'male',
  'female'
);

CREATE TYPE "agama" AS ENUM (
  'Islam',
  'Kristen',
  'Katolik',
  'Hindu',
  'Buddha'
);

CREATE TYPE "jenis_tinggal" AS ENUM (
  'Bersama Orang Tua',
  'Lainnya'
);

CREATE TYPE "parent_student_relationships" AS ENUM (
  'father',
  'mother',
  'guardian'
);

CREATE TYPE "teacher_roles" AS ENUM (
  'teacher',
  'staff'
);

CREATE TYPE "status_kepegawaian" AS ENUM (
  'PNS',
  'Guru Honor Sekolah',
  'GTY/PTY',
  'PPPK'
);

CREATE TYPE "attendance_status" AS ENUM (
  'present',
  'absent',
  'excused'
);

CREATE TABLE "students" (
  "id" serial PRIMARY KEY,
  "nama" text NOT NULL,
  "jenis_kelamin" jenis_kelamin NOT NULL,
  "NISN" text UNIQUE NOT NULL
);

CREATE TABLE "parents" (
  "id" serial PRIMARY KEY,
  "nama" text NOT NULL,
  "tahun_lahir" int,
  "jenjang_pendidikan" text NOT NULL,
  "pekerjaan" text NOT NULL,
  "penghasilan" text NOT NULL,
  "NIK" text NOT NULL
);

CREATE TABLE "parents_students" (
  "parent_id" int NOT NULL,
  "student_id" int NOT NULL,
  "relationship" parent_student_relationships,
  PRIMARY KEY ("parent_id", "student_id")
);

CREATE TABLE "teachers" (
  "id" serial PRIMARY KEY,
  "nama" text NOT NULL,
  "jenis_kelamin" jenis_kelamin NOT NULL,
  "NIP" text UNIQUE NOT NULL,
  "tanggal_lahir" date,
  "NUPTK" text UNIQUE NOT NULL
);

CREATE TABLE "principals" (
  "id" serial PRIMARY KEY,
  "nama" text NOT NULL,
  "email" text NOT NULL,
  "contact_number" text NOT NULL
);

CREATE TABLE "classes" (
  "id" serial PRIMARY KEY,
  "class_name" text NOT NULL,
  "teacher_id" int
);

CREATE TABLE "class_subjects" (
  "class_id" int,
  "subject_id" int,
  PRIMARY KEY ("class_id", "subject_id")
);

CREATE TABLE "subjects" (
  "id" serial PRIMARY KEY,
  "subject_name" text NOT NULL
);

CREATE TABLE "student_assignments" (
  "id" serial PRIMARY KEY,
  "subject_id" int NOT NULL,
  "date" date NOT NULL,
  "deadline_date" date,
  "title" text NOT NULL
);

CREATE TABLE "subject_teachers" (
  "subject_id" int,
  "teacher_id" int,
  PRIMARY KEY ("subject_id", "teacher_id")
);

CREATE TABLE "attendances" (
  "id" serial PRIMARY KEY,
  "student_id" int NOT NULL,
  "class_id" int NOT NULL,
  "date" date,
  "status" attendance_status
);

CREATE TABLE "student_grades" (
  "id" serial PRIMARY KEY,
  "student_id" int NOT NULL,
  "student_assignment_id" int NOT NULL,
  "grade" decimal(5,2) NOT NULL,
  "term" text NOT NULL
);

CREATE TABLE "feedbacks" (
  "id" serial PRIMARY KEY,
  "feedback_text" text NOT NULL,
  "rating" int NOT NULL,
  "date" date NOT NULL,
  "teacher_id" int NOT NULL,
  "parent_id" int NOT NULL
);

CREATE UNIQUE INDEX ON "parents_students" ("parent_id", "student_id");

CREATE UNIQUE INDEX ON "attendances" ("student_id", "class_id", "date");

ALTER TABLE "parents_students" ADD FOREIGN KEY ("parent_id") REFERENCES "parents" ("id");

ALTER TABLE "parents_students" ADD FOREIGN KEY ("student_id") REFERENCES "students" ("id");

ALTER TABLE "classes" ADD FOREIGN KEY ("teacher_id") REFERENCES "teachers" ("id");

ALTER TABLE "class_subjects" ADD FOREIGN KEY ("class_id") REFERENCES "classes" ("id");

ALTER TABLE "class_subjects" ADD FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id");

ALTER TABLE "student_assignments" ADD FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id");

ALTER TABLE "subject_teachers" ADD FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id");

ALTER TABLE "subject_teachers" ADD FOREIGN KEY ("teacher_id") REFERENCES "teachers" ("id");

ALTER TABLE "attendances" ADD FOREIGN KEY ("student_id") REFERENCES "students" ("id");

ALTER TABLE "attendances" ADD FOREIGN KEY ("class_id") REFERENCES "classes" ("id");

ALTER TABLE "student_grades" ADD FOREIGN KEY ("student_id") REFERENCES "students" ("id");

ALTER TABLE "student_grades" ADD FOREIGN KEY ("student_assignment_id") REFERENCES "student_assignments" ("id");

ALTER TABLE "feedbacks" ADD FOREIGN KEY ("teacher_id") REFERENCES "teachers" ("id");

ALTER TABLE "feedbacks" ADD FOREIGN KEY ("parent_id") REFERENCES "parents" ("id");
