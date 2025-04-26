/* This JavaScript code is defining a function called `initDb` that initializes a database by creating
tables for students, authors, publishers, books, reservations, and fines. It also inserts mock data
into these tables for testing purposes. */
// import 'dotenv/config';
// import pool from '../config/db.js';
// import bcrypt from 'bcryptjs';

// const p = pool.promise();

// const initDb = async () => {
//   try {
//     console.log('Initializing database...');
//     await p.query('DROP TABLE IF EXISTS fines, reservations, books, publishers, authors, students');
//     console.log('✅ Old tables dropped (if existed)');

//     await p.query(`
//       CREATE TABLE IF NOT EXISTS students (
//         member_id INT AUTO_INCREMENT PRIMARY KEY,
//         roll_no VARCHAR(20) UNIQUE NOT NULL,
//         first_name VARCHAR(50) NOT NULL,
//         last_name VARCHAR(50) NOT NULL,
//         email VARCHAR(100) UNIQUE NOT NULL,
//         phone VARCHAR(15) NOT NULL,
//         dob DATE NOT NULL,
//         age INT CHECK (age >= 10),
//         membership_type ENUM('basic','premium') DEFAULT 'basic',
//         registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//         total_books_issued INT DEFAULT 0,
//         password VARCHAR(100) NOT NULL
//       )
//     `);
//     console.log('✅ Table "students" created');

//     await p.query(`
//       CREATE TABLE IF NOT EXISTS authors (
//         author_id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         biography TEXT,
//         nationality VARCHAR(50)
//       )
//     `);
//     console.log('✅ Table "authors" created');

//     await p.query(`
//       CREATE TABLE IF NOT EXISTS publishers (
//         publisher_id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         location VARCHAR(100),
//         contact VARCHAR(30)
//       )
//     `);
//     console.log('✅ Table "publishers" created');

//     await p.query(`
//       CREATE TABLE IF NOT EXISTS books (
//         book_id INT AUTO_INCREMENT PRIMARY KEY,
//         isbn VARCHAR(13) UNIQUE NOT NULL,
//         title VARCHAR(200) NOT NULL,
//         genre VARCHAR(50),
//         total_copies INT DEFAULT 1,
//         available_copies INT DEFAULT 1,
//         author_id INT,
//         publisher_id INT,
//         published_year INT,
//         FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE SET NULL,
//         FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id) ON DELETE SET NULL
//       )
//     `);
//     console.log('✅ Table "books" created');

//     await p.query(`
//       CREATE TABLE IF NOT EXISTS reservations (
//         reservation_id INT AUTO_INCREMENT PRIMARY KEY,
//         member_id INT,
//         book_id INT,
//         reservation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//         status ENUM('pending','approved','rejected') DEFAULT 'pending',
//         FOREIGN KEY (member_id) REFERENCES students(member_id) ON DELETE CASCADE,
//         FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
//       )
//     `);
//     console.log('✅ Table "reservations" created');

//     await p.query(`
//       CREATE TABLE IF NOT EXISTS fines (
//         fine_id INT AUTO_INCREMENT PRIMARY KEY,
//         member_id INT,
//         amount DECIMAL(10,2) NOT NULL,
//         reason VARCHAR(200),
//         payment_status ENUM('paid','unpaid') DEFAULT 'unpaid',
//         payment_date DATETIME,
//         FOREIGN KEY (member_id) REFERENCES students(member_id) ON DELETE CASCADE
//       )
//     `);
//     console.log('✅ Table "fines" created');

//     await p.query(`
//       INSERT INTO authors (name, biography, nationality) VALUES
//       ('J.K. Rowling','Author of Harry Potter','British'),
//       ('George Orwell','Author of 1984','British'),
//       ('Agatha Christie','Mystery Novelist','British')
//     `);
//     console.log('✅ Mock data inserted into "authors"');

//     await p.query(`
//       INSERT INTO publishers (name, location, contact) VALUES
//       ('Penguin Books','London','+44-20-7946-0000'),
//       ('HarperCollins','New York','+1-212-207-7000'),
//       ('Bloomsbury','London','+44-20-7494-2111')
//     `);
//     console.log('✅ Mock data inserted into "publishers"');

//     await p.query(`
//       INSERT INTO books (isbn, title, genre, total_copies, author_id, publisher_id, published_year) VALUES
//       ('9780439554930','Harry Potter and the Sorcerer''s Stone','Fantasy',10,1,1,1997),
//       ('9780451524935','1984','Dystopian',5,2,2,1949),
//       ('9780062073501','Murder on the Orient Express','Mystery',7,3,3,1934)
//     `);
//     console.log('✅ Mock data inserted into "books"');

//     const pw1 = await bcrypt.hash('student123', 10);
//     const pw2 = await bcrypt.hash('student456', 10);
//     const pw3 = await bcrypt.hash('student789', 10);

//     await p.query(`
//       INSERT INTO students (roll_no, first_name, last_name, email, phone, dob, age, password) VALUES
//       ('STU001','John','Doe','john@example.com','9876543210','2000-01-01',22,?),
//       ('STU002','Jane','Smith','jane@example.com','1234567890','1999-05-15',24,?),
//       ('STU003','Alice','Brown','alice@example.com','5555555555','2001-12-30',20,?)
//     `, [pw1, pw2, pw3]);
//     console.log('✅ Mock data inserted into "students"');

//     await p.query(`
//       INSERT INTO reservations (member_id, book_id) VALUES
//       (1,1), (2,2), (3,3)
//     `);
//     console.log('✅ Mock data inserted into "reservations"');

//     await p.query(`
//       INSERT INTO fines (member_id, amount, reason, payment_status) VALUES
//       (1,5.00,'Late return','unpaid'),
//       (2,10.00,'Damaged book','unpaid'),
//       (3,15.00,'Lost book','paid')
//     `);
//     console.log('✅ Mock data inserted into "fines"');

//     console.log('🎯✅ Database initialized successfully!');
//   } catch (err) {
//     console.error('❌ Error initializing database:', err.message);
//   }
// };

// export default initDb;

import 'dotenv/config';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const p = pool.promise();

const initDb = async () => {
  try {
    console.log('Initializing database...');
    await p.query('DROP TABLE IF EXISTS gd_reservations, gd_rooms, fines, reservations, books, publishers, authors, librarians, students');
    console.log('✅ Old tables dropped (if existed)');

    // STUDENTS
    await p.query(`
      CREATE TABLE students (
        member_id INT AUTO_INCREMENT PRIMARY KEY,
        roll_no VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(30) NOT NULL,
        dob DATE NOT NULL,
        age INT NOT NULL,
        membership_type ENUM('basic','premium') DEFAULT 'basic',
        registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_books_issued INT DEFAULT 0,
        password VARCHAR(100) NOT NULL
      )
    `);
    console.log('✅ Table "students" created');

    // LIBRARIANS
    await p.query(`
      CREATE TABLE librarians (
        librarian_id INT AUTO_INCREMENT PRIMARY KEY,
        eid VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(30) NOT NULL,
        dob DATE NOT NULL,
        age INT NOT NULL,
        date_of_employment DATE NOT NULL,
        shift_timings VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL
      )
    `);
    console.log('✅ Table "librarians" created');

    // AUTHORS
    await p.query(`
      CREATE TABLE authors (
        author_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        biography TEXT,
        nationality VARCHAR(50)
      )
    `);
    console.log('✅ Table "authors" created');

    // PUBLISHERS
    await p.query(`
      CREATE TABLE publishers (
        publisher_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100),
        contact VARCHAR(30)
      )
    `);
    console.log('✅ Table "publishers" created');

    // BOOKS
    await p.query(`
      CREATE TABLE books (
        book_id INT AUTO_INCREMENT PRIMARY KEY,
        isbn VARCHAR(13) UNIQUE NOT NULL,
        title VARCHAR(200) NOT NULL,
        genre VARCHAR(50),
        total_copies INT DEFAULT 1,
        available_copies INT DEFAULT 1,
        author_id INT,
        publisher_id INT,
        published_year INT,
        FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE SET NULL,
        FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Table "books" created');

    // BOOK RESERVATIONS
    await p.query(`
      CREATE TABLE reservations (
        reservation_id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        book_id INT NOT NULL,
        reservation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending','completed') DEFAULT 'pending',
        FOREIGN KEY (member_id) REFERENCES students(member_id) ON DELETE CASCADE,
        FOREIGN KEY (book_id)   REFERENCES books(book_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table "reservations" created');

    // FINES
    await p.query(`
      CREATE TABLE fines (
        fine_id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        reason VARCHAR(200),
        payment_status ENUM('paid','unpaid') DEFAULT 'unpaid',
        payment_date DATETIME,
        FOREIGN KEY (member_id) REFERENCES students(member_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table "fines" created');

    // GD ROOMS
    await p.query(`
      CREATE TABLE gd_rooms (
        room_id INT AUTO_INCREMENT PRIMARY KEY,
        room_name VARCHAR(100) NOT NULL,
        capacity INT DEFAULT 1
      )
    `);
    console.log('✅ Table "gd_rooms" created');

    // GD ROOM RESERVATIONS
    await p.query(`
      CREATE TABLE gd_reservations (
        gd_reservation_id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        room_id INT NOT NULL,
        reservation_time DATETIME NOT NULL,
        duration_minutes INT NOT NULL,
        FOREIGN KEY (member_id) REFERENCES students(member_id) ON DELETE CASCADE,
        FOREIGN KEY (room_id)   REFERENCES gd_rooms(room_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table "gd_reservations" created');

    // INSERT MOCK DATA
    // Authors
    await p.query(`
      INSERT INTO authors (name, biography, nationality) VALUES
      ('J.K. Rowling','Author of Harry Potter','British'),
      ('George Orwell','Author of 1984','British'),
      ('Agatha Christie','Mystery Novelist','British')
    `);
    console.log('✅ Mock authors inserted');

    // Publishers
    await p.query(`
      INSERT INTO publishers (name, location, contact) VALUES
      ('Penguin Books','London','+44-20-7946-0000'),
      ('HarperCollins','New York','+1-212-207-7000'),
      ('Bloomsbury','London','+44-20-7494-2111')
    `);
    console.log('✅ Mock publishers inserted');

    // Books
    await p.query(`
      INSERT INTO books
        (isbn, title, genre, total_copies, available_copies, author_id, publisher_id, published_year)
      VALUES
      ('9780439554930','Harry Potter and the Sorcerer''s Stone','Fantasy',10,10,1,1,1997),
      ('9780451524935','1984','Dystopian',5,5,2,2,1949),
      ('9780062073501','Murder on the Orient Express','Mystery',7,7,3,3,1934)
    `);
    console.log('✅ Mock books inserted');

    // Students
    const s1 = await bcrypt.hash('student123', 10);
    const s2 = await bcrypt.hash('student456', 10);
    const s3 = await bcrypt.hash('student789', 10);
    // calculate ages
    const age1 = Math.floor((new Date() - new Date('2000-01-01'))/(1000*60*60*24*365));
    const age2 = Math.floor((new Date() - new Date('1999-05-15'))/(1000*60*60*24*365));
    const age3 = Math.floor((new Date() - new Date('2001-12-30'))/(1000*60*60*24*365));

    await p.query(`
      INSERT INTO students 
        (roll_no, first_name, last_name, email, phone, dob, age, password)
      VALUES
      ('STU001','John','Doe','john@example.com','9876543210','2000-01-01',?,?),
      ('STU002','Jane','Smith','jane@example.com','1234567890','1999-05-15',?,?),
      ('STU003','Alice','Brown','alice@example.com','5555555555','2001-12-30',?,?)
    `, [age1, s1, age2, s2, age3, s3]);
    console.log('✅ Mock students inserted');

    // Librarians
    const l1 = await bcrypt.hash('lib123', 10);
    const libAge = Math.floor((new Date() - new Date('1985-06-10'))/(1000*60*60*24*365));
    await p.query(`
      INSERT INTO librarians
        (eid, name, email, phone, dob, age, date_of_employment, shift_timings, password)
      VALUES
      ('EID100','Alice Admin','alice@library.com','9991112222','1985-06-10',?, '2020-01-01', '9am-5pm', ?)
    `, [libAge, l1]);
    console.log('✅ Mock librarian inserted');

    // GD Rooms
    await p.query(`
      INSERT INTO gd_rooms (room_name, capacity) VALUES
      ('GD Room A', 6), ('GD Room B', 8)
    `);
    console.log('✅ Mock GD rooms inserted');

    console.log('🎯✅ Database initialized successfully!');
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
  }
};

export default initDb;
