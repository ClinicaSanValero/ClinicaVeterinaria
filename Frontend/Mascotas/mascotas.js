import axios from 'axios';
import { el, icon, notifyOk, notifyError } from './documentsUtil.js';

// Función para leer las mascotas desde el servidor
window.leerMascotas = function () {
    axios.get('http://localhost:8080/mascotas')
        .then((response) => {
            const listaMascotas = response.data;
            const tablaMascotas = el('tableBody');
            tablaMascotas.innerHTML = ''; // Limpiar tabla antes de agregar filas nuevas

            listaMascotas.forEach(mascota => {
                const fila = document.createElement('tr');
                fila.id = 'mascota-' + mascota.id;
                
                const celdaNombre = document.createElement('td');
                celdaNombre.textContent = mascota.nombre;
                
                const celdaEdad = document.createElement('td');
                celdaEdad.textContent = mascota.edad;
                
                const celdaRaza = document.createElement('td');
                celdaRaza.textContent = mascota.raza;
                
                const botonEditar = document.createElement('button');
                botonEditar.textContent = 'Editar';
                botonEditar.onclick = () => actualizarFormularioMascota(mascota.id);
                
                const botonEliminar = document.createElement('button');
                botonEliminar.textContent = 'Eliminar';
                botonEliminar.onclick = () => eliminarMascota(mascota.id);
                
                const celdaAcciones = document.createElement('td');
                celdaAcciones.appendChild(botonEditar);
                celdaAcciones.appendChild(botonEliminar);
                
                fila.append(celdaNombre, celdaEdad, celdaRaza, celdaAcciones);
                tablaMascotas.appendChild(fila);
            });
        })
        .catch(() => notifyError('Error loading pets'));
};

// Función para eliminar una mascota
window.eliminarMascota = function (id) {
    if (confirm('Are you sure you want to delete this pet?')) {
        axios.delete(`http://localhost:8080/mascotas/${id}`)
            .then((response) => {
                if (response.status === 204) {
                    notifyOk('Pet successfully deleted');
                    el('mascota-' + id).remove();
                }
            })
            .catch(() => notifyError('Error deleting the pet'));
};

// Función para actualizar el formulario de una mascota
window.actualizarFormularioMascota = function (id) {
    axios.get(`http://localhost:8080/mascotas/${id}`).then((response) => {
        const mascota = response.data;
        const contenedorFormulario = el('edit-pet-container') || document.createElement('div');
        contenedorFormulario.id = 'edit-pet-container';

        const formulario = document.createElement('form');
        formulario.id = 'pet-form';

        // Crear los campos del formulario para editar mascota
        ['nombre', 'edad', 'raza'].forEach(campo => {
            const input = document.createElement('input');
            input.id = campo;
            input.name = campo;
            input.value = mascota[campo];
            formulario.appendChild(input);
        });

        // Crear botones de guardar y cancelar
        const botonGuardar = document.createElement('button');
        botonGuardar.textContent = 'Guardar';
        botonGuardar.onclick = () => guardarMascota(id);
        
        const botonCancelar = document.createElement('button');
        botonCancelar.textContent = 'Cancelar';
        botonCancelar.onclick = cerrarFormulario;
        
        formulario.append(botonGuardar, botonCancelar);
        contenedorFormulario.innerHTML = ''; // Limpiar contenedor
        contenedorFormulario.appendChild(formulario);
        document.body.appendChild(contenedorFormulario);
    });
};

// Función para guardar los cambios de una mascota
window.guardarMascota = function (id) {
    const formulario = el('pet-form');
    if (!formulario.nombre.value) {
        notifyError('Name is a required field');
        return;
    }
    
    const mascotaActualizada = {
        nombre: formulario.nombre.value,
        edad: formulario.edad.value,
        raza: formulario.raza.value,
    };
    
    axios.put(`http://localhost:8080/mascotas/${id}`, mascotaActualizada)
        .then(() => {
            notifyOk('Pet successfully updated');
            cerrarFormulario();
            window.location.reload();
        })
        .catch(() => notifyError('Error updating the pet'));
};

// Función para cerrar el formulario de edición de mascota
window.cerrarFormulario = function () {
    const contenedorFormulario = el('edit-pet-container');
    if (contenedorFormulario) {
        contenedorFormulario.remove();
    }
}};
