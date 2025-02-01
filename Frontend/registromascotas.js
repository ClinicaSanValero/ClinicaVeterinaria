import axios from 'axios';
import { notifyError, notifyOk, el } from './documentsUtil.js';

window.addPet = function () {
    const nombre = el('nombreMascota').value;
    const especie = el('especieMascota').value;
    const edad = el('edadMascota').value;
    const propietario = el('propietarioMascota').value;

    if (nombre === '') {
        notifyError('Name is a required field');
        return;
    }

    if (especie === '') {
        notifyError('Species is a required field');
        return;
    }

    if (edad === '') {
        notifyError('Age is a required field');
        return;
    }

    if (propietario === '') {
        notifyError('Owner is a required field');
        return;
    }

    axios.post('http://localhost:8080/mascotas', {
        nombre: nombre,
        especie: especie,
        edad: edad,
        propietario: propietario
    })
    .then(response => {
        notifyOk('Pet registered successfully');
        el('nombreMascota').value = '';
        el('especieMascota').value = '';
        el('edadMascota').value = '';
        el('propietarioMascota').value = '';
    })
    .catch(error => {
        notifyError('Error registering pet');
    });
};

window.resetForm = function () {
    el('nombreMascota').value = '';
    el('especieMascota').value = '';
    el('edadMascota').value = '';
    el('propietarioMascota').value = '';
    notifyOk('Form cleared');
};