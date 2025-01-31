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
app.get('/mascotas', async (req, res) => { // Oeracion para ver todas las mascotas que hay en la BBDD
    const mascotas = await db('mascotas').select('*').from('mascotas');
    res.json(mascotas);
});

app.get('/mascotas/:id', async (req, res) => { // Operacion para ver una mascota en concreto
    const mascotas = await db('mascotas').select('*').from('mascotas').where('id', req.params.id);
    res.json(mascotas);
});


app.post('/mascotas', [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('propietario').notEmpty().withMessage('El nombre del propietario es obligatorio') 
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

        res.status(201).json({ success: 'Mascota añadida exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir la mascota' });
    }
});


app.put('/mascotas/:id', [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('propietario').notEmpty().withMessage('El nombre del propietario es obligatorio') 
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
        res.status(200).json({});

    } catch (error) {
        console.error('Error al acutalizar la mascota:', error); // Log de error en la consola
        res.status(500).json({ error: 'Ocurrió un error al actualizar la mascota', details: error.message });
    }
});

app.delete('/mascotas/:id', async (req, res) => {  // Operacion para borrar una mascota
    try {
        await db('mascotas').where('id', req.params.id).del();
        res.status(200).json({});
    } catch (error) {
        console.error('Error al borrar la mascota:', error); // Log de error en la consola
        res.status(500).json({ error: 'Ocurrió un error al borrar la mascota', details: error.message });
    }
});

//Operación para ver las citas de una mascota
app.get('/mascotas/:id/citas', async (req, res) => {
    const citas = await db('citas').select('*').from('citas').where('id_mascota', req.params.id);
    res.json(citas);
});



//----------------------------------------------CRUD CITAS----------------------------------------------
app.get('/citas', async (req, res) => { // Operacion para ver todas las citas que hay en la BBDD
    const citas = await db('citas').select('*').from('citas');
    res.json(citas);
});


app.get('/citas/:id', async (req, res) => { // Operacion para ver una cita en concreto
    const citas = await db('citas').select('*').from('citas').where('id', req.params.id).first();
    res.json(citas);
});


app.post('/citas', [
    check('hora').notEmpty().withMessage('La hora es obligatoria'),
    check('id_mascota').notEmpty().withMessage('EL nombre de la mascota es obligatoria'),
    check('id_veterinario').notEmpty().withMessage('El nombre del veterinario es obligatorio')
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

        res.status(201).json({ success: 'Cita añadida exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir la cita' });
    }
});

app.put('/citas/:id', [
    check('hora').notEmpty().withMessage('La hora es obligatoria'),
    check('id_mascota').notEmpty().withMessage('EL nombre de la mascota es obligatoria'),
    check('id_veterinario').notEmpty().withMessage('El nombre del veterinario es obligatorio')
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
        res.status(200).json({});

    } catch (error) {
        console.error('Error al acutalizar la cita:', error); // Log de error en la consola
        res.status(500).json({ error: 'Ocurrió un error al actualizar la cita', details: error.message });
    }
});

app.delete('/citas/:id', async (req, res) => {  // Operacion para borrar una cita
    try {
        await db('citas').where('id', req.params.id).del();
        res.status(200).json({});
    } catch (error) {
        console.error('Error al borrar la cita:', error); // Log de error en la consola
        res.status(500).json({ error: 'Ocurrió un error al borrar la cita', details: error.message });
    }
});


//----------------------------------------------Abro un servidor en puerto 8080----------------------------------------------

app.listen(8080, () => {
    console.log('Servidor iniciado en http://localhost:8080');
});

