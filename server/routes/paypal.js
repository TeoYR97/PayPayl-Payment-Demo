
import express from "express";
import got from "got";

const router = express.Router();

// Step 1: Get an access token from PayPal
const getAccessToken = async () => {
    const response = await got
        .post(
            `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
            {
                form: {
                    grant_type: "client_credentials",
                },
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_CLIENT_SECRET,
            }
        )
        .json();

    if (!response.access_token) {
        throw new Error("PayPal did not return an access token");
    }

    return response.access_token;
};

// Step 2: Create a PayPal order
const createorder = async (req, res) => {
    try {
        // Get the PayPal access token
        const accessToken = await getAccessToken();

        // Create the order
        const response = await got
            .post(
                `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },

                    json: {
                        intent: "CAPTURE",

                        purchase_units: [
                            {
                                items: [
                                    {
                                        name: "Volatility Grid",
                                        description:
                                            "Interactive volatility dashboard for cryptocurrencies",
                                        quantity: "1",
                                        unit_amount: {
                                            currency_code: "USD",
                                            value: "10.00",
                                        },
                                    },
                                ],

                                amount: {
                                    currency_code: "USD",
                                    value: "10.00",
                                    breakdown: {
                                        item_total: {
                                            currency_code: "USD",
                                            value: "10.00",
                                        },
                                    },
                                },
                            },
                        ],

                        payment_source: {
                            paypal: {
                                experience_context: {
                                    payment_method_preference:
                                        "IMMEDIATE_PAYMENT_REQUIRED",
                                    brand_name: "My Brand",
                                    shipping_preference: "NO_SHIPPING",
                                    locale: "en-US",
                                    user_action: "PAY_NOW",
                                    return_url:
                                        `${process.env.PAYPAL_REDIRECT_URL}/complete-payment`,
                                    cancel_url:
                                        `${process.env.PAYPAL_REDIRECT_URL}/cancel-payment`,
                                },
                            },
                        },
                    },
                }
            )
            .json();

        
        console.log(response.body);
        const orderId = response.body?.id;

        return res.status(200).json({orderId});
    } catch (err) {
        res.status(500).json({error:"Internal server error"});
    }
};


router.post("/createorder", createorder);

export default router;
