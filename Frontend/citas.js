import axios from 'axios';
import { el, icon, notifyOk, notifyError } from './documentsUtil.js';

window.leerCitas = function () {
    axios.get('http://localhost:8080/citas')
        .then((response) => {
            const listaCitas = response.data;
            const tablaCitas = el('tableBody');
            tablaCitas.innerHTML = ''; // Limpiar tabla antes de agregar filas nuevas

            listaCitas.forEach(cita => {
                const fila = document.createElement('tr');
                fila.id = 'cita-' + cita.id;
                
                const celdaFecha = document.createElement('td');
                celdaFecha.textContent = cita.fecha;
                
                const celdaHora = document.createElement('td');
                celdaHora.textContent = cita.hora;
                
                const celdaMascota = document.createElement('td');
                celdaMascota.textContent = cita.mascota;
                
                const botonEditar = document.createElement('button');
                botonEditar.textContent = 'Editar';
                botonEditar.onclick = () => actualizarFormularioCita(cita.id);
                
                const botonEliminar = document.createElement('button');
                botonEliminar.textContent = 'Eliminar';
                botonEliminar.onclick = () => eliminarCita(cita.id);
                
                const celdaAcciones = document.createElement('td');
                celdaAcciones.appendChild(botonEditar);
                celdaAcciones.appendChild(botonEliminar);
                
                fila.append(celdaFecha, celdaHora, celdaMascota, celdaAcciones);
                tablaCitas.appendChild(fila);
            });
        })
        .catch(() => notifyError('Error loading appointments'));
};

window.eliminarCita = function (id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        axios.delete(`http://localhost:8080/citas/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    notifyOk('Appointment successfully deleted');
                    el('cita-' + id).remove();
                }
            })
            .catch(() => notifyError('Error deleting the appointment'));
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