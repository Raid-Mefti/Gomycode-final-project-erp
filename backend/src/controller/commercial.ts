import { Request, Response } from 'express';
import { PurchaseOrder } from '../models/PurchaseOrder';
import { Product } from '../models/Product';
import { Client } from '../models/Client';
import { Commercial } from '../models/Commercial';
import { z } from 'zod';
import { Logistics } from '../models/Logistics';
import { Types } from 'mongoose';

const createPurchaseOrderSchema = z.object({
  clientId: z.string(),
  products: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1)
  }))
});

export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { clientId, products } = createPurchaseOrderSchema.parse(req.body);
    const commercialId = req.user?.commercialId; // Assuming user has commercialId
    
    // Check client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Check commercial exists
    const commercial = await Commercial.findById(commercialId);
    if (!commercial) {
      return res.status(403).json({ message: 'Commercial not found' });
    }
    
    // Check products availability and calculate total
    let totalAmount = 0;
    const productDetails = [];
    
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${product.name}`,
          available: product.stock,
          requested: item.quantity
        });
      }
      
      totalAmount += product.price * item.quantity;
      productDetails.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    // Generate order number
    const orderNumber = `PO-${Date.now()}`;
    
    // Create purchase order
    const purchaseOrder = new PurchaseOrder({
      orderNumber,
      client: clientId,
      commercial: commercialId,
      products: productDetails,
      totalAmount,
      status: 'pending'
    });
    
    await purchaseOrder.save();
    
    // Send to logistics
    await sendToLogistics(purchaseOrder._id);
    
    res.status(201).json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating purchase order', error });
  }
};

async function sendToLogistics(purchaseOrderId: string | Types.ObjectId) {
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
  if (!purchaseOrder) throw new Error('Purchase order not found');
  
  // Find available logistics team
  const logistics = await Logistics.findOne({ available: true });
  if (!logistics) throw new Error('No available logistics team');
  
  purchaseOrder.logistics = logistics._id;
  purchaseOrder.status = 'processing';
  await purchaseOrder.save();
  
  // Here you would typically send a notification to logistics
}