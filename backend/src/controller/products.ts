import { Request, Response } from "express";
import productModel from "../models/product";

export async function getProducts(req: Request, res: Response) {
  try {
    const { search, sorting, sortingDirection } = req.query as {
      search?: string;
      sorting?: string;
      sortingDirection?: "asc" | "desc";
    };

    const products = await productModel
      .find(search ? { name: new RegExp(search, "i") } : {})
      .sort(
        sorting
          ? { [sorting]: sortingDirection === "asc" ? 1 : -1 }
          : { createdAt: 1 },
      );

    res.json({ data: products });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const product = await productModel.create(req.body);
    res.json({ data: product });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const productId = req.params.productId;
    const updateProduct = await productModel.findOneAndUpdate(
      { _id: productId },
      { $set: req.body },
      { new: true },
    );
    res.json({ message: "Product updated successfully", data: updateProduct });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const productId = req.params.productId;
    const product = await productModel.findOne({ _id: productId });
    if (!product) throw new Error("Product not found");
    res.json({ message: "Product found successfully", data: product });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const productId = req.params.productId;
    const deleteStatus = await productModel.deleteOne({ _id: productId });
    if (deleteStatus.deletedCount !== 1)
      throw new Error("Product couldn't be deleted");
    res.json({ message: `Product ${productId} has been deleted successfully` });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}
