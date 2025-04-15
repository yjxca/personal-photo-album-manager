import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

// GET all albums (with optional filtering)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    const db = await readDatabase();
    let albums = db.albums;
    
    // Apply filter if provided
    if (userId) {
      albums = albums.filter(album => album.userId === parseInt(userId));
    }
    
    return NextResponse.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

// POST a new album
export async function POST(req) {
  try {
    const albumData = await req.json();
    const db = await readDatabase();
    
    // Generate a new ID
    const newId = db.albums.length > 0 
      ? Math.max(...db.albums.map(album => album.id)) + 1 
      : 1;
    
    // Create share ID
    const shareId = `${albumData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${uuidv4().slice(0, 8)}`;
    
    // Create the new album entry
    const newAlbum = {
      id: newId,
      ...albumData,
      photoIds: albumData.photoIds || [],
      shareId,
      createdAt: new Date().toISOString()
    };
    
    // Add to database
    db.albums.push(newAlbum);
    
    // Add a share entry
    db.shares.push({
      id: shareId,
      albumId: newId,
      createdAt: new Date().toISOString(),
      expiresAt: null
    });
    
    // Update photos to include the album ID
    if (newAlbum.photoIds && newAlbum.photoIds.length > 0) {
      db.photos.forEach(photo => {
        if (newAlbum.photoIds.includes(photo.id)) {
          photo.albumIds = photo.albumIds || [];
          if (!photo.albumIds.includes(newId)) {
            photo.albumIds.push(newId);
          }
        }
      });
    }
    
    await writeDatabase(db);
    
    return NextResponse.json(newAlbum, { status: 201 });
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json(
      { error: 'Failed to create album' },
      { status: 500 }
    );
  }
}