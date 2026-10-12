import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import completepayment from './pages/completepayment';
import cancelpayment from './pages/cancelpayment';
import paypalpayment from './components/paypalpayment';

function App() {

  return (
    <Router>
      <div className="App">
        <h1>PayPal Payment Demo</h1>
        <Routes>
          <Route path="/complete" element={<completepayment />} />
          <Route path="/cancel" element={<cancelpayment />} />
          <Route path="/paypal" element={<paypalpayment />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
