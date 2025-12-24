'use server'
//Apuntes
//tener en cuenta que el video estaria mejor alojado en el servidor para que no carge a las personas
export async function VideoHero() {
    return (

        <main className="relative w-full h-screen z-0 overflow-hidden cursor-default pb-3 
                bg-gradient-to-l from-[var(--limeCandemor)] via-black to-[var(--pinkCandemor)]   
                bg-rotate">


            <video
                src="/video/Hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-screen h-full object-cover object-center mx-auto"
            />

            {/* Logo encima del vídeo */}
            <div className="absolute top-[30vh] w-full grid">
                <h1
                    style={{ fontFamily: 'Dog Rough' }}
                    className="text-[10vw] flex justify-self-center"
                >
                    CANDEMOR
                </h1>
            </div>

            {/* Botón debajo del logo, encima del vídeo */}
            <div className="group">
                <a
                    href="https://discord.gg/HHusseuHwx"
                    target="_blank"
                    className="absolute top-[85vh] left-1/2 -translate-x-1/2 z-10 inline-flex items-center bg-white text-black px-6 py-3 rounded shadow transition-all duration-300 hover:scale-110"
                >
                    <img src="/img/DiscordSymbol.svg" alt="Discord" className="absolute size-9 -rotate-20 -top-3 -left-2" />
                    Unirse a la Comunidad
                </a>

                <img src="/img/cafe.png" alt="imagen Cafe" className="absolute top-[85.3vh] left-1/2 h-10 w-10 transition-all duration-300  ease-in-out delay-100 group-hover:translate-x-[8rem]" />

            </div>

            <button
                className="absolute top-[94vh] left-1/2 rounded-md text-white tracking-wider shadow-xl animate-bounce"
            >
                <svg
                    className="w-5 h-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    ></path>
                </svg>
            </button>
        </main>
    );
}
