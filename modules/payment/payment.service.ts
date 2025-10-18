import type { NextFunction, Request, Response } from "express";
import { getUserBasketById } from "../basket/basket.service";
import Payment from "./payment.model";
import { PaymentStatuses } from "../../common/constant/payment.const";
import { OrderStatuses } from "../../common/constant/order.const";
import { Order, OrderItem } from "../order/order.model";
import {
  zarinpalRequest,
  zarinpalVerify,
} from "../../common/services/zarinpal";
import createHttpError from "http-errors";
import Basket from "../basket/basket.model";

async function paymentBasketHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user as {
      id: number;
      mobile: string;
      fullname: string;
    };
    const { totalAmount, finalAmount, items, totalDiscount } =
      await getUserBasketById(id);

    const payment = await Payment.create({
      user_id: id,
      amount: finalAmount,
      status: PaymentStatuses.Pending,
    });

    const order = await Order.create({
      user_id: id,
      total_amount: totalAmount,
      final_amount: finalAmount,
      discount_amount: totalDiscount,
      status: OrderStatuses.Pending,
      address: "Sari, Saadi",
    });

    await payment.update({
      order_id: order.get("id"),
    });
    let orderList = [];

    for (const item of items) {
      let items = [];
      if (item.sizes && item.sizes.length > 0) {
        for (const size of item.sizes) {
          items.push({
            order_id: order.get("id"),
            product_id: item.id,
            size_id: size.id,
            count: size.count,
          });
        }
      }
      if (item.colors && item.colors.length > 0) {
        for (const color of item.colors) {
          items.push({
            order_id: order.get("id"),
            product_id: item.id,
            color_id: color.id,
            count: color.count,
          });
        }
      } else {
        items.push({
          order_id: order.get("id"),
          product_id: item.id,
          count: item.count,
        });
      }
      orderList.push(...items);

      await OrderItem.bulkCreate(orderList);
    }

    const authority = await zarinpalRequest(
      Math.round(payment.get("amount") as number),
      req.user as { id: number; mobile: string; fullname: string },
      "Payment for order " + order.get("id")
    );

    // Save authority for verification later
    await payment.update({
      authority: authority,
    });

    return res.status(201).json({
      url:
        (process.env.ZARINPAL_START_PAY_URL ??
          "https://sandbox.zarinpal.com/pg/StartPay/") + authority,
    });
  } catch (error) {
    next(error);
  }
}

async function paymentCallbackHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { Authority, Status } = req.query;

    const payment = await Payment.findOne({
      where: { authority: Authority as string },
    });
    if (!payment) {
      throw createHttpError.NotFound("Payment not found");
    }

    if (Status !== "OK") {
      await payment.update({ status: PaymentStatuses.Failed });
      await Order.destroy({ where: { id: payment.get("order_id") as number } });
      throw createHttpError.BadRequest("Payment failed");
    }

    // Verify payment with Zarinpal (amount should match the original payment amount)
    const verifyResponse = await zarinpalVerify(
      Authority as string,
      Math.round(payment.get("amount") as number)
    );

    await payment.update({
      status: PaymentStatuses.Paid,
      ref_id: verifyResponse.ref_id, // Store the reference ID from Zarinpal
    });

    const order = await Order.findOne({
      where: { id: payment.get("order_id") as number },
    });
    if (!order) {
      throw createHttpError.NotFound("Order not found");
    }
    await order.update({
      status: OrderStatuses.Ordered,
    });
    await Basket.destroy({
      where: { user_id: payment.get("user_id") as number },
    });
    return res.status(200).json({
      message: "Payment successful",
      ref_id: verifyResponse.ref_id,
    });
  } catch (error) {
    next(error);
  }
}

export { paymentBasketHandler, paymentCallbackHandler };
