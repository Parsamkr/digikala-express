import type { NextFunction, Request, Response } from "express";

import {
  Product,
  ProductColor,
  ProductDetail,
  ProductSize,
} from "./product.model";

async function createProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      title,
      price,
      discount,
      active_discount,
      type,
      count,
      description,
      colors,
      sizes,
      details,
    } = req.body;

    const newProduct = await Product.create({
      title,
      price,
      discount,
      active_discount,
      type,
      count,
      description,
    });

    if (details && Array.isArray(details)) {
      let detailList = [];
      for (const detail of details) {
        detailList.push({
          ket: detail.key,
          value: detail.value,
          product_id: newProduct.get("id"),
        });
      }
      if (detailList.length > 0) {
        await ProductDetail.bulkCreate(detailList);
      }
    }

    if (colors && Array.isArray(colors)) {
      let colorList = [];
      for (const color of colors) {
        colorList.push({
          color_name: color.color_name,
          color_code: color.color_code,
          count: color.count,
          price: color.price,
          discount: color.discount,
          active_discount: color.active_discount,
          product_id: newProduct.get("id"),
        });
      }
      if (colorList.length > 0) {
        await ProductColor.bulkCreate(colorList);
      }
    }
    if (sizes && Array.isArray(sizes)) {
      let sizeList = [];
      for (const size of sizes) {
        sizeList.push({
          size: size.size,
          count: size.count,
          price: size.price,
          discount: size.discount,
          active_discount: size.active_discount,
          product_id: newProduct.get("id"),
        });
      }
      if (sizeList.length > 0) {
        await ProductSize.bulkCreate(sizeList);
      }
    }

    const product = await Product.findByPk(newProduct.get("id"), {
      include: [
        {
          model: ProductDetail,
          as: "details",
        },
        {
          model: ProductColor,
          as: "colors",
        },
        {
          model: ProductSize,
          as: "sizes",
        },
      ],
    });

    return res
      .status(201)
      .json({ message: "Product created successfully", data: product });
  } catch (error) {
    next(error);
  }
}

async function getProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await Product.findAll({});
    return res
      .status(200)
      .json({ message: "Products fetched successfully", data: product });
  } catch (error) {
    next(error);
  }
}

async function getProductByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        {
          model: ProductDetail,
          as: "details",
        },
        {
          model: ProductColor,
          as: "colors",
        },
        {
          model: ProductSize,
          as: "sizes",
        },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res
      .status(200)
      .json({ message: "Product fetched successfully", data: product });
  } catch (error) {
    next(error);
  }
}

async function deleteProductByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await ProductDetail.destroy({ where: { product_id: id } });
    await ProductColor.destroy({ where: { product_id: id } });
    await ProductSize.destroy({ where: { product_id: id } });
    await product.destroy();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  deleteProductByIdHandler,
};
