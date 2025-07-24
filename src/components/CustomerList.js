// src/components/CustomerList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CountdownTimer from './CountdownTimer';


const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expiryFilter, setExpiryFilter] = useState('all');

  const customersPerPage = 5;

  const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};


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

  // ✅ Search filter
  let filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Expiry filter
  if (expiryFilter === '7') {
    filteredCustomers = filteredCustomers.filter(customer => {
      const daysLeft = (new Date(customer.amcEndDate) - new Date()) / (1000 * 60 * 60 * 24);
      return daysLeft <= 7 && daysLeft >= 0;
    });
  } else if (expiryFilter === '30') {
    filteredCustomers = filteredCustomers.filter(customer => {
      const daysLeft = (new Date(customer.amcEndDate) - new Date()) / (1000 * 60 * 60 * 24);
      return daysLeft <= 30 && daysLeft >= 0;
    });
  } else if (expiryFilter === 'expired') {
    filteredCustomers = filteredCustomers.filter(customer =>
      new Date(customer.amcEndDate) < new Date()
    );
  }

  // ✅ Sorting
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

  // ✅ Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  return (
    <div className="min-h-screen bg-blue-50 p-6 relative font-sans">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-4 font-serif">
        ⭐ <span className="mx-4 font-[cursive]">AMC Scheduler</span> ⭐
      </h1>
      <h2 className="text-2xl text-center text-black-800 mb-8 font-serif">Sri Durga Elevators</h2>

      {/* Search Input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-2 border-blue-400 p-3 rounded-xl w-full max-w-md shadow-sm focus:ring-2 focus:ring-blue-300 transition-all duration-300"
        />
      </div>

      {/* Sorting & Expiry Filters */}
      <div className="flex justify-center gap-6 mb-6 flex-wrap">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-white border-2 border-blue-500 text-gray-800 font-semibold px-4 py-2 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out hover:shadow-lg"
          style={{ fontFamily: 'Segoe UI, sans-serif', width: '200px' }}
        >
          <option value="">Sort By</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="amcEndDate-asc">AMC End Date ↑</option>
          <option value="amcEndDate-desc">AMC End Date ↓</option>
        </select>

        <select
          value={expiryFilter}
          onChange={(e) => setExpiryFilter(e.target.value)}
          className="bg-white border-2 border-green-500 text-gray-800 font-semibold px-4 py-2 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 ease-in-out hover:shadow-lg"
          style={{ fontFamily: 'Segoe UI, sans-serif', width: '220px' }}
        >
          <option value="all">Filter by AMC Expiry</option>
          <option value="7">Expiring in next 7 days</option>
          <option value="30">Expiring in next 30 days</option>
          <option value="expired">Already Expired</option>
        </select>
      </div>

      {/* Customer Cards */}
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
              <p>
  <strong className="text-blue-600">AMC Start:</strong>{' '}
  {customer.amcStartDate ? formatDate(customer.amcStartDate) : 'N/A'}
</p>
<p>
  <strong className="text-blue-600">AMC End:</strong>{' '}
  {customer.amcEndDate ? formatDate(customer.amcEndDate) : 'N/A'}
</p>

<p>
  <strong className="text-blue-600">Time Left:</strong>{' '}
  <CountdownTimer endTime={customer.amcEndDate} />
</p>


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

      {/* Pagination Buttons */}
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

      {/* Add Customer Floating Button */}
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
