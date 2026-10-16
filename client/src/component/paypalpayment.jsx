
import React from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";

const PaypalPayment = () => {
  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENTID,
    currency: "USD",
    intent: "capture",
  };

  const styles = {
    shape: "rect",
    layout: "vertical",
  };

  // Step 1: Create a PayPal order
  const onCreateOrder = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/paypal/createorder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Server returned ${response.status}`
        );
      }

      if (!data.orderId) {
        throw new Error("No orderId returned by backend");
      }

      return data.orderId;

    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  };

  // Step 2: Capture the order after customer approval
  const onApprove = async (data) => {
    try {
      if (!data?.orderID) {
        throw new Error("Invalid PayPal order ID");
      }

      const response = await fetch(
        `http://localhost:3000/paypal/capturepayment/${data.orderID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Backend error response:", data);
        throw new Error(
          data.error || `Server returned ${response.status}`
        );
      }

      // Check the actual PayPal capture status
      if (result.paymentData?.status !== "COMPLETED") {
        throw new Error("PayPal payment is not completed");
      }

      console.log("Payment successful:", result.paymentData);

      window.location.href = "/complete-payment";

    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      window.location.href = "/cancel-payment";
    }
  };

  // Step 3: Handle PayPal SDK errors
  const onError = (error) => {
    console.error("PayPal error:", error);
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={styles}
        createOrder={onCreateOrder}
        onApprove={onApprove}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalPayment;
