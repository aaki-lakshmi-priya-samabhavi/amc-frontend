import React, { useEffect, useState } from "react";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("❌ Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      {customers.length > 0 ? (
        customers.map((customer) => (
          <div key={customer._id} style={{ border: "3px solid black", marginBottom: "10px", padding: "10px" }}>
            <p><strong>Name of the person:</strong> {customer.name}</p>
            <p><strong>Contact:</strong> {customer.contact}</p>
            <p><strong>AMC Start:</strong> {new Date(customer.amcStartDate).toLocaleDateString()}</p>
            <p><strong>AMC End:</strong> {new Date(customer.amcEndDate).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>Loading customers...just wait</p>
      )}
    </div>
  );
};

export default CustomerList;
