import axios from 'axios'; // Axios es la librería que permite la comunicación con el backend
import { notifyError, notifyOk, el } from './documentsUtil.js';

window.addAppointment = function () { // Acción al hacer clic en el botón para registrar una nueva cita
    const fecha = el('fechaReg').value;
    const hora = el('horaReg').value;
    const mascota = el('mascotaReg').value;

    // Validación de los datos ingresados
    if (fecha === '') {
        notifyError('Date is a required field');
        return; // Detener ejecución si la fecha está vacía
    }

    axios.post('http://localhost:8080/citas', {
        fecha: fecha,
        hora: hora,
        mascota: mascota
    });

    // Notificar al usuario que la cita ha sido registrada
    notifyOk('Appointment registered');

    // Limpiar el formulario después de registrar la cita
    el('fechaReg').value = '';
    el('horaReg').value = '';
    el('mascotaReg').value = '';
};

// Limpiar formulario después de presionar el botón de limpiar
window.resetForm = function () {
    el('fechaReg').value = '';
    el('horaReg').value = '';
    el('mascotaReg').value = '';
    notifyOk('Form cleared');
};
