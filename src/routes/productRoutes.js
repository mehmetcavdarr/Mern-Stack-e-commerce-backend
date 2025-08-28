import { Router } from 'express';
import { protect, requireRole } from '../middlewares/auth.js';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/productController.js';


const router = Router();


router.get('/', getProducts);
router.get('/:id', getProduct);


router.post('/', protect, requireRole('admin'), createProduct);
router.put('/:id', protect, requireRole('admin'), updateProduct);
router.delete('/:id', protect, requireRole('admin'), deleteProduct);


export default router;