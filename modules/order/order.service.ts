import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { OrderStatuses } from "../../common/constant/order.const";
import { Order, OrderItem } from "./order.model";
import { Product, ProductColor, ProductSize } from "../product/product.model";

async function getMyOrdersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user as { id: number };
    const { status } = req.query as { status: string };

    if (status && !Object.values(OrderStatuses).includes(status as any)) {
      throw createHttpError.BadRequest("Invalid status");
    }
    const orders = await Order.findAll({
      where: status ? { user_id: id, status } : { user_id: id },
    });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}

async function getOrderByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: user_id } = req.user as {
      id: number;
      mobile: string;
      fullname: string;
    };
    const { id } = req.params as { id: string };
    const order = await Order.findOne({
      where: { id: +id, user_id: user_id },
      include: [
        {
          model: OrderItem,
          as: "order_items",
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
        },
      ],
    });
    if (!order) {
      throw createHttpError.NotFound("Order not found");
    }
    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

async function changeOrderStatusHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: typeof OrderStatuses };
    const order = await Order.findOne({
      where: { id: +id },
    });
    if (!order) throw createHttpError.NotFound("Order not found");
    await order.update({ status: status as typeof OrderStatuses });
    return res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    next(error);
  }
}

export { getMyOrdersHandler, getOrderByIdHandler, changeOrderStatusHandler };
