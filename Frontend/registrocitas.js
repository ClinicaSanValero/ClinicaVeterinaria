import axios from 'axios';
import { notifyError, notifyOk, el } from './documentsUtil.js';

window.addAppointment = function () {
    const fecha = el('fechaCita').value;
    const hora = el('hora').value;
    const mascota = el('mascotaCita').value;

    if (fecha === '') {
        notifyError('Date is a required field');
        return;
    }

    axios.post('http://localhost:8080/citas', {
        fecha: fecha,
        hora: hora,
        mascota: mascota
    })
    .then(response => {
        notifyOk('Appointment registered');
        el('fechaReg').value = '';
        el('horaReg').value = '';
        el('mascotaCita').value = '';
    })
    .catch(error => {
        notifyError('Error registering appointment');
    });
};

window.resetForm = function () {
    el('fechaCita').value = '';
    el('hora').value = '';
    el('veterinario').value = '';
    notifyOk('Form cleared');
};