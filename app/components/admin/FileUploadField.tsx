'use client';

import { useState, useEffect } from 'react';
import { FilePickerModal } from './FilePickerModal';

interface FileUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}

export function FileUploadField({ value, onChange, accept = 'image/*', label = 'Archivo' }: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [directories, setDirectories] = useState<string[]>([]);
  const [selectedDir, setSelectedDir] = useState('');

  useEffect(() => {
    loadDirectories();
  }, []);

  const loadDirectories = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      const dirs = data.files
        .filter((f: any) => f.isDirectory)
        .map((f: any) => f.path);
      setDirectories(dirs);
    } catch (error) {
      console.error('Error cargando directorios:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedDir) {
        formData.append('dir', selectedDir);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onChange(data.url);
        setError('');
      } else {
        setError(data.error || 'Error subiendo archivo');
      }
    } catch (err) {
      setError('Error subiendo archivo');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="form-group">
        <label>{label}</label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="URL o carga un archivo"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{ flex: 1, minWidth: '200px' }}
            />

            {/* Directorio */}
            <select
              value={selectedDir}
              onChange={(e) => setSelectedDir(e.target.value)}
              style={{
                padding: '0.9rem 1rem',
                background: 'rgba(157, 78, 221, 0.2)',
                border: '1px solid #9D4EDD',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <option value="">📁 Raíz</option>
              {directories.map((dir) => (
                <option key={dir} value={dir}>
                  📂 {dir}
                </option>
              ))}
            </select>

            <label style={{
              padding: '0.9rem 1.2rem',
              background: 'linear-gradient(135deg, #9D4EDD, #FFD60A)',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: '8px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              textTransform: 'uppercase',
              fontSize: '0.85rem',
              opacity: uploading ? 0.6 : 1,
            }}>
              {uploading ? '⏳ Subiendo...' : '📤 Subir'}
              <input
                type="file"
                onChange={handleFileChange}
                accept={accept}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '0.9rem 1.2rem',
                background: 'linear-gradient(135deg, #9D4EDD, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(157, 78, 221, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              📁 Gestor
            </button>
          </div>
          {error && <div style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>✗ {error}</div>}
          {value && (
            <div style={{ color: '#FFD60A', fontSize: '0.9rem' }}>
              ✓ URL: {value}
            </div>
          )}
        </div>
      </div>

      <FilePickerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={onChange}
        accept={accept}
      />
    </>
  );
}
