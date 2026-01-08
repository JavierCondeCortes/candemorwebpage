import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const dir = formData.get('dir') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear directorio base
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const targetDir = dir ? join(uploadsDir, dir) : uploadsDir;
    
    await mkdir(targetDir, { recursive: true });

    // Generar nombre único
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(targetDir, filename);

    // Guardar archivo
    await writeFile(filepath, buffer);

    // Retornar URL relativa
    const url = dir ? `/uploads/${dir}/${filename}` : `/uploads/${filename}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return NextResponse.json(
      { error: 'Error subiendo archivo' },
      { status: 500 }
    );
  }
}
