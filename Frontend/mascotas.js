import axios from 'axios';
import { el, icon, notifyOk, notifyError } from './documentsUtil.js';

window.leerMascotas = function () {
    console.log('Mascotas cargadas');
    axios.get('http://localhost:8080/mascotas')
        .then((response) => {
            const listaMascotas = response.data;
            const tablaMascotas = document.getElementById('tableBody');
            tablaMascotas.innerHTML = ''; // Limpiar tabla antes de agregar nuevas filas

            listaMascotas.forEach(mascota => {
                tablaMascotas.innerHTML += `
                    <tr id="mascota-${mascota.id}">
                        <td>${mascota.nombre}</td>
                        <td>${mascota.edad}</td>
                        <td>${mascota.especie}</td>
                        <td>${mascota.propietario}</td>
                        <td>
                            <button onclick="actualizarFormularioMascota(${mascota.id})">Editar</button>
                            <button onclick="eliminarMascota(${mascota.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(() => alert('Error al cargar las mascotas.'));
};


window.eliminarMascota = function (id) {
    if (confirm('Are you sure you want to delete this pet?')) {
        axios.delete(`http://localhost:8080/mascotas/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    notifyOk('Pet successfully deleted');
                    el('mascota-' + id).remove();
                }
            })
            .catch(() => notifyError('Error deleting the pet'));
    }
};

window.actualizarFormularioMascota = function (id) {
    axios.get(`http://localhost:8080/mascotas/${id}`).then((response) => {
        const mascota = response.data;
        const contenedorFormulario = el('edit-pet-container') || document.createElement('div');
        contenedorFormulario.id = 'edit-pet-container';

        const formulario = document.createElement('form');
        formulario.id = 'pet-form';

        ['nombre', 'edad', 'raza'].forEach(campo => {
            const input = document.createElement('input');
            input.id = campo;
            input.name = campo;
            input.value = mascota[campo];
            formulario.appendChild(input);
        });

        const botonGuardar = document.createElement('button');
        botonGuardar.textContent = 'Guardar';
        botonGuardar.onclick = () => guardarMascota(id);
        
        const botonCancelar = document.createElement('button');
        botonCancelar.textContent = 'Cancelar';
        botonCancelar.onclick = cerrarFormulario;
        
        formulario.append(botonGuardar, botonCancelar);
        contenedorFormulario.innerHTML = '';
        contenedorFormulario.appendChild(formulario);
        document.body.appendChild(contenedorFormulario);
    });
};

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

window.cerrarFormulario = function () {
    const contenedorFormulario = el('edit-pet-container');
    if (contenedorFormulario) {
        contenedorFormulario.remove();
    }
};