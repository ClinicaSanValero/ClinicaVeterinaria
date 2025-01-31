import axios from 'axios'; // Axios es la librería que permite la comunicación con el backend
import { notifyError, notifyOk, el } from './documentsUtil.js';

window.addPet = function () { // Acción al hacer clic en el botón para registrar una nueva mascota
    const nombre = el('nombreMascota').value;  // Campo para el nombre de la mascota
    const especie = el('especieMascota').value; // Campo para la especie de la mascota (perro, gato, etc.)
    const edad = el('edadMascota').value; // Campo para la edad de la mascota
    const propietario = el('propietarioMascota').value; // Campo para el nombre del propietario de la mascota

    // Validación de los datos ingresados
    if (nombre === '') {
        notifyError('Name is a required field');
        return; // Detener ejecución si el nombre está vacío
    }

    if (especie === '') {
        notifyError('Species is a required field');
        return; // Detener ejecución si la especie está vacía
    }

    if (edad === '') {
        notifyError('Age is a required field');
        return; // Detener ejecución si la edad está vacía
    }

    if (propietario === '') {
        notifyError('Owner is a required field');
        return; // Detener ejecución si el propietario está vacío
    }

    // Enviar los datos de la mascota al backend (suponiendo que la API para registrar mascotas está en esta URL)
    axios.post('http://localhost:8080/mascotas', {
        nombre: nombre,
        especie: especie,
        edad: edad,
        propietario: propietario
    })
    .then(response => {
        // Notificar al usuario que la mascota ha sido registrada correctamente
        notifyOk('Pet registered successfully');
    })
    .catch(error => {
        // Si ocurre un error al registrar la mascota
        notifyError('Error registering pet');
    });

    // Limpiar el formulario después de registrar la mascota
    el('nombreMascota').value = '';
    el('especieMascota').value = '';
    el('edadMascota').value = '';
    el('propietarioMascota').value = '';
};

// Limpiar formulario después de presionar el botón de limpiar
window.resetForm = function () {
    el('nombreMascota').value = '';
    el('especieMascota').value = '';
    el('edadMascota').value = '';
    el('propietarioMascota').value = '';
    notifyOk('Form cleared');
};
