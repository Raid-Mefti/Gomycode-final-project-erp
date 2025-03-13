import ProductModel from "../models/product.ts";

export async function getProducts(req, res) {
  try {
    const { search, sorting, sortingDirection } = req.query;

    const products = await ProductModel.find(
      search
        ? {
            name: new RegExp(search, ""),
          }
        : {}
    ).sort(
      sorting
        ? {
            [sorting]: sortingDirection === "asc" ? 1 : -1,
          }
        : { createdAt: 1 }
    );
    res.json({ data: products });
  } catch (e) {
    res.json({ error: e.message });
  }
}

export async function createProduct(req, res) {
  try {
    const product = await ProductModel.create(req.body);
    res.json({ data: product });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const productId = req.params.productId;
    const updateProduct = await ProductModel.findOneAndUpdate(
      { _id: productId },
      { $set: req.body },
      { new: true }
    );
    res.json({ message: "Product updated successfully", data: updateProduct });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
export async function getProduct(req, res) {
  try {
    const productId = req.params.productId;
    const product = await ProductModel.findOne({ _id: productId });
    if (!product) throw new Error("Product not found");
    res.json({ message: "Product found successfully", data: product });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
export async function deleteProduct(req, res) {
  try {
    const productId = req.params.productId;
    const deleteStatus = await ProductModel.deleteOne({ _id: productId });
    if (deleteStatus.deletedCount !== 1)
      throw new Error("Product couldn't be deleted");
    res.json({ message: `Product ${productId} has been deleted successfully` });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
