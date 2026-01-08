import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dir = searchParams.get('dir') || '';
    
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const targetDir = dir ? join(uploadsDir, dir) : uploadsDir;

    let items: any[] = [];
    try {
      const files = readdirSync(targetDir);
      
      items = files.map((file) => {
        const filePath = join(targetDir, file);
        const stats = statSync(filePath);
        const isDirectory = stats.isDirectory();
        
        return {
          name: file,
          path: dir ? `${dir}/${file}` : file,
          url: isDirectory ? null : `/uploads/${dir ? dir + '/' : ''}${file}`,
          type: getFileType(file, isDirectory),
          isDirectory,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
          extension: isDirectory ? 'folder' : file.split('.').pop()?.toLowerCase() || 'unknown',
          modified: stats.mtime.toISOString(),
        };
      });
    } catch (error) {
      // Carpeta no existe aún
      items = [];
    }

    return NextResponse.json({ 
      files: items,
      currentPath: dir || 'root'
    });
  } catch (error) {
    console.error('Error listando archivos:', error);
    return NextResponse.json(
      { error: 'Error listando archivos' },
      { status: 500 }
    );
  }
}

function getFileType(filename: string, isDirectory: boolean): string {
  if (isDirectory) return 'directory';
  
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext || '')) return 'video';
  if (['ttf', 'otf', 'woff', 'woff2'].includes(ext || '')) return 'font';
  if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return 'document';
  return 'file';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
