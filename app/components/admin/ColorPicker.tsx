'use client';

import { useState, useEffect } from 'react';
import { ColorUtils } from '@/app/lib/colorUtils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  onAddToHistory?: (color: string) => void;
  onAddToFavorites?: (color: string) => void;
  favorites?: string[];
  history?: string[];
}

export function ColorPicker({
  value,
  onChange,
  label,
  onAddToHistory,
  onAddToFavorites,
  favorites = [],
  history = [],
}: ColorPickerProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [inputError, setInputError] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setDisplayValue(value);
    setInputError('');
  }, [value]);

  const handleColorChange = (newColor: string) => {
    if (!newColor || !ColorUtils.isValidColor(newColor)) {
      return;
    }

    setDisplayValue(newColor);
    setInputError('');
    onChange(newColor);
    onAddToHistory?.(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim();
    setDisplayValue(newValue);

    if (newValue.length === 0) {
      setInputError('');
      return;
    }

    if (!ColorUtils.isValidColor(newValue)) {
      setInputError('❌ Formato: #HEX, rgb() o rgba()');
      return;
    }

    setInputError('');
    onChange(newValue);
    onAddToHistory?.(newValue);
  };

  const handleAddFavorite = () => {
    if (ColorUtils.isValidColor(displayValue)) {
      onAddToFavorites?.(displayValue);
    }
  };

  const handleFavoriteSelect = (color: string) => {
    if (ColorUtils.isValidColor(color)) {
      setDisplayValue(color);
      setInputError('');
      onChange(color);
      onAddToHistory?.(color);
    }
  };

  const handleHistorySelect = (color: string) => {
    if (ColorUtils.isValidColor(color)) {
      setDisplayValue(color);
      setInputError('');
      onChange(color);
      onAddToHistory?.(color);
    }
  };

  const isFavorited = favorites.some(fav => ColorUtils.compare(fav, displayValue));
  const isValid = ColorUtils.isValidColor(displayValue);
  const hexValue = isValid ? ColorUtils.toHex(displayValue) : '#000000';

  return (
    <div className="form-group">
      <label style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '0.5rem',
      }}>
        <span>{label}</span>
        <span style={{ 
          fontSize: '0.8rem', 
          color: isValid ? '#FFD60A' : inputError ? '#ff6b6b' : '#b0b0b0',
          fontWeight: '600',
        }}>
          {isValid ? '✓ Válido' : inputError ? '✗ Error' : ''}
        </span>
      </label>
      
      {/* Color Input Row */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        width: '100%', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        padding: '0.8rem',
        background: 'rgba(157, 78, 221, 0.08)',
        borderRadius: '8px',
        border: `2px solid ${inputError ? '#ff6b6b' : isValid ? '#FFD60A' : '#9D4EDD'}`,
        transition: 'all 0.3s',
      }}>
        {/* Color Preview Circle */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          style={{
            width: '50px',
            height: '50px',
            background: isValid ? displayValue : 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)',
            backgroundSize: '10px 10px',
            borderRadius: '50%',
            border: `2px solid ${isValid ? displayValue : '#9D4EDD'}`,
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: isValid ? `0 0 15px ${displayValue}40` : '0 4px 12px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
          title="Click para abrir selector de color"
        />

        {/* Text Input */}
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          placeholder="#HEX, rgb() o rgba()"
          style={{
            flex: 1,
            minWidth: '150px',
            padding: '0.8rem',
            border: 'none',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
            transition: 'all 0.3s',
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.background = 'rgba(157, 78, 221, 0.2)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={handleAddFavorite}
          disabled={!isValid}
          title={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          style={{
            padding: '0.6rem 0.8rem',
            background: isFavorited ? '#FFD60A' : 'rgba(157, 78, 221, 0.3)',
            border: `2px solid ${isFavorited ? '#FFD60A' : '#9D4EDD'}`,
            borderRadius: '6px',
            color: isFavorited ? '#000' : '#fff',
            cursor: !isValid ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            transition: 'all 0.3s',
            opacity: !isValid ? 0.4 : 1,
          }}
          onMouseEnter={(e) => {
            if (isValid && !isFavorited) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(157, 78, 221, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (isValid && !isFavorited) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(157, 78, 221, 0.3)';
            }
          }}
        >
          ★
        </button>
      </div>

      {/* Error Message */}
      {inputError && (
        <div style={{
          width: '100%',
          marginTop: '0.5rem',
          padding: '0.6rem 0.8rem',
          background: 'rgba(255, 107, 107, 0.15)',
          border: '1px solid #ff6b6b',
          borderRadius: '6px',
          color: '#ff9999',
          fontSize: '0.85rem',
        }}>
          {inputError}
        </div>
      )}

      {/* Color Picker */}
      {showPicker && (
        <div style={{
          width: '100%',
          marginTop: '0.5rem',
          padding: '0.8rem',
          background: 'rgba(157, 78, 221, 0.15)',
          borderRadius: '8px',
          border: '1px solid #9D4EDD',
        }}>
          <input
            type="color"
            value={hexValue}
            onChange={(e) => handleColorChange(e.target.value)}
            style={{
              width: '100%',
              height: '60px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          />
        </div>
      )}

      {/* Favoritos */}
      {favorites.length > 0 && (
        <div style={{
          width: '100%',
          marginTop: '0.8rem',
          padding: '0.8rem',
          background: 'rgba(255, 214, 10, 0.08)',
          borderRadius: '8px',
          borderLeft: '3px solid #FFD60A',
        }}>
          <p style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '0.75rem', 
            color: '#FFD60A', 
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            ⭐ Favoritos ({favorites.length})
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {favorites.map((color) => (
              <button
                key={color}
                onClick={() => handleFavoriteSelect(color)}
                title={`${color}\nClick para aplicar`}
                style={{
                  width: '40px',
                  height: '40px',
                  background: color,
                  border: ColorUtils.compare(displayValue, color) 
                    ? '3px solid #fff' 
                    : '2px solid rgba(255,255,255,0.4)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: ColorUtils.compare(displayValue, color)
                    ? `0 0 12px ${color}80`
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.15)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 16px ${color}60`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = ColorUtils.compare(displayValue, color)
                    ? `0 0 12px ${color}80`
                    : 'none';
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Historial */}
      {history.length > 0 && (
        <div style={{
          width: '100%',
          marginTop: '0.8rem',
          padding: '0.8rem',
          background: 'rgba(157, 78, 221, 0.08)',
          borderRadius: '8px',
          borderLeft: '3px solid #9D4EDD',
        }}>
          <p style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '0.75rem', 
            color: '#9D4EDD', 
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            📋 Historial ({history.length})
          </p>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {history.slice(0, 12).map((color, idx) => (
              <button
                key={`${idx}-${color}`}
                onClick={() => handleHistorySelect(color)}
                title={`${color}\nClick para aplicar`}
                style={{
                  width: '32px',
                  height: '32px',
                  background: color,
                  border: ColorUtils.compare(displayValue, color)
                    ? '2px solid #fff'
                    : '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
