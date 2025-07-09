// src/components/CustomerList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("❌ Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6 relative">
      <h1 className="text-4xl text-blue-700 font-bold underline text-center my-8 animate-pulse">
        AMC Scheduler
      </h1>

      <h2 className="text-2xl text-blue-500 font-semibold text-center mb-6">
        All Customers
      </h2>

      <div className="space-y-4 px-4">
        {customers.length === 0 ? (
          <p className="text-center text-gray-500">No customers found.</p>
        ) : (
          customers.map((customer, index) => (
            <div key={index} className="border-2 border-blue-300 rounded-xl p-4 bg-white shadow-md transition-all hover:scale-105 duration-300">
              <p><strong className="text-blue-700">Name:</strong> {customer.name}</p>
              <p><strong className="text-blue-600">Contact:</strong> {customer.contact}</p>
              <p><strong className="text-blue-600">AMC Start:</strong> {customer.amcStartDate}</p>
              <p><strong className="text-blue-600">AMC End:</strong> {customer.amcEndDate}</p>
            </div>
          ))
        )}
      </div>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6">
        <Link
          to="/add-customer"
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          <span className="mr-2">➕</span> Add New Customer
        </Link>
      </div>
    </div>
  );
};

export default CustomerList;
