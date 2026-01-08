import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const configPath = path.join(process.cwd(), 'public', 'data', 'site-config.json');
    const configFile = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configFile);

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error cargando config:', error);
    return NextResponse.json(
      { message: 'Error cargando configuración' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const config = await request.json();
    const configPath = path.join(process.cwd(), 'public', 'data', 'site-config.json');

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    return NextResponse.json({ success: true, message: 'Configuración guardada' });
  } catch (error) {
    console.error('Error guardando config:', error);
    return NextResponse.json(
      { message: 'Error guardando configuración' },
      { status: 500 }
    );
  }
}
