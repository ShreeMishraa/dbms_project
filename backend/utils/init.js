import dotenv from 'dotenv';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const p = pool.promise();

// Check if a table exists
async function tableExists(tableName) {
  try {
    const [rows] = await p.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = '${process.env.MYSQL_DATABASE}' AND table_name = ?
    `, [tableName]);
    return rows[0].count > 0;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
}

// Check if a table is empty
async function tableIsEmpty(tableName) {
  try {
    const [rows] = await p.query(`SELECT COUNT(*) as count FROM ${tableName}`);
    return rows[0].count === 0;
  } catch (err) {
    console.error(`Error checking if table ${tableName} is empty:`, err);
    return true;
  }
}

// Create table if it doesn't exist
async function createTableIfNotExists(tableName, createQuery) {
  if (!await tableExists(tableName)) {
    await p.query(createQuery);
    console.log(`✅ Table "${tableName}" created`);
    return true;
  }
  console.log(`Table "${tableName}" already exists`);
  return false;
}

// Insert mock data if table is empty
async function insertMockDataIfEmpty(tableName, insertQuery, values, message) {
  if (await tableIsEmpty(tableName)) {
    await p.query(insertQuery, values);
    console.log(`✅ ${message}`);
    return true;
  }
  console.log(`Table "${tableName}" already contains data`);
  return false;
}

const initDb = async () => {
  try {
    console.log('Initializing database...');

    // CREATE TABLES IF NOT EXIST
    await createTableIfNotExists('students', `
      CREATE TABLE students (
        member_id INT AUTO_INCREMENT PRIMARY KEY,
        roll_no VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        dob DATE NOT NULL,
        age INT CHECK (age >= 10),
        membership_type ENUM('basic','premium') DEFAULT 'basic',
        registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_books_issued INT DEFAULT 0,
        password VARCHAR(100) NOT NULL
      )
    `);

    await createTableIfNotExists('librarians', `
      CREATE TABLE librarians (
        librarian_id INT AUTO_INCREMENT PRIMARY KEY,
        eid VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        dob DATE,
        age INT,
        date_of_employment DATE,
        shift_timings VARCHAR(50),
        password VARCHAR(100) NOT NULL
      )
    `);

    await createTableIfNotExists('authors', `
      CREATE TABLE authors (
        author_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        biography TEXT,
        nationality VARCHAR(50)
      )
    `);

    await createTableIfNotExists('publishers', `
      CREATE TABLE publishers (
        publisher_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100),
        contact VARCHAR(30)
      )
    `);

    await createTableIfNotExists('books', `
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

    await createTableIfNotExists('reservations', `
      CREATE TABLE reservations (
        reservation_id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT,
        book_id INT,
        reservation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending','active','returned') DEFAULT 'active',
        FOREIGN KEY (member_id) REFERENCES students(member_id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
      )
    `);

    await createTableIfNotExists('fines', `
      CREATE TABLE fines (
        fine_id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT,
        amount DECIMAL(10,2) NOT NULL,
        reason VARCHAR(200),
        payment_status ENUM('paid','unpaid') DEFAULT 'unpaid',
        issued_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        payment_date DATETIME,
        FOREIGN KEY (member_id) REFERENCES students(member_id) ON DELETE CASCADE
      )
    `);

    // Check if 'is_deleted' column exists in 'fines' table
    const [columns] = await pool.promise().query(`
      SHOW COLUMNS FROM fines LIKE 'is_deleted'
    `);

    if (columns.length === 0) {
      // Column doesn't exist — add it
      await pool.promise().query(`
        ALTER TABLE fines ADD COLUMN is_deleted TINYINT DEFAULT 0
      `);
    }


    await createTableIfNotExists('gd_rooms', `
      CREATE TABLE gd_rooms (
        room_id INT AUTO_INCREMENT PRIMARY KEY,
        room_name VARCHAR(100) NOT NULL,
        capacity INT DEFAULT 1
      )
    `);

    await createTableIfNotExists('gd_reservations', `
      CREATE TABLE gd_reservations (
        gd_reservation_id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT,
        room_id INT,
        reservation_time DATETIME NOT NULL,
        duration_minutes INT NOT NULL,
        status ENUM('upcoming','completed','cancelled') DEFAULT 'upcoming',
        FOREIGN KEY (member_id) REFERENCES students(member_id) ON DELETE CASCADE,
        FOREIGN KEY (room_id) REFERENCES gd_rooms(room_id) ON DELETE CASCADE
      )
    `);

    // INSERT MOCK DATA IF TABLES ARE EMPTY
    
    // Authors
    await insertMockDataIfEmpty('authors', `
      INSERT INTO authors (name, biography, nationality) VALUES
      (?, ?, ?),
      (?, ?, ?),
      (?, ?, ?)
    `, [
      'J.K. Rowling', 'Author of Harry Potter', 'British',
      'George Orwell', 'Author of 1984', 'British',
      'Agatha Christie', 'Mystery Novelist', 'British'
    ], 'Mock authors inserted');

    // Publishers
    await insertMockDataIfEmpty('publishers', `
      INSERT INTO publishers (name, location, contact) VALUES
      (?, ?, ?),
      (?, ?, ?),
      (?, ?, ?)
    `, [
      'Penguin Books', 'London', '+44-20-7946-0000',
      'HarperCollins', 'New York', '+1-212-207-7000',
      'Bloomsbury', 'London', '+44-20-7494-2111'
    ], 'Mock publishers inserted');

    // Books
    await insertMockDataIfEmpty('books', `
      INSERT INTO books (isbn, title, genre, total_copies, available_copies, author_id, publisher_id, published_year) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      '9780439554930', "Harry Potter and the Sorcerer's Stone", 'Fantasy', 10, 10, 1, 1, 1997,
      '9780451524935', '1984', 'Dystopian', 5, 5, 2, 2, 1949,
      '9780062073501', 'Murder on the Orient Express', 'Mystery', 7, 7, 3, 3, 1934
    ], 'Mock books inserted');

    // Students
    if (await tableIsEmpty('students')) {
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
        (?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'STU001', 'John', 'Doe', 'john@example.com', '9876543210', '2000-01-01', age1, s1,
        'STU002', 'Jane', 'Smith', 'jane@example.com', '1234567890', '1999-05-15', age2, s2,
        'STU003', 'Alice', 'Brown', 'alice@example.com', '5555555555', '2001-12-30', age3, s3
      ]);
      console.log('✅ Mock students inserted');
    } else {
      console.log('Table "students" already contains data');
    }

    // Librarian
    if (await tableIsEmpty('librarians')) {
      const l1 = await bcrypt.hash('lib123', 10);
      await p.query(`
        INSERT INTO librarians 
          (eid, name, email, phone, date_of_employment, shift_timings, password)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'EMP001', 'Alice Librarian', 'alice@library.com', '5551234567', '2020-01-15', '9 AM - 5 PM', l1
      ]);
      console.log('✅ Mock librarian inserted');
    } else {
      console.log('Table "librarians" already contains data');
    }

    // GD Rooms
    await insertMockDataIfEmpty('gd_rooms', `
      INSERT INTO gd_rooms (room_name, capacity) VALUES
      (?, ?), (?, ?), (?, ?)
    `, [
      'Discussion Room A', 6,
      'Conference Room B', 10,
      'Study Room C', 4
    ], 'Mock GD rooms inserted');

    console.log('🎯✅ Database initialized successfully!');
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
};

export default initDb;