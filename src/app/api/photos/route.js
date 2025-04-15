// src/app/api/photos/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper to read the database file
async function readDatabase() {
  const dbPath = path.join(process.cwd(), 'db.json');
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

// Helper to write to the database file
async function writeDatabase(data) {
  const dbPath = path.join(process.cwd(), 'db.json');
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// GET all photos (with optional filtering)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const albumId = searchParams.get('albumId');
    
    const db = await readDatabase();
    let photos = db.photos;
    
    // Apply filters
    if (userId) {
      photos = photos.filter(photo => photo.userId === parseInt(userId));
    }
    
    if (albumId) {
      photos = photos.filter(photo => 
        photo.albumIds && photo.albumIds.includes(parseInt(albumId))
      );
    }
    
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

// POST a new photo
export async function POST(req) {
  try {
    const photoData = await req.json();
    const db = await readDatabase();
    
    // Generate a new ID
    const newId = db.photos.length > 0 
      ? Math.max(...db.photos.map(photo => photo.id)) + 1 
      : 1;
    
    // Create the new photo entry
    const newPhoto = {
      id: newId,
      ...photoData,
      uploadDate: photoData.uploadDate || new Date().toISOString(),
      albumIds: photoData.albumIds || []
    };
    
    // Add to database
    db.photos.push(newPhoto);
    await writeDatabase(db);
    
    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}