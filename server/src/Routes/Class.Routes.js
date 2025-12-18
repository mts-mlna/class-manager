const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/auth.middleware')

const { CreateClass, GetClasses, DeleteClass, UpdateClass, getClassById, createAlumno, getAlumnosByClase, updateAlumno, deleteAlumnos, createAsistenciaClase } = require('../Controller/Class.Controller');

router.post('/classes/new',authMiddleware, CreateClass)
router.get('/classes', authMiddleware, GetClasses)
router.delete('/classes/:id', authMiddleware, DeleteClass)
router.put('/classes/:id', authMiddleware, UpdateClass)
router.get('/classes/:id', authMiddleware, getClassById);
router.post('/classes/:id/alumnos', authMiddleware, createAlumno)
router.get('/classes/:id/alumnos', authMiddleware, getAlumnosByClase)
router.put('/alumnos/:id', authMiddleware, updateAlumno)
router.delete('/alumnos', authMiddleware, deleteAlumnos)
router.post('/classes/:id/asistencias', authMiddleware, createAsistenciaClase)

module.exports = router;