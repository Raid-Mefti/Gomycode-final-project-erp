// controllers/logistic/logistics.controller.ts
import { Request, Response } from 'express';
import { 
  PurchaseOrder,
  PurchaseOrderStatus 
} from '../models/PurchaseOrder';
import { ProductionOrder, ProductionStatus } from '../models/ProductionOrder';
import { Product } from '../models/Product';
import { ProductionStep } from '../models/ProductionSteps';
import { RawMaterial } from '../models/RawMaterials';
import { Logistics } from '../models/Logistics';
import { Employee } from '../models/Employee';
import { Billing, BillingType, BillingStatus } from '../models/Billing';
import { Client } from '../../models/Client';
import { Commercial } from '../models/Commercial';
import { z } from 'zod';

// Get all purchase orders assigned to logistics
export const getPurchaseOrders = async (req: Request, res: Response) => {
  try {
    const orders = await PurchaseOrder.find({ logistics: req.user?.logisticsId })
      .populate('client')
      .populate('commercial')
      .populate('products.product')
      .populate('logistics');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase orders', error });
  }
};

// Process a purchase order and create production orders
export const processPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    const order = await PurchaseOrder.findById(orderId)
      .populate('products.product')
      .populate('logistics');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify logistics team assignment
    if (!order.logistics || order.logistics._id.toString() !== req.user?.logisticsId) {
      return res.status(403).json({ message: 'Not authorized to process this order' });
    }

    // Check order status
    if (order.status !== PurchaseOrderStatus.PENDING) {
      return res.status(400).json({ 
        message: `Order already ${order.status}` 
      });
    }

    // Check raw materials availability
    const missingMaterials = await checkMaterialsAvailability(order);
    if (missingMaterials.length > 0) {
      return res.status(400).json({
        message: 'Insufficient raw materials',
        missingMaterials
      });
    }
    
    // Create production orders for each product
    const productionOrders = [];
    for (const item of order.products) {
      const product = item.product;
      const steps = await ProductionStep.find({ outputProduct: product._id })
        .populate('machine')
        .populate('requiredMaterials.material');
      
      if (!steps || steps.length === 0) {
        return res.status(400).json({
          message: `No production steps defined for product ${product.name}`
        });
      }
      
      const productionOrder = new ProductionOrder({
        purchaseOrder: order._id,
        product: product._id,
        quantity: item.quantity,
        steps: steps.map(step => ({
          step: step._id,
          status: ProductionStatus.PLANNED
        })),
        status: ProductionStatus.PLANNED,
        assignedTeam: order.logistics
      });
      
      await productionOrder.save();
      productionOrders.push(productionOrder);

      // Reserve the product quantity
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Update order status
    order.status = PurchaseOrderStatus.PROCESSING;
    await order.save();

    // Create initial billing record (30% deposit)
    const billing = new Billing({
      type: BillingType.ORDER_PROCESSING,
      amount: order.totalAmount * 0.3,
      reference: `DEPOSIT-${order.orderNumber}`,
      status: BillingStatus.PENDING,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      purchaseOrder: order._id,
      client: order.client
    });
    await billing.save();
    
    res.json({ 
      message: 'Production orders created successfully',
      productionOrders,
      billing
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing order', error });
  }
};

// Helper function to check material availability
async function checkMaterialsAvailability(order: IPurchaseOrder & { products: any[] }) {
  const missingMaterials = [];
  
  for (const item of order.products) {
    const product = item.product;
    const steps = await ProductionStep.find({ outputProduct: product._id })
      .populate('requiredMaterials.material');
    
    for (const step of steps) {
      for (const materialReq of step.requiredMaterials) {
        const material = await RawMaterial.findById(materialReq.material._id);
        const requiredQuantity = materialReq.quantity * item.quantity;
        
        if (!material || material.quantity < requiredQuantity) {
          missingMaterials.push({
            material: materialReq.material.name,
            required: requiredQuantity,
            available: material?.quantity || 0,
            product: product.name
          });
        }
      }
    }
  }
  
  return missingMaterials;
}

// Create raw material order
export const createRawMaterialOrder = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      materialId: z.string(),
      quantity: z.number().min(1),
      supplier: z.string().min(1),
      costPerUnit: z.number().min(0),
      expectedDelivery: z.string().datetime(),
      dueDays: z.number().min(1).default(30)
    });

    const { materialId, quantity, supplier, costPerUnit, expectedDelivery, dueDays } = schema.parse(req.body);
    
    const material = await RawMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Update material with order details
    material.supplier = supplier;
    material.costPerUnit = costPerUnit;
    material.arrivalDate = new Date(expectedDelivery);
    await material.save();
    
    // Create billing record
    const billing = new Billing({
      type: BillingType.MATERIAL_ORDER,
      amount: quantity * costPerUnit,
      reference: `MAT-${material.name}-${Date.now().toString().slice(-6)}`,
      status: BillingStatus.PENDING,
      dueDate: new Date(Date.now() + dueDays * 24 * 60 * 60 * 1000)
    });
    await billing.save();
    
    res.json({ 
      message: 'Material order created successfully',
      material,
      billing
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating material order', error });
  }
};

// Update production step status
export const updateProductionStep = async (req: Request, res: Response) => {
  try {
    const { productionOrderId, stepIndex } = req.params;
    const schema = z.object({
      status: z.nativeEnum(ProductionStatus),
      operatorId: z.string().optional(),
      notes: z.string().optional()
    });
    
    const { status, operatorId, notes } = schema.parse(req.body);
    
    const productionOrder = await ProductionOrder.findById(productionOrderId)
      .populate('purchaseOrder')
      .populate('product')
      .populate('steps.step');
    
    if (!productionOrder) {
      return res.status(404).json({ message: 'Production order not found' });
    }

    // Verify logistics team assignment
    if (productionOrder.assignedTeam.toString() !== req.user?.logisticsId) {
      return res.status(403).json({ message: 'Not authorized to update this production order' });
    }
    
    const stepIdx = parseInt(stepIndex);
    if (stepIdx >= productionOrder.steps.length || stepIdx < 0) {
      return res.status(400).json({ message: 'Invalid step index' });
    }
    
    const step = productionOrder.steps[stepIdx];
    step.status = status;
    
    // Set timestamps based on status
    if (status === ProductionStatus.IN_PROGRESS && !step.startDate) {
      step.startDate = new Date();
      
      if (stepIdx === 0 && !productionOrder.startDate) {
        productionOrder.startDate = new Date();
      }
    }
    
    if (status === ProductionStatus.COMPLETED && !step.endDate) {
      step.endDate = new Date();
    }
    
    if (operatorId) {
      const operator = await Employee.findOne({
        _id: operatorId,
        logisticsTeam: req.user?.logisticsId
      });
      
      if (!operator) {
        return res.status(400).json({ message: 'Invalid operator' });
      }
      
      step.operator = operatorId;
    }

    if (notes) {
      step.notes = notes;
    }
    
    // Update production order status
    if (status === ProductionStatus.COMPLETED && stepIdx === productionOrder.steps.length - 1) {
      productionOrder.status = ProductionStatus.COMPLETED;
      productionOrder.completionDate = new Date();
      
      // Update product stock
      const product = await Product.findById(productionOrder.product);
      if (product) {
        product.stock += productionOrder.quantity;
        await product.save();
      }

      // Check if all production orders are complete
      const incompleteOrders = await ProductionOrder.countDocuments({
        purchaseOrder: productionOrder.purchaseOrder,
        status: { $ne: ProductionStatus.COMPLETED }
      });
      
      if (incompleteOrders === 0) {
        await PurchaseOrder.findByIdAndUpdate(
          productionOrder.purchaseOrder,
          { status: PurchaseOrderStatus.READY_FOR_SHIPPING }
        );
      }
    }
    
    // Move to next step if completing current step
    if (status === ProductionStatus.COMPLETED && stepIdx < productionOrder.steps.length - 1) {
      productionOrder.currentStep = stepIdx +