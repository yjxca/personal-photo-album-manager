import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper functions for database operations
async function readDatabase() {
  const dbPath = path.join(process.cwd(), 'db.json');
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

async function writeDatabase(data) {
  const dbPath = path.join(process.cwd(), 'db.json');
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// GET users
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    const db = await readDatabase();
    
    if (email) {
      const user = db.users.find(u => u.email === email);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
      }
      return NextResponse.json(null);
    }
    
    // Return all users (without passwords)
    const usersWithoutPasswords = db.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST (create) a user
export async function POST(req) {
  try {
    const userData = await req.json();
    const db = await readDatabase();
    
    // Check if user already exists
    const existingUser = db.users.find(u => u.email === userData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Generate a new ID
    const newId = db.users.length > 0 
      ? Math.max(...db.users.map(user => user.id)) + 1 
      : 1;
    
    // Create the new user
    const newUser = {
      id: newId,
      username: userData.username,
      email: userData.email,
      password: userData.password // Note: In a real app, you'd hash this password
    };
    
    // Add to database
    db.users.push(newUser);
    await writeDatabase(db);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}