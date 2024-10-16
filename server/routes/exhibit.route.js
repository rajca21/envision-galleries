import express from 'express';
import * as exhibitController from '../controllers/exhibit.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// POST Endpoints
router.post('/', verifyToken, exhibitController.createExhibit);

// GET Endpoints
router.get('/', exhibitController.getActiveExhibits);
router.get('/archive', exhibitController.getArchivedExhibits);
router.get('/:id', exhibitController.getExhibit);

// PUT Endpoints
router.put('/:id', verifyToken, exhibitController.updateExhibit);

// DELETE Endpoints
router.delete('/:id', verifyToken, exhibitController.deleteExhibit);

export default router;
