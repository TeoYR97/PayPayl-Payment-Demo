
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
        const accessToken = await getAccessToken();

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

        console.log("PayPal order response:", response);

        const orderId = response.id;

        if (!orderId) {
            throw new Error(
                "PayPal response does not contain an order ID"
            );
        }

        return res.status(200).json({ orderId });

    } catch (err) {
        console.error(
            "PayPal order creation failed:",
            err.message
        );

        if (err.response) {
            console.error(
                "PayPal API response:",
                err.response.body
            );
        }

        return res.status(500).json({
            error: "Failed to create PayPal order",
        });
    }
};

// Step 3: Capture an approved PayPal order
const capturePayment = async (req, res) => {
    try {
        const accessToken = await getAccessToken();

        // Get the order ID from the URL
        const { orderId } = req.params;

        // Capture the approved order
        const paymentData = await got
            .post(
                `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    json: {},
                }
            )
            .json();

        console.log("PayPal capture response:", paymentData);

        return res.status(200).json({
            success: true,
            paymentData,
        });

    } catch (err) {
        console.error(
            "PayPal capture failed:",
            err.message
        );

        if (err.response) {
            console.error(
                "PayPal API response:",
                err.response.body
            );
        }

        return res.status(500).json({
            error: "Failed to capture PayPal payment",
        });
    }
};

// Step 4: Register routes
router.post("/createorder", createorder);
router.post("/capturepayment/:orderId", capturePayment);

// Step 5: Export the router
export default router;
