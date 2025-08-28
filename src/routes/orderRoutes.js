import { Router } from 'express';
import { protect, requireRole } from '../middlewares/auth.js';
import { createOrder, getMyOrders, getOrderById, markPaid } from '../controllers/orderController.js';


const router = Router();


router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, markPaid);


// admin endpoints (future): list all, update status, etc.
// router.get('/', protect, requireRole('admin'), listOrders)


export default router;