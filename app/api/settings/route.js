import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { authorizeAdmin } from '../../../lib/auth';

// Fetch settings
export async function GET() {
  try {
    const [rows] = await db.query('SELECT key_name, value FROM settings');
    const settings = rows.reduce((acc, row) => {
      acc[row.key_name] = row.value;
      return acc;
    }, {});
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

// Update settings (Admin only)
export async function POST(request) {
  try {
    const user = await authorizeAdmin();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    // Dynamically update any settings provided in the body
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        await db.query(
          'INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
          [key, value, value]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
