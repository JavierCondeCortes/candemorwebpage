'use server'

export async function Footer() {
    return (
        <footer className="relative w-full h-34.5 px overflow-hidden cursor-default flex items-end justify-end
                bg-gradient-to-l from-[var(--limeCandemor)] via-black to-[var(--pinkCandemor)]   
                bg-rotate">
            <div className="flex flex-col items-center justify-center bg-[var(--background)] w-full h-[90%] text-white py-4 opacity-90">
                <div>
                    <a href="https://twitter.com/candemor" target="_blank" className="mx-2 basis-0 hover:underline">Twitter</a>
                    <a href="https://discord.gg/HHusseuHwx" target="_blank" className="mx-2 basis-0 hover:underline">Discord</a>
                    <a href="https://www.instagram.com/candemor/" target="_blank" className="mx-2 basis-0 hover:underline">Instagram</a>
                </div>
                <p className="text-sm">&copy; {new Date().getFullYear()} Candemor. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}