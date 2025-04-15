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

// GET a single album by ID
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    const db = await readDatabase();
    
    const album = db.albums.find(a => a.id === id);
    
    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(album);
  } catch (error) {
    console.error(`Error fetching album ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch album' },
      { status: 500 }
    );
  }
}

// PUT (update) an album
export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    const updatedData = await req.json();
    const db = await readDatabase();
    
    const albumIndex = db.albums.findIndex(a => a.id === id);
    
    if (albumIndex === -1) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }
    
    const currentAlbum = db.albums[albumIndex];
    
    // Handle updating photo associations
    if (updatedData.photoIds) {
      // Remove album ID from photos that were removed from this album
      const removedPhotoIds = currentAlbum.photoIds.filter(
        photoId => !updatedData.photoIds.includes(photoId)
      );
      
      if (removedPhotoIds.length > 0) {
        db.photos.forEach(photo => {
          if (removedPhotoIds.includes(photo.id)) {
            photo.albumIds = photo.albumIds.filter(albumId => albumId !== id);
          }
        });
      }
      
      // Add album ID to photos that were added to this album
      const addedPhotoIds = updatedData.photoIds.filter(
        photoId => !currentAlbum.photoIds.includes(photoId)
      );
      
      if (addedPhotoIds.length > 0) {
        db.photos.forEach(photo => {
          if (addedPhotoIds.includes(photo.id)) {
            photo.albumIds = photo.albumIds || [];
            if (!photo.albumIds.includes(id)) {
              photo.albumIds.push(id);
            }
          }
        });
      }
    }
    
    // Update the album, preserving the ID and shareId
    db.albums[albumIndex] = {
      ...currentAlbum,
      ...updatedData,
      id, // Ensure ID doesn't change
      shareId: currentAlbum.shareId // Preserve the shareId
    };
    
    await writeDatabase(db);
    
    return NextResponse.json(db.albums[albumIndex]);
  } catch (error) {
    console.error(`Error updating album ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update album' },
      { status: 500 }
    );
  }
}

// DELETE an album
export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);
    const db = await readDatabase();
    
    const albumIndex = db.albums.findIndex(a => a.id === id);
    
    if (albumIndex === -1) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }
    
    // Get the album to delete
    const albumToDelete = db.albums[albumIndex];
    
    // Remove the album from the database
    db.albums.splice(albumIndex, 1);
    
    // Remove the album ID from any photos it contains
    db.photos.forEach(photo => {
      if (photo.albumIds && photo.albumIds.includes(id)) {
        photo.albumIds = photo.albumIds.filter(albumId => albumId !== id);
      }
    });
    
    // Remove any shares for this album
    db.shares = db.shares.filter(share => share.albumId !== id);
    
    await writeDatabase(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting album ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete album' },
      { status: 500 }
    );
  }
}