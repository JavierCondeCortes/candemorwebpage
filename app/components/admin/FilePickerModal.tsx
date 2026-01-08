'use client';

import { useState, useEffect } from 'react';

interface FileItem {
  name: string;
  path: string;
  url: string | null;
  type: string;
  isDirectory: boolean;
  size: number;
  sizeFormatted: string;
  extension: string;
  modified: string;
}

interface FilePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  accept?: string;
}

export function FilePickerModal({ isOpen, onClose, onSelect, accept = '*' }: FilePickerModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDir, setCurrentDir] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid-small' | 'grid-large'>('grid-small');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'size' | 'extension' | 'modified'>('name');
  const [filterType, setFilterType] = useState('all');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen, currentDir]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const query = currentDir ? `?dir=${currentDir}` : '';
      const response = await fetch(`/api/files${query}`);
      const data = await response.json();
      setFiles(sortFiles(data.files || []));
    } catch (error) {
      console.error('Error cargando archivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortFiles = (items: FileItem[]) => {
    const sorted = [...items];
    
    sorted.sort((a, b) => {
      // Directorios primero
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }

      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'size':
          return a.size - b.size;
        case 'extension':
          return a.extension.localeCompare(b.extension);
        case 'modified':
          return new Date(b.modified).getTime() - new Date(a.modified).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  };

  const getFilteredFiles = () => {
    if (filterType === 'all') return files;
    return files.filter(f => f.type === filterType || f.isDirectory);
  };

  const getFilterType = () => {
    if (accept.includes('image')) return 'image';
    if (accept.includes('video')) return 'video';
    if (accept.includes('font')) return 'font';
    return 'all';
  };

  const handleNavigateDir = (file: FileItem) => {
    if (file.isDirectory) {
      setCurrentDir(file.path);
      setSelectedFile(null);
    }
  };

  const handleBack = () => {
    const parts = currentDir.split('/');
    parts.pop();
    setCurrentDir(parts.join('/'));
    setSelectedFile(null);
  };

  const handleSelect = (file: FileItem) => {
    if (!file.isDirectory) {
      onSelect(file.url!);
      onClose();
    }
  };

  if (!isOpen) return null;

  const filteredFiles = getFilteredFiles();
  const filterTypeValue = getFilterType();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)',
    }}>
      <div style={{
        background: '#1a1a2e',
        borderRadius: '15px',
        border: '2px solid #9D4EDD',
        maxWidth: '900px',
        width: '95%',
        maxHeight: '85vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #9D4EDD',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#FFD60A' }}>📁 Gestor de Archivos</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#b0b0b0' }}>
              {currentDir ? `Ruta: /${currentDir}` : 'Ruta: /uploads'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Controls */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #2a2a3e',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {/* Back Button */}
          {currentDir && (
            <button
              onClick={handleBack}
              style={{
                padding: '0.6rem 1rem',
                background: 'rgba(157, 78, 221, 0.2)',
                border: '1px solid #9D4EDD',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              ← Atrás
            </button>
          )}

          {/* View Mode */}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {(['list', 'grid-small', 'grid-large'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={mode === 'list' ? 'Vista lista' : mode === 'grid-small' ? 'Grid pequeño' : 'Grid grande'}
                style={{
                  padding: '0.5rem 0.8rem',
                  background: viewMode === mode ? '#9D4EDD' : 'rgba(157, 78, 221, 0.2)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                {mode === 'list' && '📋'}
                {mode === 'grid-small' && '🔹'}
                {mode === 'grid-large' && '🔲'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '0.6rem',
              background: 'rgba(157, 78, 221, 0.2)',
              border: '1px solid #9D4EDD',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            <option value="name">📝 Nombre</option>
            <option value="type">🏷️ Tipo</option>
            <option value="size">⚖️ Peso</option>
            <option value="extension">📄 Extensión</option>
            <option value="modified">📅 Modificado</option>
          </select>

          {/* Filter */}
          {filterTypeValue === 'all' && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '0.6rem',
                background: 'rgba(157, 78, 221, 0.2)',
                border: '1px solid #9D4EDD',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              <option value="all">📦 Todos</option>
              <option value="directory">📁 Directorios</option>
              <option value="image">📷 Imágenes</option>
              <option value="video">🎬 Videos</option>
              <option value="font">🔤 Fuentes</option>
              <option value="document">📄 Documentos</option>
            </select>
          )}
        </div>

        {/* File Grid/List */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '1rem',
          display: viewMode === 'list' 
            ? 'flex' 
            : `grid`,
          gridTemplateColumns: viewMode === 'grid-large'
            ? 'repeat(auto-fill, minmax(200px, 1fr))'
            : 'repeat(auto-fill, minmax(100px, 1fr))',
          flexDirection: viewMode === 'list' ? 'column' : 'row',
          gap: '1rem',
        }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9D4EDD' }}>
              ⏳ Cargando archivos...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#b0b0b0' }}>
              No hay archivos
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.path}
                onClick={() => {
                  if (file.isDirectory) {
                    handleNavigateDir(file);
                  } else {
                    setSelectedFile(file);
                  }
                }}
                style={{
                  padding: viewMode === 'list' ? '0.8rem' : '1rem',
                  background: selectedFile?.path === file.path 
                    ? 'rgba(157, 78, 221, 0.4)' 
                    : 'rgba(157, 78, 221, 0.1)',
                  border: selectedFile?.path === file.path
                    ? '2px solid #FFD60A'
                    : '2px solid transparent',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: file.isDirectory ? 'pointer' : 'pointer',
                  transition: 'all 0.3s',
                  display: viewMode === 'list' ? 'flex' : 'flex',
                  flexDirection: viewMode === 'list' ? 'row' : 'column',
                  alignItems: viewMode === 'list' ? 'center' : 'flex-start',
                  gap: viewMode === 'list' ? '1rem' : '0.5rem',
                  wordBreak: 'break-word',
                  fontSize: viewMode === 'grid-large' ? '1rem' : '0.75rem',
                }}
                onMouseEnter={(e) => {
                  if (selectedFile?.path !== file.path) {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#9D4EDD';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(157, 78, 221, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFile?.path !== file.path) {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(157, 78, 221, 0.1)';
                  }
                }}
              >
                {viewMode === 'list' ? (
                  <>
                    <div style={{ fontSize: '1.5rem', minWidth: '30px' }}>
                      {file.isDirectory ? '📁' : file.type === 'image' ? '🖼️' : file.type === 'video' ? '🎬' : file.type === 'font' ? '🔤' : '📄'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600' }}>{file.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#b0b0b0' }}>
                        {file.isDirectory ? 'Carpeta' : `${file.extension.toUpperCase()} • ${file.sizeFormatted}`}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: viewMode === 'grid-large' ? '3rem' : '2rem', textAlign: 'center', width: '100%' }}>
                      {file.isDirectory ? '📁' : file.type === 'image' ? '🖼️' : file.type === 'video' ? '🎬' : file.type === 'font' ? '🔤' : '📄'}
                    </div>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <div style={{ 
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {file.name.length > 20 ? file.name.slice(0, 17) + '...' : file.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#b0b0b0' }}>
                        {file.isDirectory ? 'Carpeta' : `${file.extension.toUpperCase()}`}
                      </div>
                      {!file.isDirectory && (
                        <div style={{ fontSize: '0.65rem', color: '#9D4EDD', marginTop: '0.3rem' }}>
                          {file.sizeFormatted}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Selected File Info */}
        {selectedFile && !selectedFile.isDirectory && (
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #2a2a3e',
            background: 'rgba(157, 78, 221, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <p style={{ margin: '0 0 0.3rem 0', color: '#FFD60A', fontWeight: '600' }}>
                {selectedFile.name}
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#b0b0b0' }}>
                Tipo: {selectedFile.type} • Tamaño: {selectedFile.sizeFormatted}
              </p>
            </div>
            <button
              onClick={() => handleSelect(selectedFile)}
              style={{
                padding: '0.7rem 1.5rem',
                background: 'linear-gradient(135deg, #9D4EDD, #FFD60A)',
                color: '#1a1a2e',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
              }}
            >
              ✓ Seleccionar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
