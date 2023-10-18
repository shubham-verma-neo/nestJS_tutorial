import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './products.model';

@Injectable()
export class ProductService {
  products: Product[] = [];

  insertProduct(title: string, description: string, price: number) {
    const prodId = Math.random().toString();
    const newProduct = new Product(prodId, title, description, price);
    this.products.push(newProduct);
    return prodId;
  }

  getProducts() {
    return [...this.products];
  }

  getSingleProduct(productId: string) {
    const product = this.findProduct(productId)[0];
    return { ...product };
  }

  updateProduct(
    productId: string,
    updatedTitle: string,
    updatedDescription: string,
    updatedPrice: number,
  ) {
    const [product, productIndex] = this.findProduct(productId);
    const updatedProduct = { ...product };
    if (updatedTitle) {
      updatedProduct.title = updatedTitle;
    }
    if (updatedDescription) {
      updatedProduct.description = updatedDescription;
    }
    if (updatedPrice) {
      updatedProduct.price = updatedPrice;
    }
    this.products[productIndex] = updatedProduct;

    return null;
  }

  deleteProduct(prodId: string) {
    const productIndex = this.findProduct(prodId)[1];
    this.products.splice(productIndex, 1);
    return null;
  }

  private findProduct(productId: string): [Product, number] {
    const productIndex = this.products.findIndex(
      (prod) => prod.id === productId,
    );
    const product = this.products[productIndex];
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return [product, productIndex];
  }
}
