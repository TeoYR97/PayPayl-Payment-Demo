import React from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';


const paypalpayment = () => {

  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENTID,
    currency: "USD",
    intent: "capture",
  };

  const styles = {
    shape: "rect",
    layout: "vertical",
  };

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

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!data.orderId) {
        throw new Error("No orderId returned by backend");
      }

      return data.orderId;

    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  }

  const onApprove = async (data) => {
    try {

    } catch (error) {
      console.error("Error verifying paypal", error);
      window.location.href = "/cancel-payment";
    }
  }

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
  )
}

export default paypalpayment