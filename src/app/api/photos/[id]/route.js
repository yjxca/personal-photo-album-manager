// src/app/api/photos/[id]/route.js
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

// GET a single photo
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    const db = await readDatabase();
    const photo = db.photos.find(p => p.id === id);
    
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }
    
    return NextResponse.json(photo);
  } catch (error) {
    console.error(`Error fetching photo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}

// PUT/UPDATE a photo
export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    const updatedData = await req.json();
    const db = await readDatabase();
    
    const photoIndex = db.photos.findIndex(p => p.id === id);
    
    if (photoIndex === -1) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }
    
    // Update the photo
    db.photos[photoIndex] = {
      ...db.photos[photoIndex],
      ...updatedData,
      id // Ensure ID doesn't change
    };
    
    await writeDatabase(db);
    
    return NextResponse.json(db.photos[photoIndex]);
  } catch (error) {
    console.error(`Error updating photo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}

// DELETE a photo
export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);
    const db = await readDatabase();
    
    const photoIndex = db.photos.findIndex(p => p.id === id);
    
    if (photoIndex === -1) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }
    
    // Remove the photo from the database
    db.photos.splice(photoIndex, 1);
    
    // Remove from any albums it's in
    db.albums.forEach(album => {
      if (album.photoIds && album.photoIds.includes(id)) {
        album.photoIds = album.photoIds.filter(photoId => photoId !== id);
      }
    });
    
    await writeDatabase(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting photo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}