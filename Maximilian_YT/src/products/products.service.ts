import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Product } from './products.model';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  products: Product[] = [];

  constructor(
    @InjectModel('product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, description: string, price: number) {
    const newProduct = new this.productModel({ title, description, price });
    const result = await newProduct.save();
    return result.id as string;
  }

  async getProducts() {
    const products = await this.productModel.find().exec();
    return products.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async updateProduct(
    productId: string,
    updatedTitle: string,
    updatedDescription: string,
    updatedPrice: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (updatedTitle) {
      updatedProduct.title = updatedTitle;
    }
    if (updatedDescription) {
      updatedProduct.description = updatedDescription;
    }
    if (updatedPrice) {
      updatedProduct.price = updatedPrice;
    }
    updatedProduct.save();

    return null;
  }

  async deleteProduct(prodId: string) {
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find product.');
    }
  }

  private async findProduct(productId: string) {
    let product: Product;
    try {
      product = await this.productModel.findById(productId);
    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}
