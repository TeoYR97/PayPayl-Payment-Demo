import React from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const paypalpayment = () => {

    const initialOptions = {
        "client-id": "YOUR_CLIENT_ID",
    };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
       style={styles}
       createOrder={onCreateOrder}
       onApprove={onApprove}
       onError={onError}
       fundingSource="paypal"
       />
         
    </PayPalScriptProvider>
  )
}

export default paypalpayment