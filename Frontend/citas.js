import axios from 'axios';
import { el, icon, notifyOk, notifyError } from './documentsUtil.js';

window.leerCitas = function () {
    console.log('Citas cargadas');
    axios.get('http://localhost:8080/citas')
        .then((response) => {
            const listaCitas = response.data;
            const tablaCitas = document.getElementById('tableBody');
            tablaCitas.innerHTML = ''; // Limpiar tabla antes de agregar nuevas filas

            listaCitas.forEach(cita => {
                tablaCitas.innerHTML += `
                    <tr id="cita-${cita.id}">
                        <td>${cita.fecha}</td>
                        <td>${cita.hora}</td>
                        <td>${cita.motivo}</td>
                        <td>${cita.id_mascota}</td>
                        <td>${cita.id_veterinario}</td>
                        <td>
                            <button onclick="actualizarFormularioCita(${cita.id})">Editar</button>
                            <button onclick="eliminarCita(${cita.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(() => alert('Error al cargar las citas.'));
};



window.eliminarCita = function (id) {
    if (confirm('¿Está seguro de que desea eliminar esta cita?')) {
        axios.delete('http://localhost:8080/citas/' + id)
            .then((response) => {
                if (response.status == 200) { // 200 si la cita se elimina correctamente
                    notifyOk('Cita eliminada correctamente');
                    el('cita-' + id).remove();
                }
            })
            .catch((error) => {
                console.error('Error al eliminar la cita:', error); // Log del error en caso de fallo
                notifyError('Error al eliminar la cita');
            });
    }
};




window.actualizarFormularioCita = function (id) {
    axios.get(`http://localhost:8080/citas/${id}`).then((response) => {
        const cita = response.data;
        const contenedorFormulario = el('edit-appointment-container') || document.createElement('div');
        contenedorFormulario.id = 'edit-appointment-container';

        const formulario = document.createElement('form');
        formulario.id = 'appointment-form';

        ['fecha', 'hora', 'mascota'].forEach(campo => {
            const input = document.createElement('input');
            input.id = campo;
            input.name = campo;
            input.value = cita[campo];
            formulario.appendChild(input);
        });

        const botonGuardar = document.createElement('button');
        botonGuardar.textContent = 'Guardar';
        botonGuardar.onclick = () => guardarCita(id);
        
        const botonCancelar = document.createElement('button');
        botonCancelar.textContent = 'Cancelar';
        botonCancelar.onclick = cerrarFormulario;
        
        formulario.append(botonGuardar, botonCancelar);
        contenedorFormulario.innerHTML = '';
        contenedorFormulario.appendChild(formulario);
        document.body.appendChild(contenedorFormulario);
    });
};

window.guardarCita = function (id) {
    const formulario = el('appointment-form');
    if (!formulario.fecha.value) {
        notifyError('Date is a required field');
        return;
    }
    
    const citaActualizada = {
        fecha: formulario.fecha.value,
        hora: formulario.hora.value,
        mascota: formulario.mascota.value,
    };
    
    axios.put(`http://localhost:8080/citas/${id}`, citaActualizada)
        .then(() => {
            notifyOk('Appointment successfully updated');
            cerrarFormulario();
            window.location.reload();
        })
        .catch(() => notifyError('Error updating the appointment'));
};

window.cerrarFormulario = function () {
    const contenedorFormulario = el('edit-appointment-container');
    if (contenedorFormulario) {
        contenedorFormulario.remove();
    }
};