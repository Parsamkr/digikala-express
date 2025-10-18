import type { NextFunction, Request, Response } from "express";
import Basket from "./basket.model";
import { Product, ProductSize, ProductColor } from "../product/product.model";
import createHttpError from "http-errors";

import { ProductTypes } from "../../common/constant/product.const";

async function addToBasketHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user as { id: number };
    const { product_id, size_id, color_id, count } = req.body;
    const product: any = await Product.findByPk(product_id, {
      include: [
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

    const BasketItem = {
      user_id: id,
      product_id,
    } as any;
    let actualCount = undefined;
    if (!product) {
      throw createHttpError.NotFound("Product not found");
    }
    if (product.get("type") === ProductTypes.Coloring) {
      const color = product.colors.find((color: any) => color.id === color_id);
      if (!color) {
        throw createHttpError.NotFound("Color not found");
      }
      const productCount = color.get("count");
      if (productCount === 0) {
        throw createHttpError.BadRequest(
          "product with this color is not available"
        );
      }
      if (count > productCount) {
        throw createHttpError.BadRequest(
          "only " + productCount + " products are available with this color"
        );
      }
      BasketItem["color_id"] = color.id;
      actualCount = productCount;
    } else if (product.get("type") === ProductTypes.Sizing) {
      const size = product.sizes.find((size: any) => size.id === size_id);
      if (!size) {
        throw createHttpError.NotFound("Size not found");
      }
      const productCount = size.get("count");
      if (productCount === 0) {
        throw createHttpError.BadRequest(
          "product with this size is not available"
        );
      }
      if (count > productCount) {
        throw createHttpError.BadRequest(
          "only " + productCount + " products are available with this size"
        );
      }
      BasketItem["size_id"] = size.id;
      actualCount = productCount;
    } else {
      let productCount = product.get("count");
      if (productCount === 0) {
        throw createHttpError.BadRequest("product is not available");
      }
      if (count > productCount) {
        throw createHttpError.BadRequest(
          "only " + productCount + " products are available"
        );
      }
      actualCount = productCount;
    }

    const basket = await Basket.findOne({ where: BasketItem });
    if (!basket) {
      await Basket.create({ ...BasketItem, count });
    } else {
      const basketCount = basket.get("count") as number;
      if (basketCount + count > actualCount) {
        throw createHttpError.BadRequest(
          "you have " +
            basketCount +
            " products in your basket and only " +
            (actualCount - basketCount) +
            " more products are available"
        );
      }
      await basket.increment("count", { by: count });
    }
    res.status(201).json({
      message: "Product added to basket",
    });
  } catch (error) {
    next(error);
  }
}

async function getUserBasketHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user as { id: number };

    const basket = await getUserBasketById(id);

    return res.status(200).json(basket);
  } catch (error) {
    next(error);
  }
}

async function getUserBasketById(user_id: number) {
  try {
    const basket = await Basket.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          as: "product",
        },
        {
          model: ProductColor,
          as: "color",
        },
        {
          model: ProductSize,
          as: "size",
        },
      ],
    });

    if (!basket || basket.length === 0) {
      throw createHttpError.BadRequest("No items in basket");
    }

    let totalAmount = 0;
    let totalDiscount = 0;
    let finalAmount = 0;
    let finalBasket: any[] = [];

    for (const item of basket) {
      const product = item.get("product") as any;
      const color = item.get("color") as any;
      const size = item.get("size") as any;
      const count = item.get("count") as number;

      const productIndex = finalBasket.findIndex(
        (product) => product.id === item.get("product_id")
      );

      let productData = finalBasket[productIndex] as any;

      if (!productData) {
        productData = {
          id: product.get("id"),
          title: product.get("title"),
          price: product.get("price"),
          type: product.get("type"),
          count,
          sizes: [] as any[],
          colors: [] as any[],
          finalAmount: 0,
          discountAmount: 0,
        };
      } else {
        productData.count += count;
      }

      let productAmount = 0;
      let productDiscount = 0;
      let productFinalAmount = 0;

      if (product.get("type") === ProductTypes.Coloring && color) {
        productAmount = (color.get("price") as number) * count;
        productDiscount = color.get("discount") as number;
        productFinalAmount = productAmount * (1 - productDiscount / 100);
        productData.colors.push({
          id: color.get("id"),
          color_name: color.get("color_name"),
          color_code: color.get("color_code"),
          count,
          price: productAmount,
          discount: productDiscount,
          finalAmount: productFinalAmount,
        });
        productData.finalAmount += productFinalAmount;
        productData.discountAmount += productAmount - productFinalAmount;
      } else if (product.get("type") === ProductTypes.Sizing && size) {
        productAmount = (size.get("price") as number) * count;
        productDiscount = size.get("discount") as number;
        productFinalAmount = productAmount * (1 - productDiscount / 100);
        productData.sizes.push({
          id: size.get("id"),
          size: size.get("size"),
          count,
          price: productAmount,
          discount: productDiscount,
          finalAmount: productFinalAmount,
        });
        productData.finalAmount += productFinalAmount;
        productData.discountAmount += productAmount - productFinalAmount;
      } else {
        productAmount = (product.get("price") as number) * count;
        productDiscount = product.get("discount") as number;
        productFinalAmount = productAmount * (1 - productDiscount / 100);
        productData.finalAmount = productFinalAmount;
        productData.discountAmount = productAmount - productFinalAmount;
      }

      totalAmount += productAmount;
      totalDiscount += productAmount - productFinalAmount;
      finalAmount += productFinalAmount;
      if (productIndex === -1) {
        finalBasket.push(productData);
      }
    }
    return {
      items: finalBasket,
      totalAmount,
      totalDiscount,
      finalAmount,
    };
  } catch (error) {
    throw error;
  }
}
export { addToBasketHandler, getUserBasketHandler, getUserBasketById };
