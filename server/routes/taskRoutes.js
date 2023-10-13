import express from 'express';
import { getAllTasks, createTask, deleteTask, updateTask } from '../controllers/taskController.js'
import requireAuth from '../middleware/requireAuth.js';

const router=express.Router();
//require Auth for all routes
router.use(requireAuth);
router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;