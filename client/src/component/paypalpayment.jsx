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

      const response = await fetch("/paypal/craeteorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
      return data.orderId;

    } catch (error) {
      console.log("Error creating paypal order", error);
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
    console.log("Paypal error", error);
    window.location.href = "/cancel-payment";
  }


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