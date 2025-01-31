import axios from 'axios';
import { el, notifyOk, notifyError } from './documentsUtil';


const express = require('express');
const app = express();

// Cargar y mostrar mascotas
window.loadMascotas = function () {
    axios.get('http://localhost:8080/mascotas')
        .then(response => {
            const mascotas = response.data;
            const mascotaTable = el('tableBodyMascotas');
            mascotaTable.innerHTML = '';
            
            mascotas.forEach(mascota => {
                const row = document.createElement('tr');
                row.id = `mascota-${mascota.id}`;
                
                row.innerHTML = `
                    <td>${mascota.nombre}</td>
                    <td>${mascota.edad}</td>
                    <td>${mascota.raza}</td>
                    <td>${mascota.propietario_nombre}</td>
                    <td>
                        <button onclick="editMascota(${mascota.id})">Edit</button>
                        <button onclick="deleteMascota(${mascota.id})">Delete</button>
                    </td>
                `;
                mascotaTable.appendChild(row);
            });
            
            loadAppointments(); // Actualizar citas cuando se actualizan mascotas
        });
};

// Cargar y mostrar citas
window.loadAppointments = function () {
    axios.get('http://localhost:8080/citas')
        .then(response => {
            const appointments = response.data;
            const appointmentTable = el('tableBodyAppointments');
            appointmentTable.innerHTML = '';
            
            appointments.forEach(appointment => {
                const row = document.createElement('tr');
                row.id = `appointment-${appointment.id}`;
                
                row.innerHTML = `
                    <td>${appointment.mascota_nombre}</td>
                    <td>${appointment.veterinario_nombre}</td>
                    <td>${appointment.fecha}</td>
                    <td>${appointment.hora}</td>
                    <td>
                        <button onclick="editAppointment(${appointment.id})">Edit</button>
                        <button onclick="deleteAppointment(${appointment.id})">Delete</button>
                    </td>
                `;
                appointmentTable.appendChild(row);
            });
        });
};

// Eliminar una mascota y actualizar citas relacionadas
window.deleteMascota = function (id) {
    if (confirm('Are you sure you want to delete this pet?')) {
        axios.delete(`http://localhost:8080/mascotas/${id}`)
            .then(() => {
                notifyOk('Pet deleted');
                el(`mascota-${id}`).remove();
                loadAppointments(); // Actualizar citas porque están relacionadas con mascotas
            })
            .catch(error => notifyError('Error deleting pet'));
    }
};

// Eliminar una cita
window.deleteAppointment = function (id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        axios.delete(`http://localhost:8080/citas/${id}`)
            .then(() => {
                notifyOk('Appointment deleted');
                el(`appointment-${id}`).remove();
            })
            .catch(error => notifyError('Error deleting appointment'));
    }
};

// Inicializar carga de datos
window.onload = function () {
    loadMascotas();
    loadAppointments();
};
