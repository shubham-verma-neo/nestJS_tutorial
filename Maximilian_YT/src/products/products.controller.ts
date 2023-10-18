import {
  Post,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductService } from './products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  async addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDescription: string,
    @Body('price') prodPrice: number,
  ) {
    const generatedId = await this.productsService.insertProduct(
      prodTitle,
      prodDescription,
      prodPrice,
    );
    return { id: generatedId };
  }

  @Get()
  getAllProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  getSingleProduct(@Param('id') prodId: string) {
    return this.productsService.getSingleProduct(prodId);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDescription: string,
    @Body('price') prodPrice: number,
  ) {
    await this.productsService.updateProduct(
      prodId,
      prodTitle,
      prodDescription,
      prodPrice,
    );
  }

  @Delete(':id')
  async deleteProduct(@Param('id') prodId: string) {
    await this.productsService.deleteProduct(prodId);
  }
}
