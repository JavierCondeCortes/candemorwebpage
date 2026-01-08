type TextoProps = {
    titulo: string;
    texto: string;
    imagen: string;
    orientacion: 'izq' | 'der';
};

export default function Texto({ titulo, texto, imagen, orientacion }: TextoProps) {
    let contenido;

    switch (orientacion) {
        case 'izq':
            contenido = (
                <div className="flex flex-col md:flex-row items-center md:justify-center gap-6 md:gap-12 px-6 md:px-0 py-12 md:py-10 bg-[var(--darkCandemor)]">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{titulo}</h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-md">{texto}</p>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center md:justify-center">
                        <img
                            src={`/img/${imagen}`}
                            alt="Sobre Nosotros"
                            className="w-full h-auto max-w-sm rounded-lg"
                        />
                    </div>
                </div>
            );
            break;

        case 'der':
        default:
            contenido = (
                <div className="flex flex-col md:flex-row items-center md:justify-center gap-6 md:gap-12 px-6 md:px-0 py-12 md:py-10 bg-[var(--darkCandemor)]">
                    <div className="w-full md:w-1/2 flex justify-center md:justify-center">
                        <img
                            src={`/img/${imagen}`}
                            alt="Sobre Nosotros"
                            className="w-full h-auto max-w-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{titulo}</h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-md">{texto}</p>
                    </div>
                </div>
            );
            break;
    }

    return <div>{contenido}</div>;
}
