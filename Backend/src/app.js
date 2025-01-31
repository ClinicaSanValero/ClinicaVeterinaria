// Cargar librerías
const express = require('express');
const cors = require('cors');
const knex = require('knex');
const { check, validationResult } = require('express-validator');

// Lanzar aplicaciones de librerías
const app = express();
app.use(cors());
app.use(express.json());

// Lanzar la BBDD (DB Browser for SQLite)
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: 'vet.db'
    },
    useNullAsDefault: true // Devuelve valor nulo para aquello que no tenga datos 
});

//----------------------------------------------CRUD MASCOTAS----------------------------------------------
app.get('/mascotas', async (req, res) => { // Operación para ver todas las mascotas que hay en la BBDD
    const mascotas = await db('mascotas').select('*').from('mascotas');
    res.json(mascotas);
});

app.get('/mascotas/:id', async (req, res) => { // Operación para ver una mascota en concreto
    const mascota = await db('mascotas').select('*').from('mascotas').where('id', req.params.id).first();
    res.json(mascota);
});

app.post('/mascotas', [
    check('nombre').notEmpty().withMessage('The name is a mandatory field'),
    check('propietario').notEmpty().withMessage('The owner is a mandatory field') 
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        await db('mascotas').insert({
            nombre: req.body.nombre,
            edad: req.body.edad,
            especie: req.body.especie,
            propietario: req.body.propietario,
            id_propietario: req.body.id_propietario,
        });

        res.status(201).json({ success: 'Pet registered successfully' });
    } catch (error) {
        console.error('Error when adding the pet:', error);
        res.status(500).json({ error: 'Error when adding the pet', details: error.message });
    }
});

app.put('/mascotas/:id', [
    check('nombre').notEmpty().withMessage('The name is a mandatory field'),
    check('propietario').notEmpty().withMessage('The owner is a mandatory field') 
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        await db('mascotas').where('id', req.params.id).update({
            nombre: req.body.nombre,
            edad: req.body.edad,
            especie: req.body.especie,
            propietario: req.body.propietario,
        });
        res.status(200).json({ success: 'Pet updated successfully' });
    } catch (error) {
        console.error('Error when updating the pet:', error);
        res.status(500).json({ error: 'Error when updating the pet', details: error.message });
    }
});

app.delete('/mascotas/:id', async (req, res) => {  // Operación para borrar una mascota
    try {
        await db('mascotas').where('id', req.params.id).del();
        res.status(200).json({ success: 'Pet deleted successfully' });
    } catch (error) {
        console.error('Error when deleting the pet:', error);
        res.status(500).json({ error: 'Error when deleting the pet', details: error.message });
    }
});

// Operación para ver las citas de una mascota
app.get('/mascotas/:id/citas', async (req, res) => {
    const citas = await db('citas').select('*').from('citas').where('id_mascota', req.params.id);
    res.json(citas);
});

//----------------------------------------------CRUD CITAS----------------------------------------------
app.get('/citas', async (req, res) => { // Operación para ver todas las citas que hay en la BBDD
    const citas = await db('citas').select('*').from('citas');
    res.json(citas);
});

app.get('/citas/:id', async (req, res) => { // Operación para ver una cita en concreto
    const cita = await db('citas').select('*').from('citas').where('id', req.params.id).first();
    res.json(cita);
});

app.post('/citas', [
    check('hora').notEmpty().withMessage('The hour is a mandatory field'),
    check('fecha').notEmpty().withMessage('The date is a mandatory field'),
    check('id_mascota').notEmpty().withMessage('The name of the pet is a mandatory field'),
    check('id_veterinario').notEmpty().withMessage('The name of the vet is a mandatory field')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        await db('citas').insert({
            fecha: req.body.fecha,
            hora: req.body.hora,
            motivo: req.body.motivo,
            id_mascota: req.body.id_mascota,
            id_veterinario: req.body.id_veterinario,
        });

        res.status(201).json({ success: 'Appointment successfully added' });
    } catch (error) {
        console.error('Error when adding the appointment:', error);
        res.status(500).json({ error: 'Error when adding the appointment', details: error.message });
    }
});

app.put('/citas/:id', [
    check('hora').notEmpty().withMessage('The hour is a mandatory field'),
    check('id_mascota').notEmpty().withMessage('The name of the pet is a mandatory field'),
    check('id_veterinario').notEmpty().withMessage('The name of the vet is a mandatory field')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        await db('citas').where('id', req.params.id).update({
            fecha: req.body.fecha,
            hora: req.body.hora,
            motivo: req.body.motivo,
            id_mascota: req.body.id_mascota,
            id_veterinario: req.body.id_veterinario,
        });
        res.status(200).json({ success: 'Appointment updated successfully' });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Error updating appointment', details: error.message });
    }
});

app.delete('/citas/:id', async (req, res) => {  // Operación para borrar una cita
    try {
        await db('citas').where('id', req.params.id).del();
        res.status(200).json({ success: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting the appointment:', error);
        res.status(500).json({ error: 'Error deleting the appointment', details: error.message });
    }
});

//----------------------------------------------LOGIN----------------------------------------------
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await db('usuarios').select('*').from('usuarios').where('email', email).first();

    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }

    if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect Password' });
    }

    res.json({ success: 'Successful login' });
});

//----------------------------------------------Abro un servidor en puerto 8080----------------------------------------------
app.listen(8080, () => {
    console.log('Server running in http://localhost:8080');
});