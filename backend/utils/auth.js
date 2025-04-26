import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = id;
    req.userRole = role;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'librarian')
    return res.status(403).json({ message: 'Forbidden: Librarians only' });
  next();
};

export const isStudent = (req, res, next) => {
  if (req.userRole !== 'student')
    return res.status(403).json({ message: 'Forbidden: Students only' });
  next();
};
