import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import "dotenv/config";

import initDatabase from "./config/models.initial";
import { productRouter } from "./modules/product/product.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { basketRouter } from "./modules/basket/basket.routes";
import { paymentRouter } from "./modules/payment/payment.routes";
import { orderRouter } from "./modules/order/order.routes";

async function main() {
  const app = express();
  await initDatabase();

  // Middleware
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // routes
  app.use("/product", productRouter);
  app.use("/auth", authRouter);
  app.use("/basket", basketRouter);
  app.use("/payment", paymentRouter);
  app.use("/order", orderRouter);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Not Found" });
  });
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Handle validation errors

    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.issues.map((issue: any) => ({
          code: issue.code,
          values: issue.options || undefined,
          path: issue.path,
          message: issue.message,
        })),
      });
    }

    // Handle HTTP errors
    if (err.status || err.statusCode) {
      const statusCode = err.status || err.statusCode;
      return res.status(statusCode).json({
        message: err.message || "Bad Request",
      });
    }

    // Handle other errors
    const statusCode = res.statusCode ?? 500;
    const message = err.message ?? "Internal Server Error";
    res.status(statusCode).json({ message });
  });
  app.listen(process.env.PORT ?? 2500, () => {
    console.log(
      `Server is running on: http://localhost:${process.env.PORT ?? 2500}`
    );
  });
}

main();
