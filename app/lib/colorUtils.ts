/**
 * Utilidades para manejo de colores
 */

export class ColorUtils {
  /**
   * Valida si un string es un color válido
   */
  static isValidColor(color: string): boolean {
    if (!color || typeof color !== 'string') return false;
    
    // Validar hex (#RGB, #RRGGBB, #RRGGBBAA)
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3})$/.test(color)) {
      return true;
    }
    
    // Validar rgb/rgba
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/.test(color)) {
      return true;
    }
    
    return false;
  }

  /**
   * Normaliza un color a formato hex
   */
  static toHex(color: string): string {
    if (!color) return '#000000';
    
    // Ya es hex
    if (color.startsWith('#')) {
      return color.length === 7 || color.length === 9 ? color : '#000000';
    }

    // Convertir rgb/rgba a hex
    const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      const a = rgbMatch[4] ? Math.round(parseFloat(rgbMatch[4]) * 255) : 255;

      const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
      return a === 255 
        ? `#${toHex(r)}${toHex(g)}${toHex(b)}`
        : `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
    }

    return '#000000';
  }

  /**
   * Convierte hex a rgba
   */
  static hexToRgba(hex: string, alpha: number = 1): string {
    if (!hex.startsWith('#')) return `rgba(0, 0, 0, ${alpha})`;

    const cleanHex = hex.replace('#', '');
    
    // Manejar #RGB
    if (cleanHex.length === 3) {
      const r = parseInt(cleanHex[0] + cleanHex[0], 16);
      const g = parseInt(cleanHex[1] + cleanHex[1], 16);
      const b = parseInt(cleanHex[2] + cleanHex[2], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Manejar #RRGGBB
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Manejar #RRGGBBAA
    if (cleanHex.length === 8) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      const a = parseInt(cleanHex.substring(6, 8), 16) / 255;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    return `rgba(0, 0, 0, ${alpha})`;
  }

  /**
   * Normaliza colores para comparación
   */
  static normalize(color: string): string {
    if (!color) return '';
    return this.toHex(color).toLowerCase();
  }

  /**
   * Compara dos colores ignorando formato
   */
  static compare(color1: string, color2: string): boolean {
    return this.normalize(color1) === this.normalize(color2);
  }

  /**
   * Obtiene el mejor color de contraste (negro o blanco)
   */
  static getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}
