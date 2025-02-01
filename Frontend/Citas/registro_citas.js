import axios from 'axios';
import { notifyError, notifyOk, el } from './documentsUtil.js';

window.addAppointment = function () {
    const fecha = el('fechaReg').value;
    const hora = el('horaReg').value;
    const mascota = el('mascotaReg').value;

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
        el('mascotaReg').value = '';
    })
    .catch(error => {
        notifyError('Error registering appointment');
    });
};

window.resetForm = function () {
    el('fechaReg').value = '';
    el('horaReg').value = '';
    el('mascotaReg').value = '';
    notifyOk('Form cleared');
};