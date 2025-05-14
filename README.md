# Library Management System
A complete full-stack application for managing library resources, users, and services. This system manages books, reservations, group discussion rooms, and fines in a user-friendly interface with separate roles for students and librarians.

## Technologies Used

### Frontend
- React 19
- Material UI 7
- React Router
- Axios
- React Hot Toast
- JWT Auth
- MUI X Date Pickers
- Dayjs

### Backend
- Node.js
- Express
- MySQL
- JWT Authentication
- bcryptjs
- express-validator

## Features

### For Students
- Register and login with student details
- Browse the book catalog
- Reserve books
- View and manage personal reservations
- Pay fines
- Book group discussion rooms
- View and manage GD room bookings
- Update profile information

### For Librarians
- Complete book management (add, edit, delete)
- Author and publisher management
- Track student reservations
- Issue and manage fines
- Create and manage group discussion rooms
- User management

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (5.7 or higher)
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd librarymanagementsys

# Set up env variables
cd backend
cp .env.example .env

# Edit the .env file with your MySQL credentials:
# MYSQL_HOST=localhost
# MYSQL_USER=your_mysql_username
# MYSQL_PASSWORD=your_mysql_password
# MYSQL_DATABASE=dbms_shree
# MYSQL_PORT=3306
# PORT=3001
# JWT_SECRET=DBMS_Shree

# Install dependencies and start the server
npm install
npm start

# The server should start with messages:
# Connected to MySQL
# Database initialized!
# Server running on port 3001
```

### Frontend Setup
```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev

# Access the application at http://localhost:5173
```

## Project Structure
```
librarymanagementsys/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Express middlewares
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── index.js         # Entry point
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts (Auth)
│   │   ├── features/    # Feature-specific components
│   │   │   ├── auth/
│   │   │   ├── books/
│   │   │   ├── fines/
│   │   │   ├── gd/      # Group Discussion rooms
│   │   │   └── ...
│   │   ├── pages/       # Main page components
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app component
│   └── index.html       # HTML entry point
└── README.md            # Project documentation
```

## Usage

### Login Credentials

#### Student
- **Username:** STU001
- **Password:** student123

#### Librarian
- **Username:** EMP001
- **Password:** lib123

### Student Workflow
1. Login as student
2. Browse books catalog
3. Reserve available books
4. Check reservation status in dashboard
5. Book GD rooms for group study
6. Pay fines (if any)

### Librarian Workflow
1. Login as librarian
2. Manage books, authors, and publishers
3. Track student reservations
4. Issue fines for late returns or damaged books
5. Manage GD rooms
6. View student statistics

## API Documentation

### Authentication
- `POST /api/login` - User login
- `POST /api/students` - Register new student

### Books
- `GET /api/books` - List all books
- `POST /api/books` - Add new book (librarian only)
- `PUT /api/books/:id` - Update book details (librarian only)
- `DELETE /api/books/:id` - Delete book (librarian only)

### Reservations
- `POST /api/reservations` - Reserve a book
- `GET /api/reservations` - Get user's reservations
- `POST /api/reservations/return` - Return a book
- `GET /api/reservations/all` - Get all reservations (librarian only)

### Fines
- `GET /api/fines` - Get user's fines
- `POST /api/fines` - Issue fine (librarian only)
- `POST /api/fines/pay` - Pay a fine
- `GET /api/fines/all` - Get all fines (librarian only)

### GD Rooms
- `GET /api/gd/rooms` - List all GD rooms
- `POST /api/gd/rooms` - Create GD room (librarian only)
- `POST /api/gd` - Reserve GD room
- `GET /api/gd` - Get user's GD reservations
- `DELETE /api/gd/:id` - Cancel GD reservation

## License
This project is licensed under the MIT License.

## Created By
Shree Mishra (102303075)

> **Note:** This project was created as part of an educational assignment and may require additional configuration for production use.
