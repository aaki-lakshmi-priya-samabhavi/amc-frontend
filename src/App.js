import React from "react";
import CustomerList from "./components/CustomerList"; // only if inside components

const App = () => {
  return (
    <div>
      <h1>AMC Scheduler</h1>
      <h2>All Customers</h2>
      <CustomerList />
    </div>
  );
};

export default App;
