const canvasElement = document.getElementById('output_canvas');
const canvas = canvasElement.getContext('2d');
canvas.imageSmoothingEnabled = true;
const coordenadasIndice = document.getElementById('coordenadasIndice');
const botonIniciarJuego = document.getElementById('iniciarJuego');
const botonPausarJuego = document.getElementById('pausarJuego');
const botonLiberarPokemones = document.getElementById('limpiarPokemon')
const panelJuego = document.getElementById('panelJuego');
const imagen = document.getElementById('imagen');
const panelPokeCapturados = document.getElementById('panelPokeCapturados');
const pokeCapturados = document.getElementById('pokeCapturados');
let capturados = JSON.parse(localStorage.getItem('LSPokeCapturados')) || []


const URL = 'https://pokeapi.co/api/v2/pokemon/1'; // servidor caido
// fetch(URL)
// .then((res) => {
  //   console.log(res);
  //   return res.json();
  // })
  // .then((data) => {
    //   console.log(data)
    // })
    // .catch((error) => {
      //   console.error('Error al cargar los datos', error)
      // });

let disparos = [];
let ultimoDisparo = 0;
let pokebolasRestantes = 3;
const imagenPokebola = new Image();
imagenPokebola.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
const imagenPokeDisparo = new Image();
imagenPokeDisparo.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
const imagesPoke = [];
const Pokemon = []; 
let esperandoResolucion = false;
let totalIntentos = 0;
let intentosCapturados = 0;
let juegoActivo

let juegoFinalizado = false;

function Main() 
{
  puntos = JSON.parse(localStorage.getItem('puntos')) || 0;
  capturados = JSON.parse(localStorage.getItem('capturados')) || [];
  MostrarPokeCapturados();
  CargarSpritesDePokemon();
  CrearObjetosPokemon();
}
Main();

function CrearObjetosPokemon() {
  const m = canvasElement.width * 0.05;
  for (let i = 1; i <= 151; i++) {
    const pokemonAux = {
      id: i,
      velocidad: 7 + Math.random() * 2,
      tamaño: 100,
      sprite: imagesPoke[i],
      x: m + Math.random() * (canvasElement.width - 2 * m),
      y: 50,
    }
    Pokemon.push(pokemonAux);
  }
}
function CargarSpritesDePokemon()
{
  for (let i = 0; i <= 151; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`;
    imagesPoke.push(img);
  }
}
const lanzador = {
  x: canvasElement.width / 2,
  y: canvasElement.height - 30,
  angulo: Math.PI / 2,
};

let pokeActivo = null;

botonIniciarJuego.addEventListener("click", () => {
  botonIniciarJuego.disabled = true;
  botonPausarJuego.disabled = false;
  juegoActivo = true;
  panelJuego.classList.remove("pausado");

  if (!tracking) {
    inicializarTracking(canvasElement, DibujarFrame);
    tracking = true;
    console.log("Tracking inicializado");
  }

  if (!pokeActivo) {
    SeleccionarPokemon();
  }
});

botonPausarJuego.addEventListener("click", () => {
  botonIniciarJuego.disabled = false;
  botonPausarJuego.disabled = true; 
  juegoActivo = false;
  panelJuego.classList.add("pausado");
  coordenadasIndice.innerText = "Juego en pausa";
});
botonLiberarPokemones.addEventListener("click", () => {
  capturados = []
  localStorage.removeItem('capturados')
  puntos = 0
  MostrarPokeCapturados()
})

function DibujarFrame(results) {
  if (!pokeActivo) return
  
  canvas.save();
  canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvas.translate(canvasElement.width, 0);
  canvas.scale(-1, 1);
  canvas.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (juegoActivo) {
    DibujarLanzador();
    ActualizarDisparos();
    ActualizarPokemon();
    coordenadasIndice.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" style="width: 20px; vertical-align: middle;"> x ${pokebolasRestantes}`;
  }

  if (results.multiHandLandmarks) {
    procesarMano(results.multiHandLandmarks);
  }

  canvas.restore();
}

function SeleccionarPokemon() {
  if (pokeActivo) return;

  const idAleatorio = Math.floor(Math.random() * 151); // ID de 0 a 150
  pokeActivo = Pokemon[idAleatorio]; // Asignar el Pokémon aleatorio
  pokeActivo.y = -pokeActivo.tamaño;
  pokeActivo.x = Math.random() * (canvasElement.width - pokeActivo.tamaño);
  ReiniciarLanzamientos();
}

function EstadoDeJuego(intentos) {
  if (juegoFinalizado) return;

  if (intentos >= 5) {
    juegoFinalizado = true;
    CalcularPorcentaje();
    setTimeout(() => {
    ReiniciarJuego();
    }, 100); // Delay pequeño para evitar errores gráficos simultáneos
  } else {
    SeleccionarPokemon();
  }
}
function CalcularPorcentaje() {
  const porcentaje = Math.round((intentosCapturados / totalIntentos) * 100);
  Swal.fire({
  text: `🎯 Has capturado ${intentosCapturados} de ${totalIntentos} Pokémon\nTu precisión es del ${porcentaje}%.`,
  icon: "success"
});
}
function ReiniciarJuego() {
  juegoActivo = false;
  juegoFinalizado = false;
  intentosCapturados = 0;
  totalIntentos = 0;
  disparos = [];
  pokeActivo = null;
  esperandoResolucion = false;

  panelJuego.classList.add("pausado");
  coordenadasIndice.innerText = "Juego finalizado. Presiona iniciar para jugar de nuevo.";

  botonIniciarJuego.disabled = false;
  botonPausarJuego.disabled = true;
}
function ReiniciarLanzamientos()
{
  pokebolasRestantes = 1;
  disparos = [];
}
function DibujarLanzador() {
  const { x, y, angulo } = lanzador;
  canvas.save();
  canvas.translate(x, y);
  canvas.rotate(angulo);
  canvas.drawImage(imagenPokeDisparo, -50, -50, 100, 100);
  canvas.restore();
}
function ActualizarDisparos() {
  for (let i = disparos.length - 1; i >= 0; i--) {
    const d = disparos[i];
    d.x += Math.cos(d.angulo) * d.velocidad;
    d.y -= Math.sin(d.angulo) * d.velocidad;
    const tamaño = 50; // Tamaño de la Pokebola
    canvas.drawImage(imagenPokebola, d.x - tamaño/2, d.y - tamaño/2, tamaño, tamaño);
    if (
      d.y < 0 || d.y > canvasElement.height ||
      d.x < 0 || d.x > canvasElement.width
    ) {
      disparos.splice(i, 1);
    }
  }
}
function AgregarPokesCapturadosAPanel(atrapado) {
    const pokeExistente = capturados.find((p) => p.id === atrapado.id);
  if (pokeExistente) {
    pokeExistente.cantidad++;
  } else {
    atrapado.cantidad = 1; // Inicializar cantidad si es nuevo
    capturados.push(atrapado);
  }
  MostrarPokeCapturados()
}
function MostrarPokeCapturados() {
  pokeCapturados.innerHTML = "";

  capturados.forEach((pk) => {
    let cap = `
    <div class="pokeCapturados" id= "${pk.id}">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pk.id}.png"/>
      <h3>x${pk.cantidad}</h3>
    </div>
  `;
    pokeCapturados.innerHTML += cap;
    localStorage.setItem("capturados", JSON.stringify(capturados));
  });
}
let pokemonDestruido = false;
function ActualizarPokemon() {
  if (!pokeActivo) return;

  pokeActivo.y += pokeActivo.velocidad;
  canvas.drawImage(pokeActivo.sprite, pokeActivo.x, pokeActivo.y, pokeActivo.tamaño, pokeActivo.tamaño);

  for (let j = disparos.length - 1; j >= 0; j--) {
    const d = disparos[j];
    const e = pokeActivo;

    if (d.x > e.x &&d.x < e.x + e.tamaño &&d.y > e.y &&d.y < e.y + e.tamaño && !pokemonDestruido) 
    {
      if (!pokemonDestruido) 
      {
        intentosCapturados++;
        pokemonDestruido = true
      }
      AgregarPokesCapturadosAPanel(pokeActivo);
          setTimeout(() => {
            puntos++;
            disparos.splice(j, 1);
            esperandoResolucion = false;
            if (pokeActivo) {
              pokeActivo = null;
              totalIntentos++;
              EstadoDeJuego(totalIntentos);
              pokemonDestruido = false
            }
          }, 200);
    }
  }

  if (pokeActivo.y > canvasElement.height && !esperandoResolucion) {
    esperandoResolucion = true;
    setTimeout(() => {
      if (pokeActivo) {
        puntos--;
        pokeActivo = null;
        esperandoResolucion = false;
        totalIntentos++
        EstadoDeJuego(totalIntentos)
      }
    }, 300);
    return;
  }
  if (pokebolasRestantes === 0 && disparos.length === 0 && !esperandoResolucion) {
    esperandoResolucion = true;
    setTimeout(() => {
      if (pokeActivo) {
        puntos--;
        pokeActivo = null;
        totalIntentos++
        esperandoResolucion = false;
        EstadoDeJuego(totalIntentos)
      }
    }, 350);
  }
}
function procesarMano(manos) {
  for (const landmarks of manos) {
    drawConnectors(canvas, landmarks, HAND_CONNECTIONS, {
      color: "#00ff0060",
      lineWidth: 2,
    });

    const pulgar = landmarks[4];
    const indice = landmarks[8];

    const pulgarX = (1 - pulgar.x) * canvasElement.width;
    const pulgarY = pulgar.y * canvasElement.height;

    const dx = pulgarX - lanzador.x;
    const dy = pulgarY - lanzador.y;

    lanzador.angulo = Math.atan2(dy, -dx);

    const distanciaPulgarIndice = Math.hypot(
      pulgar.x - indice.x,
      pulgar.y - indice.y
    );

    const ahora = Date.now();

    if (distanciaPulgarIndice < 0.05 && ahora - ultimoDisparo > 500 &&pokebolasRestantes > 0) 
      {
      disparos.push({
        x: lanzador.x,
        y: lanzador.y,
        radio: 6,
        angulo: -Math.atan2(dy, -dx),
        velocidad: 10,
      });
      ultimoDisparo = ahora;
      pokebolasRestantes--;
    }
  }
}
