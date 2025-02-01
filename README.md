# ClinicaSanValero
                Arquitectura en 3 capas: BBDD, Backend (API) + Frontend

Este es un proyecto para gestinoar una base de datos de mascotas y sus citas veterinarias.
Se compone de un frontend que se comunica con una API que gestiona la BBDD permitiendo realizar las operaciones CRUD sobre los diferentes elementos de la BBDD.

                                 BBDD --> API REST --> FRONTEND

## Tecnologías
Base de Datos: SQLite

API Backend: Node + Express + express-validator (para validar las entradas a la BBDD)

Frontend: Framework de estilos Boostrap

## Lanzar proyecto
El frontend y el backend se van a ejecutar de manera separada e independiente

> Si es la primera vez que lanzas el proyecto ejecuta en la carpeta `backend` y en la carpeta `frontend`: `npm install`

### Lanzar la API 
Ejecuta dentro del `backend`: `npm start`

### Lanzar el frontend 
Ejecuta dentro del `frontend`: `npm start`
