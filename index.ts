import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import "dotenv/config";

async function main() {
  const app = express();
  await import("./config/sequelize.config");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Not Found" });
  });
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
