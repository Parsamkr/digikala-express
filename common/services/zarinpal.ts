import axios from "axios";
import "dotenv/config";
import createHttpError from "http-errors";

async function zarinpalRequest(
  amount: number,
  user: { id: number; mobile: string; fullname: string },
  description: string
) {
  try {
    const response = await axios
      .post(
        process.env.ZARINPAL_URL ??
          "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
        {
          merchant_id:
            process.env.ZARINPAL_MERCHANT_ID ??
            "980e696a-c5a7-4102-bf44-73488593d56b",
          amount,
          callback_url:
            process.env.ZARINPAL_CALLBACK_URL ??
            "http://localhost:2500/payment/callback",
          metadata: {
            user_id: user.id,
            user_mobile: user.mobile ?? "09123456789",
            user_fullname: user.fullname ?? "test user",
          },
          description: description ?? "test description",
          currency: "IRT",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
    if (response.data.authority) {
      return response.data.authority;
    }
    throw new Error(response.data.message);
  } catch (error) {
    throw error;
  }
}
async function zarinpalVerify(authority: string, amount: number) {
  try {
    const response = await axios
      .post(
        process.env.ZARINPAL_VERIFY_URL ??
          "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
        {
          merchant_id:
            process.env.ZARINPAL_MERCHANT_ID ??
            "980e696a-c5a7-4102-bf44-73488593d56b",
          authority: authority,
          amount: amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw new Error(
          err.response.data.message || "Payment verification failed"
        );
      });
    if (response.data.code === 100) {
      return response.data;
    } else if (response.data.code === 101) {
      throw createHttpError.NotFound("payment already verified");
    }
    throw createHttpError.BadRequest(
      response.data.message || "Payment verification failed"
    );
  } catch (error) {
    throw error;
  }
}

export { zarinpalRequest, zarinpalVerify };
