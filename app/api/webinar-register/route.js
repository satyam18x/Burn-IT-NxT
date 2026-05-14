import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req) {
  try {
    const { name, email, age, phone, region, message } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    await db.query(
      'INSERT INTO webinar_registrations (name, email, age, phone, region, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, age || null, phone || null, region || null, message || null]
    );

    return NextResponse.json({ message: 'Registration successful!' }, { status: 201 });
  } catch (error) {
    console.error('Error in webinar registration:', error);
    return NextResponse.json({ error: 'Failed to register. Please try again.' }, { status: 500 });
  }
}
