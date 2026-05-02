import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

export async function verifyToken() {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function isAdmin(user) {
  return user && user.role === 'admin';
}

export async function authorizeAdmin() {
  try {
    const user = await verifyToken();
    if (isAdmin(user)) {
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
}
