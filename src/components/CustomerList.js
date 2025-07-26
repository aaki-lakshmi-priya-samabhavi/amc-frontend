import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CustomerCard from './CustomerCard';
import { motion } from 'framer-motion';

const getDaysLeft = (amcEndDate) => {
  const today = new Date();
  const endDate = new Date(amcEndDate);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? 'Expired' : diffDays;
};

const getDotColor = (daysLeft) => {
  if (daysLeft === 'Expired') return 'bg-red-500';
  if (daysLeft <= 30) return 'bg-yellow-400';
  return 'bg-green-500';
};

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 6;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/customers');
        setCustomers(res.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const confirmDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${id}`);
        setCustomers(customers.filter((customer) => customer._id !== id));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Customer AMC Records</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCustomers.map((customer) => (
          <CustomerCard
            key={customer._id}
            customer={customer}
            daysLeft={getDaysLeft(customer.amcEndDate)}
            dotColor={getDotColor(getDaysLeft(customer.amcEndDate))}
            handleDelete={confirmDelete}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 transition-all disabled:opacity-50"
        >
          ⬅ Prev
        </button>
        <span className="text-blue-800 font-semibold">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 transition-all disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>

      {/* Add Customer Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6"
        whileHover={{ scale: 1.1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/add-customer"
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl hover:bg-blue-700 transition-all"
        >
          ➕ Add New Customer
        </Link>
      </motion.div>
    </div>
  );
};

export default CustomerList;
