// src/components/CustomerList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // ✅ search state

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${id}`);
        setCustomers((prev) => prev.filter((customer) => customer._id !== id));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete customer");
      }
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer? if yes click ok")) {
      handleDelete(id);
    }
  };

  // ✅ Filter customers based on search
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50 p-6 relative">
      <h1 className="text-5xl text-black-800 font-[Georgia] bold text-center my-10 tracking-wide font-serif">
        ⭐ <span className="mx-4 font-[cursive]">AMC Scheduler</span> ⭐
      </h1>

      <h2 className="text-2xl text-black-800 font-[Georgia] bold text-center mb-6 font-serif">
        Sri Durga Elevators
      </h2>

      {/* ✅ Search input box */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </div>

      <div className="space-y-4 px-4">
        {filteredCustomers.length === 0 ? (
          <p className="text-center text-gray-500">No matching customers found.</p>
        ) : (
          filteredCustomers.map((customer, index) => (
            <div
              key={index}
              className="border-2 border-blue-300 rounded-xl p-4 bg-white shadow-md transition-all hover:scale-105 duration-300"
            >
              <p><strong className="text-blue-700">Name:</strong> {customer.name}</p>
              <p><strong className="text-blue-600">Contact:</strong> {customer.contact}</p>
              <p><strong className="text-blue-600">AMC Start:</strong> {customer.amcStartDate}</p>
              <p><strong className="text-blue-600">AMC End:</strong> {customer.amcEndDate}</p>

              <button
                onClick={() => confirmDelete(customer._id)}
                className="mt-2 bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                🗑 Delete
              </button>
              <Link to={`/edit-customer/${customer._id}`}>
                <button className="bg-blue-500 text-white px-4 py-1 rounded-md mr-8 ml-2">
                  ✏️ Edit
                </button>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
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
