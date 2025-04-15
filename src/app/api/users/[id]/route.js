// src/app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper functions
async function readDatabase() {
  const dbPath = path.join(process.cwd(), 'db.json');
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

// GET a single user
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    const db = await readDatabase();
    
    const user = db.users.find(u => u.id === id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error fetching user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}