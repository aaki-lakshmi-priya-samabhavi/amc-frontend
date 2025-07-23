// src/components/CustomerList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

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
    if (window.confirm("Are you sure you want to delete this customer? If yes, click OK")) {
      handleDelete(id);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers];
  if (sortOption === 'name-asc') {
    sortedCustomers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'name-desc') {
    sortedCustomers.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOption === 'amcEndDate-asc') {
    sortedCustomers.sort((a, b) => new Date(a.amcEndDate) - new Date(b.amcEndDate));
  } else if (sortOption === 'amcEndDate-desc') {
    sortedCustomers.sort((a, b) => new Date(b.amcEndDate) - new Date(a.amcEndDate));
  }

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  return (
    <div className="min-h-screen bg-blue-50 p-6 relative">
      <h1 className="text-5xl text-black-800 font-[Georgia] bold text-center my-10 tracking-wide font-serif">
        ⭐ <span className="mx-4 font-[cursive]">AMC Scheduler</span> ⭐
      </h1>

      <h2 className="text-2xl text-black-800 font-[Georgia] bold text-center mb-6 font-serif">
        Sri Durga Elevators
      </h2>

      {/* ✅ Search input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </div>

      {/* ✅ Sort dropdown with style */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="relative inline-block text-left">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border-2 border-blue-500 text-gray-800 font-semibold px-4 py-2 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer"
            style={{ fontFamily: 'Segoe UI, sans-serif', width: '200px' }}
          >
            <option value="" className="rounded-lg">Sort By</option>
            <option value="name-asc" className="rounded-lg">Name A-Z</option>
            <option value="name-desc" className="rounded-lg">Name Z-A</option>
            <option value="amcEndDate-asc" className="rounded-lg">AMC End Date ↑</option>
            <option value="amcEndDate-desc" className="rounded-lg">AMC End Date ↓</option>
          </select>
        </div>
      </div>

      {/* ✅ Customer List */}
      <div className="space-y-4 px-4">
        {filteredCustomers.length === 0 ? (
          <p className="text-center text-gray-500">No matching customers found.</p>
        ) : (
          currentCustomers.map((customer, index) => (
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

      {/* ✅ Pagination Buttons */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(sortedCustomers.length / customersPerPage) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-xl font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none ${
              currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-white border border-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ✅ Floating Add Button */}
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