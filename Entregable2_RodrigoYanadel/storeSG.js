const btnCarrito = document.getElementById('cart-btn')
const panelCarrito = document.getElementById('cart-panel')
const contenedorJuegos = document.getElementById('contenedor-productos')
const juegosEnCarrito = document.getElementById('cart-items')
const btnFinalizarCompra = document.getElementById('terminar-compra')
const totalCompra = document.getElementById('total')
const inputSugerencia = document.getElementById('input-sugerencia')
const btnSugerir = document.getElementById('btn-sugerir')
const sugerenciaResult = document.getElementById('sugerencia-result')

let carritoVideojuegos = JSON.parse(localStorage.getItem('carrito_videojuegos')) || []

let carritoAbierto = JSON.parse(localStorage.getItem('carrito_abierto')) || false

if (carritoAbierto) {
	panelCarrito.classList.add('active')
} else {
	panelCarrito.classList.remove('active')
}

btnCarrito.addEventListener('click', () => {
	if (!panelCarrito.classList.contains('active')) {
		carritoAbierto = true
	} else {
		carritoAbierto = false
	}

	panelCarrito.classList.toggle('active')

	localStorage.setItem('carrito_abierto', JSON.stringify(carritoAbierto))
})

function iniciarTienda() {
	mostrarCarrito()
	renderizarJuegos()
	asignarEventosAgregar()
}

function mostrarCarrito() {
	juegosEnCarrito.innerHTML = ''

	carritoVideojuegos.forEach(juego => {
		const item = `
			<div class="product-card" id="${juego.id}V">
				<img src="${juego.imagen}" alt="${juego.alt}" />
				<h3>${juego.titulo}</h3>
				<span class="price">$${juego.precio}</span>
			</div>`
		juegosEnCarrito.innerHTML += item
	})

	totalCompra.innerHTML = calcularTotal()
}

function renderizarJuegos() {
	contenedorJuegos.innerHTML = ''  // Limpio antes de agregar
	videojuegosSerios.forEach(juego => {
		const tarjeta = `
			<div class="product-card" id="${juego.id}V">
				<img src="${juego.imagen}" alt="${juego.alt}" />
				<h3>${juego.titulo}</h3>
				<p>${juego.descripcion}</p>
				<span class="price">$${juego.precio}</span>
				<button class="add-to-cart">
					Agregar al carrito
				</button>
			</div>`
		contenedorJuegos.innerHTML += tarjeta
	})
}

function asignarEventosAgregar() {
	const botonesAgregar = document.querySelectorAll('.add-to-cart')
	botonesAgregar.forEach(boton => {
		boton.addEventListener('click', (e) => {
			let idJuego = e.target.parentNode.id
			let juegoSeleccionado = buscarJuegoPorId(idJuego)
			agregarAlCarrito(juegoSeleccionado)
			mostrarCarrito()
			console.log(carritoVideojuegos)
		})
	})
}

function agregarAlCarrito(juego) {
	carritoVideojuegos.push(juego)
	localStorage.setItem('carrito_videojuegos', JSON.stringify(carritoVideojuegos))
}

function calcularTotal() {
	return carritoVideojuegos.reduce((acum, juego) => {
		return acum + Number(juego.precio)
	}, 0)
}

function buscarJuegoPorId(id) {
	return videojuegosSerios.find(juego => juego.id === id.slice(0, -1))
}

btnFinalizarCompra.addEventListener('click', () => {
	carritoVideojuegos = []
	localStorage.removeItem('carrito_videojuegos')
	mostrarCarrito()
})

btnSugerir.addEventListener('click', () => {
	const texto = inputSugerencia.value.trim().toLowerCase()
	if (!texto) {
		sugerenciaResult.textContent = 'Por favor, ingresa un término para buscar.'
		return
	}

	const resultados = videojuegosSerios.filter(juego => 
		juego.titulo.toLowerCase().includes(texto) ||
		juego.descripcion.toLowerCase().includes(texto)
	)

	if (resultados.length === 0) {
		sugerenciaResult.textContent = 'No encontramos juegos que coincidan. Intenta con otra palabra.'
	} else {
		const sugerido = resultados[0]
		sugerenciaResult.innerHTML = `🎮 <strong>${sugerido.titulo}</strong>: ${sugerido.descripcion} <br> Precio: $${sugerido.precio}`
	}
})

const videojuegosSerios = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    titulo: 'Alcanza las luces',
    descripcion: 'Mejorar El ROM y la flexibilidad',
    precio: 100000,
    imagen: '',
    alt: 'Mano tocando luces LED'
  },
  {
    id: '9c858901-8a57-4791-81fe-4c455b099bc9',
    titulo: 'Equilibrio sobre una balsa',
    descripcion: 'Mejora el equilibrio postural',
    precio: 120000,
    imagen: '',
    alt: 'Persona equilibrándose sobre balsa'
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    titulo: 'Encuentra el objeto perdido',
    descripcion: 'Movilidad de la cabeza y el cuello',
    precio: 75000,
    imagen: '',
    alt: 'Búsqueda de objeto ilustración'
  },
  {
    id: 'e4eaaaf2-d142-11e1-b3e4-080027620cdd',
    titulo: 'Si parpadeas, PIERDES',
    descripcion: 'Mejora la concentración',
    precio: 185000,
    imagen: '',
    alt: 'Ojo y concentración'
  },
  {
    id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    titulo: 'Rojo o Azul',
    descripcion: 'Entrena la atención dividida',
    precio: 320000,
    imagen: '',
    alt: 'Elección entre rojo y azul'
  },
]

iniciarTienda()
