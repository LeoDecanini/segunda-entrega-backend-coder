import Product from "../model/product-schema.js";

class ProductController {
  async getAllProducts(request, response) {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = 12;
      const skip = (page - 1) * limit;

      const products = await Product.find()
        .skip(skip)
        .limit(limit)
        .exec();

      const totalItems = await Product.countDocuments().exec();
      const meta = {
        totalItems: totalItems,
        itemCount: products.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };

      response.status(200).json({ data: products, meta: meta });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async getProduct(request, response) {
    try {
      const productId = request.params.id;
      const product = await Product.findById(productId).exec();

      if (!product) {
        return response.sendStatus(404);
      }

      response.status(200).json({ data: product });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async createProduct(request, response) {
    try {
      const newProduct = new Product(request.body);
      const savedProduct = await newProduct.save();

      response
        .status(201)
        .json({ message: "Producto creado", data: savedProduct });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async updateProduct(request, response) {
    try {
      const productId = request.params.id;
      const updatedProduct = request.body;

      const result = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true }).exec();

      if (!result) {
        return response.sendStatus(404);
      }

      response
        .status(200)
        .json({ message: "Producto actualizado", data: result });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async deleteProduct(request, response) {
    try {
      const productId = request.params.id;

      const result = await Product.findByIdAndDelete(productId).exec();

      if (!result) {
        return response.sendStatus(404);
      }

      response.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
      response.status(500).send(error);
    }
  }
}

export default new ProductController();
