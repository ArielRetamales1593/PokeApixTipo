const tiposURL = "https://pokeapi.co/api/v2/type/";
const divResultado = document.getElementById("cont");

// Get para el tipo de datos
fetch(tiposURL)
  .then((response) => response.json())
  .then(async (data) => {
    const tipos = data.results;

    // acá me enredé , no encontraba las imagenes
    async function obtenerURLImagen(url) {
      const response = await fetch(url);
      const pokemonData = await response.json();
      return pokemonData.sprites.front_default;
    }

    // Pokemon de cada tipo
    for (const tipo of tipos) {
      const tipoURL = tipo.url;
      const tipoResponse = await fetch(tipoURL);
      const tipoData = await tipoResponse.json();
      const nombreTipo = tipo.name;
      const pokemonTipo = tipoData.pokemon;

      //  verificar
      if (pokemonTipo.length > 0) {
        const tipoDiv = document.createElement("div");
        tipoDiv.classList.add("tipo-pokemon");

        const carruselDiv = document.createElement("div");
        carruselDiv.classList.add("slick-carousel");

        // pintar
        const carruselHTML = await Promise.all(
          pokemonTipo.map(async (p) => {
            const imagenURL = await obtenerURLImagen(p.pokemon.url);
            return `
              <div class="card1 text-center " style="border: 2px double white; background-color: #A0AEC0"  >
                <div class=" d-flex justify-content-center align-items-center flex-direcction-column">
                  <div class="col-md-4">
                    <img src="${imagenURL}" class="img-fluid rounded-start" alt="${p.pokemon.name}">
                  </div>
                  <div class="col-md-8">
                  
                      <h5 class="card-title" style="color: #F5F7FA">${p.pokemon.name}</h5>
                    </div>
                  </div>
                </div>
              </div>
            `;
          })
        );

        carruselDiv.innerHTML = carruselHTML.join("");

        tipoDiv.innerHTML = `
          <h2 class="titulo text-center" style="color: #fcd20b" >Tipo: ${nombreTipo}</h2>
        `;
        tipoDiv.appendChild(carruselDiv);

        // Agregar
        divResultado.appendChild(tipoDiv);

        //Slick
        $(carruselDiv).slick({
          dots: false,
          infinite: false,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 3,

          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: false,
              },
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],
        });
      }
    }
  })
  .catch((error) => {
    console.error("Error al obtener la lista de tipos de Pokémon:", error);
  });
