import { renameSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { from, to } = await request.json();

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const fromPath = join(uploadsDir, from);
    const toPath = join(uploadsDir, to);

    renameSync(fromPath, toPath);

    return NextResponse.json({ 
      success: true,
      message: 'Archivo movido exitosamente'
    });
  } catch (error) {
    console.error('Error moviendo archivo:', error);
    return NextResponse.json(
      { error: 'Error moviendo archivo' },
      { status: 500 }
    );
  }
}
