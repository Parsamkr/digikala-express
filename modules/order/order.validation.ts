import { z } from "zod";
import { OrderStatuses } from "../../common/constant/order.const";

const changeOrderStatusSchema = z.object({
  status: z.enum(Object.values(OrderStatuses) as [string, ...string[]]),
});

export { changeOrderStatusSchema };
