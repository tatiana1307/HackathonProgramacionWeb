import { Router } from 'express';
import { 
  getConcepts, 
  getConceptById, 
  createConcept, 
  updateConcept, 
  deleteConcept,
  searchConcepts,
  getConceptsByCategory
} from '../controllers/conceptController';
import { authMiddleware } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();

// Validaciones para crear/actualizar conceptos
const conceptValidation = [
  body('titulo')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('El título debe tener entre 5 y 100 caracteres'),
  body('descripcion')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  body('categoria')
    .trim()
    .notEmpty()
    .withMessage('La categoría es requerida'),
  body('contenido')
    .trim()
    .isLength({ min: 50 })
    .withMessage('El contenido debe tener al menos 50 caracteres'),
  body('nivel')
    .isIn(['básico', 'intermedio', 'avanzado'])
    .withMessage('El nivel debe ser: básico, intermedio o avanzado')
];

// Rutas públicas
router.get('/', getConcepts);
router.get('/search', searchConcepts);
router.get('/category/:category', getConceptsByCategory);
router.get('/:id', getConceptById);

// Rutas protegidas
router.use(authMiddleware);
router.post('/', conceptValidation, createConcept);
router.put('/:id', conceptValidation, updateConcept);
router.delete('/:id', deleteConcept);

export default router;
