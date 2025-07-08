import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import AddCustomer from "./components/AddCustomer";
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/add-customer" element={<AddCustomer />} />
      </Routes>
    </Router>
  );
}

export default App;