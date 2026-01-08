import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Leer credenciales del archivo
    const credentialsPath = path.join(process.cwd(), 'public', 'config', 'credentials.json');
    const credentialsFile = fs.readFileSync(credentialsPath, 'utf-8');
    const credentials = JSON.parse(credentialsFile);

    // Validar credenciales
    if (username === credentials.admin_user && password === credentials.admin_password) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({
        success: true,
        token,
        message: 'Autenticación exitosa'
      });
    }

    return NextResponse.json(
      { message: 'Usuario o contraseña incorrectos' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { message: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
