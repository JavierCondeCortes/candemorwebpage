import styles from "./sponsor.module.css"

//crear un array asociativo o mapa para guardar el nombre e imagen, para, que a medida que sume o reste
// no pierda la cantidad de elementos y el espacio de la web

export function SponsorBar(){

    const sponsor = [
        {id:0,name:"FatCat",src:"/img/sponsors/FatCat.png", url: "https://www.fatcatrace.xyz/home"},
        {id:1,name:"SpcarcoGiti",src:"img/sponsors/SparcoGiti.png", url:"https://giti-tire.eu/"},
        {id:2,name:"Zdrinks",src:"img/sponsors/Zdrinks.png", url:"https://www.zetadrinks.com/"},
    ]

    return(
        <ul className="flex justify-around h-[8vh] items-center my-7 mx-2">
            {sponsor.map(marca =>(
                <li key={marca.id}>
                    <a href={marca.url} target="_blank"><img src={marca.src} alt={marca.name} className="h-[3vw] flex basis-0 grow hover:scale-110 transition-all duration-300 ease-in-out "/></a>
                </li>
            ))}
        </ul>
    )
}