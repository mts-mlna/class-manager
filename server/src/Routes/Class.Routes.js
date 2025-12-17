const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/auth.middleware')

const { CreateClass, GetClasses, DeleteClass, UpdateClass, getClassById, createAlumno } = require('../Controller/Class.Controller');

router.post('/classes/new',authMiddleware, CreateClass)
router.get('/classes', authMiddleware, GetClasses)
router.delete('/classes/:id', authMiddleware, DeleteClass)
router.put('/classes/:id', authMiddleware, UpdateClass)
router.get('/classes/:id', authMiddleware, getClassById);
router.post('/classes/:id/alumnos', authMiddleware, createAlumno)

module.exports = router;