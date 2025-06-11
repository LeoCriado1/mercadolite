// seller-panel.js

document.addEventListener('DOMContentLoaded', () => {
  const btnNuevo = document.getElementById('btn-nuevo-producto');
  const modal = document.getElementById('modal-producto');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');
  const formProducto = document.getElementById('form-producto');
  const tbody = document.querySelector('#tabla-productos tbody');

  let productos = JSON.parse(localStorage.getItem('productos')) || [];
  let editando = false;
  let editIndex = null;

  // Función para mostrar productos en la tabla
  function renderProductos() {
    tbody.innerHTML = '';
    productos.forEach((prod, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${prod.imagen}" alt="${prod.nombre}"></td>
        <td>${prod.nombre}</td>
        <td>$${prod.precio.toLocaleString()}</td>
        <td>${prod.stock}</td>
        <td>
          <button class="btn-editar" data-index="${index}">Editar</button>
          <button class="btn-eliminar" data-index="${index}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    actualizarEstadisticas();
    agregarEventosBotones();
  }

  // Actualizar estadísticas
  function actualizarEstadisticas() {
    document.getElementById('total-productos').textContent = productos.length;
    // Ventas e ingresos ejemplo estáticos (puedes integrar real)
    document.getElementById('total-ventas').textContent = 25;
    document.getElementById('total-ingresos').textContent = '$12.500.000';
  }

  // Eventos botones editar y eliminar
  function agregarEventosBotones() {
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = e.target.dataset.index;
        abrirModal(true, idx);
      });
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = e.target.dataset.index;
        if (confirm('¿Eliminar este producto?')) {
          productos.splice(idx, 1);
          guardarProductos();
          renderProductos();
        }
      });
    });
  }

  // Abrir modal
  function abrirModal(isEdit = false, index = null) {
    modal.classList.remove('oculto');
    editando = isEdit;
    editIndex = index;

    if (isEdit && index !== null) {
      const prod = productos[index];
      formProducto.nombre.value = prod.nombre;
      formProducto.precio.value = prod.precio;
      formProducto.stock.value = prod.stock;
      formProducto.imagen.value = prod.imagen;
      document.getElementById('modal-titulo').textContent = 'Editar producto';
    } else {
      formProducto.reset();
      document.getElementById('modal-titulo').textContent = 'Nuevo producto';
    }
  }

  // Cerrar modal
  btnCerrarModal.addEventListener('click', () => {
    modal.classList.add('oculto');
  });

  // Guardar producto (nuevo o editar)
  formProducto.addEventListener('submit', e => {
    e.preventDefault();

    const nuevoProducto = {
      nombre: formProducto.nombre.value.trim(),
      precio: Number(formProducto.precio.value),
      stock: Number(formProducto.stock.value),
      imagen: formProducto.imagen.value.trim(),
    };

    if (editando) {
      productos[editIndex] = nuevoProducto;
    } else {
      productos.push(nuevoProducto);
    }

    guardarProductos();
    renderProductos();
    modal.classList.add('oculto');
  });

  // Guardar en localStorage
  function guardarProductos() {
    localStorage.setItem('productos', JSON.stringify(productos));
  }

  // Inicializar
  renderProductos();

  btnNuevo.addEventListener('click', () => abrirModal());
});
