// ========== CARGAR COMPONENTES ==========

function incluirComponente(idContenedor, urlArchivo) {
  const contenedor = document.getElementById(idContenedor);
  if (contenedor) {
    fetch(urlArchivo)
      .then(res => res.text())
      .then(html => contenedor.innerHTML = html)
      .catch(err => console.error(`Error cargando ${urlArchivo}:`, err));
  }
}

// ========== CREAR PRODUCTO HTML ==========

function crearTarjetaProducto(prod, idx = null, conBotones = true) {
  const div = document.createElement('div');
  div.className = 'producto';

  div.innerHTML = `
    <img src="assets/${prod.imagen}" alt="${prod.nombre}">
    <h3>${prod.nombre}</h3>
    <p>$${prod.precio.toLocaleString()}</p>
    ${conBotones ? `
    <div class="botones-producto">
      <button class="ver-mas" data-idx="${idx}">Ver más</button>
      <button class="agregar-carrito" data-idx="${idx}">Agregar al carrito</button>
    </div>` : ''}
  `;
  return div;
}

// ========== CARGAR PRODUCTOS GENERALES ==========

function cargarProductosInicio() {
  const contenedor = document.getElementById('productos-container');
  if (!contenedor) return;

  const productos = [
    { nombre: 'Auriculares Bluetooth', precio: 120000, imagen: 'producto1.jpg' },
    { nombre: 'Camiseta deportiva', precio: 45000, imagen: 'producto2.jpg' },
    { nombre: 'Smartwatch', precio: 180000, imagen: 'producto3.jpg' },
    { nombre: 'Silla ergonómica', precio: 320000, imagen: 'producto4.jpg' },
    { nombre: 'Zapatillas urbanas', precio: 90000, imagen: 'producto5.jpg' },
    { nombre: 'Monitor 24"', precio: 550000, imagen: 'producto6.jpg' },
  ];

  productos.forEach((prod, idx) => {
    const card = crearTarjetaProducto(prod, idx);
    contenedor.appendChild(card);
  });

  contenedor.querySelectorAll('.agregar-carrito').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      agregarAlCarrito(productos[idx]);
      animarCarrito(e.target);
      mostrarToast(`${productos[idx].nombre} agregado al carrito`);
    });
  });

  contenedor.querySelectorAll('.ver-mas').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      alert(`Ver más de: ${productos[idx].nombre}`);
    });
  });

  actualizarContadorCarrito();
}

// ========== CARGAR PRODUCTOS POR CATEGORÍA ==========

function cargarProductosCategoria() {
  const contenedor = document.getElementById('categoria-productos');
  if (!contenedor) return;

  const productosCat = [
    { nombre: 'Laptop Gamer', precio: 2800000, imagen: 'laptop.jpg' },
    { nombre: 'Mouse inalámbrico', precio: 85000, imagen: 'mouse.jpg' },
    { nombre: 'Teclado mecánico', precio: 160000, imagen: 'teclado.jpg' },
    { nombre: 'Monitor curvo 27"', precio: 900000, imagen: 'monitor.jpg' },
    { nombre: 'Disco SSD 1TB', precio: 320000, imagen: 'ssd.jpg' },
  ];

  productosCat.forEach(p => {
    const card = crearTarjetaProducto(p, null, false);
    contenedor.appendChild(card);
  });
}

// ========== BUSCAR PRODUCTOS (search.html) ==========

async function cargarProducto(cardData, destinoId) {
  const contenedor = document.getElementById(destinoId);
  const res = await fetch('/components/product-card.html');
  const texto = await res.text();

  const plantilla = document.createElement('div');
  plantilla.innerHTML = texto.trim();

  const template = plantilla.querySelector('template');
  const clone = template.content.cloneNode(true);

  clone.querySelector('.producto-imagen').src = `/assets/${cardData.imagen}`;
  clone.querySelector('.producto-imagen').alt = cardData.nombre;
  clone.querySelector('.producto-nombre').textContent = cardData.nombre;
  clone.querySelector('.producto-precio').textContent = `$${cardData.precio.toLocaleString()}`;

  contenedor.appendChild(clone);
}

function manejarBusqueda() {
  if (!window.location.pathname.includes('search.html')) return;

  const urlParams = new URLSearchParams(window.location.search);
  const termino = urlParams.get('q') || 'Todos los productos';
  document.getElementById('termino-busqueda').textContent = termino;

  const productosSimulados = [
    { nombre: 'Celular Samsung A54', precio: 1200000, imagen: 'samsung.jpg' },
    { nombre: 'iPhone 13', precio: 2800000, imagen: 'iphone.jpg' },
    { nombre: 'Xiaomi Redmi Note 12', precio: 950000, imagen: 'xiaomi.jpg' },
  ];

  productosSimulados.forEach(producto => {
    cargarProducto(producto, 'resultados-busqueda');
  });
}

// ========== CARRITO Y TOAST ==========

function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const idx = carrito.findIndex(p => p.nombre === producto.nombre);

  if (idx > -1) {
    carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const total = carrito.reduce((sum, p) => sum + (p.cantidad || 1), 0);
  let badge = document.getElementById('carrito-contador');

  if (!badge) {
    const icono = document.getElementById('carrito-logo');
    if (icono) {
      badge = document.createElement('span');
      badge.id = 'carrito-contador';
      Object.assign(badge.style, {
        position: 'absolute', top: '0', right: '0', background: 'red',
        color: 'white', borderRadius: '50%', padding: '2px 6px',
        fontSize: '12px', fontWeight: 'bold', zIndex: '10'
      });
      icono.style.position = 'relative';
      icono.appendChild(badge);
    }
  }

  if (badge) badge.textContent = total > 0 ? total : '';
}

function animarCarrito(boton) {
  boton.classList.add('bounce');
  setTimeout(() => boton.classList.remove('bounce'), 400);

  const icono = document.getElementById('carrito-logo');
  if (icono) {
    icono.classList.add('shake');
    setTimeout(() => icono.classList.remove('shake'), 500);
  }
}

function mostrarToast(mensaje) {
  let toast = document.getElementById('toast-carrito');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-carrito';
    Object.assign(toast.style, {
      position: 'fixed', bottom: '30px', right: '30px',
      background: '#222', color: '#fff', padding: '12px 24px',
      borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      fontSize: '16px', opacity: '0', transition: 'opacity 0.3s',
      zIndex: '9999'
    });
    document.body.appendChild(toast);
  }

  toast.textContent = mensaje;
  toast.style.opacity = '1';
  setTimeout(() => toast.style.opacity = '0', 1500);
}

// ========== CAMBIAR IMAGEN PRINCIPAL (detalle) ==========

function cambiarImagen(img) {
  const imagenPrincipal = document.getElementById('imagen-principal');
  if (imagenPrincipal) imagenPrincipal.src = img.src;
}

// ========== ANIMACIONES CSS DINÁMICAS ==========

const style = document.createElement('style');
style.textContent = `
  .bounce {
    animation: bounce 0.4s;
  }
  @keyframes bounce {
    0% { transform: scale(1);}
    30% { transform: scale(1.15);}
    60% { transform: scale(0.95);}
    100% { transform: scale(1);}
  }
  .shake {
    animation: shake 0.5s;
  }
  @keyframes shake {
    0% { transform: translateX(0);}
    20% { transform: translateX(-4px);}
    40% { transform: translateX(4px);}
    60% { transform: translateX(-4px);}
    80% { transform: translateX(4px);}
    100% { transform: translateX(0);}
  }
`;
document.head.appendChild(style);

// ========== INICIALIZAR TODO ==========

document.addEventListener('DOMContentLoaded', () => {
  incluirComponente('header-container', '/components/header.html');
  incluirComponente('footer-container', '/components/footer.html');
  cargarProductosInicio();
  cargarProductosCategoria();
  manejarBusqueda();
});
