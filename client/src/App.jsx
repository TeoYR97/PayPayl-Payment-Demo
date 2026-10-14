import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompletePayment from "./pages/completepayment.jsx";
import CancelPayment from "./pages/cancelpayment.jsx";
import PayPalPayment from "./component/paypalpayment.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>PayPal Payment Demo</h1>

        <Routes>
          <Route path="/" element={<PayPalPayment />} />
          <Route path="/complete" element={<CompletePayment />} />
          <Route path="/cancel" element={<CancelPayment />} />
          <Route path="/paypal" element={<PayPalPayment />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
