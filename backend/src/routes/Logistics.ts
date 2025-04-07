// routes/logistics.routes.ts

import { Router } from 'express';
import { 
  getPurchaseOrders,
  processPurchaseOrder,
  createRawMaterialOrder,
  updateProductionStep,
  createLogisticsTeam,
  assignToPurchaseOrder
} from '../controller/logistics';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { z } from 'zod';

const router = Router();

// Existing routes
router.get('/orders', auth, getPurchaseOrders);
router.post('/orders/:orderId/process', auth, processPurchaseOrder);
router.post('/materials/order', auth, createRawMaterialOrder);
router.put('/production/:productionOrderId/step/:stepIndex', auth, updateProductionStep);

// New team management routes
router.post('/teams', auth, validate(z.object({
  teamName: z.string(),
  managerId: z.string(),
  memberIds: z.array(z.string()),
  capacity: z.number().min(1),
  specialization: z.array(z.string()).optional()
})), createLogisticsTeam);

router.post('/assign', auth, validate(z.object({
  teamId: z.string(),
  orderId: z.string()
})), assignToPurchaseOrder);

export default router;