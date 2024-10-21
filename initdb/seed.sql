
-- Seeding teachers
INSERT INTO teachers (nama, jenis_kelamin, "NIP", tanggal_lahir, "NUPTK") VALUES 
('Ahmad Zain', 'male', '123456789', '1980-01-01', '987654321'),
('Dewi Sri', 'female', '223456789', '1985-02-15', '887654321'),
('Budi Raharjo', 'male', '323456789', '1978-03-20', '787654321'),
('Siti Nur', 'female', '423456789', '1990-04-05', '687654321'),
('Joko Santoso', 'male', '523456789', '1983-05-25', '587654321');

-- Seeding classes
INSERT INTO classes (class_name, teacher_id) VALUES 
('Class 1', 1),
('Class 2', 2),
('Class 3', 3),
('Class 4', 4),
('Class 5', 5);

-- Seeding subjects
INSERT INTO subjects (subject_name) VALUES 
('Mathematics'),
('Physics'),
('Chemistry'),
('Biology'),
('History');

-- Seeding students
INSERT INTO students (nama, jenis_kelamin, "NISN") VALUES 
('Rizki Arifin', 'male', '10001'),
('Lina Agustina', 'female', '10002'),
('Taufik Hidayat', 'male', '10003'),
('Siti Marlina', 'female', '10004'),
('Andi Wijaya', 'male', '10005');

-- Seeding parents
INSERT INTO parents (nama, tahun_lahir, jenjang_pendidikan, pekerjaan, penghasilan, "NIK") VALUES 
('Sujono', 1970, 'SMA', 'Petani', '2 juta', '1234567890123456'),
('Sulastri', 1975, 'SMP', 'Ibu Rumah Tangga', 'Tidak ada', '2234567890123456'),
('Herman', 1980, 'Sarjana', 'Guru', '5 juta', '3234567890123456'),
('Ningsih', 1982, 'Diploma', 'Perawat', '3 juta', '4234567890123456'),
('Sugeng', 1973, 'SMA', 'Wiraswasta', '4 juta', '5234567890123456');

-- Seeding parents_students
INSERT INTO parents_students (parent_id, student_id, relationship) VALUES 
(1, 1, 'father'),
(2, 1, 'mother'),
(3, 2, 'father'),
(4, 3, 'mother'),
(5, 4, 'father');

-- Seeding student_assignments
INSERT INTO student_assignments (subject_id, date, deadline_date, title) VALUES 
(1, '2024-10-10', '2024-10-20', 'Math Assignment 1'),
(2, '2024-10-11', '2024-10-21', 'Physics Assignment 1'),
(3, '2024-10-12', '2024-10-22', 'Chemistry Assignment 1'),
(4, '2024-10-13', '2024-10-23', 'Biology Assignment 1'),
(5, '2024-10-14', '2024-10-24', 'History Assignment 1');

-- Seeding student_grades
INSERT INTO student_grades (student_id, student_assignment_id, grade, term) VALUES 
(1, 1, 85.50, 'Term 1'),
(2, 2, 90.00, 'Term 1'),
(3, 3, 78.75, 'Term 1'),
(4, 4, 88.00, 'Term 1'),
(5, 5, 92.50, 'Term 1');

-- Seeding attendances
INSERT INTO attendances (student_id, class_id, date, status) VALUES 
(1, 1, '2024-10-01', 'present'),
(2, 2, '2024-10-02', 'absent'),
(3, 3, '2024-10-03', 'excused'),
(4, 4, '2024-10-04', 'present'),
(5, 5, '2024-10-05', 'present');

-- Seeding feedbacks
INSERT INTO feedbacks (feedback_text, rating, date, teacher_id, parent_id) VALUES 
('Great teacher!', 5, '2024-10-10', 1, 1),
('Very helpful.', 4, '2024-10-11', 2, 2),
('Needs improvement.', 3, '2024-10-12', 3, 3),
('Excellent teaching!', 5, '2024-10-13', 4, 4),
('Average.', 3, '2024-10-14', 5, 5);

-- Seeding class_subjects
INSERT INTO class_subjects (class_id, subject_id) VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Seeding subject_teachers
INSERT INTO subject_teachers (subject_id, teacher_id) VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Seeding principals
INSERT INTO principals (nama, email, contact_number) VALUES 
('Hendra Saputra', 'hendra.principal@example.com', '081234567890'),
('Sri Rahayu', 'sri.principal@example.com', '081234567891'),
('Agus Susanto', 'agus.principal@example.com', '081234567892'),
('Lestari Dewi', 'lestari.principal@example.com', '081234567893'),
('Bambang Widodo', 'bambang.principal@example.com', '081234567894');
