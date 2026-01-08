'use client';

type TextoProps = {
    titulo: string;
    texto: string;
    imagen: string;
    orientacion: 'izq' | 'der';
};

export function Texto({ titulo, texto, imagen, orientacion }: any) {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>{titulo}</h2>
            <p>{texto}</p>
            {imagen && <img src={imagen} alt={titulo} style={{ maxWidth: '300px' }} />}
        </div>
    );
}
