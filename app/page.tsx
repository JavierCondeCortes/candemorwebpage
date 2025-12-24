
import { CandeNavbar } from "./components/principalWeb/navbar/candeNavbar"
import { VideoHero } from "./components/principalWeb/hero/hero";
import { SponsorBar } from "./components/principalWeb/sponsorBar/sponsor";
import { Footer } from "./components/principalWeb/footer/footer";
import { Texto } from "./components/principalWeb/elementoTexto/text";

export default function Home() {
  return (
    <div>
      <header>
        <nav 
          // className="sticky top-0 z-1"
        >  
          <CandeNavbar />
        </nav>
        <div className="Hero">
          <VideoHero />
          <SponsorBar />
        </div>
      </header>
      <main className="max-w-[70%] m-auto bg-[var(--contentground)] rounded-lg mt-12 mb-12">
          <Texto titulo="Sobre Nosotros" 
                    texto="Este es un ejemplo de un componente de texto con la imagen a la izquierda. 
                          Puedes personalizar este texto y agregar más contenido según tus necesidades." 
                    imagen="/Mike.png"
                    orientacion={'izq'}
          />
          <Texto titulo="Sobre Nosotros" 
                    texto="Este es un ejemplo de un componente de texto con la imagen a la izquierda. 
                          Puedes personalizar este texto y agregar más contenido según tus necesidades." 
                    imagen="/Mike.png"
                    orientacion={'der'}
          />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
