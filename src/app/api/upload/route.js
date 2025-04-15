import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const uniqueFilename = `${Date.now()}-${uuidv4()}${file.name.slice(file.name.lastIndexOf('.'))}`;
    const uploadDir = join(process.cwd(), 'public', 'uploaded');
    const filePath = join(uploadDir, uniqueFilename);
    
    // Write the file
    await writeFile(filePath, buffer);
    
    return NextResponse.json({
      success: true,
      filename: uniqueFilename,
      originalFilename: file.name,
      size: buffer.length,
      filepath: `/uploaded/${uniqueFilename}`,
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}