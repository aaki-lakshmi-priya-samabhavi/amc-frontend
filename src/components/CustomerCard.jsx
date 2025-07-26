import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const statusColors = {
  active: 'bg-green-100 border-green-300 text-green-800',
  expiringSoon: 'bg-yellow-100 border-yellow-300 text-yellow-700',
  expired: 'bg-red-100 border-red-300 text-red-700',
};

const dotColors = {
  active: 'bg-green-500',
  expiringSoon: 'bg-yellow-500',
  expired: 'bg-gray-500',
};

const CustomerCard = ({ customer, formatDate, getDaysLeft, getDotColor, confirmDelete }) => {
  const { _id, name, contact, amcStartDate, amcEndDate, status } = customer;
  const daysLeft = getDaysLeft(amcEndDate);
  const dotColor = getDotColor(daysLeft);

  return (
    <motion.div
      className={`rounded-2xl border-2 p-6 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${statusColors[status]}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold mb-1">🔹 {name}</h2>
      <p><strong className="text-blue-700">Contact:</strong> {contact}</p>
      <p><strong className="text-blue-700">AMC Start:</strong> {formatDate(amcStartDate)}</p>
      <p><strong className="text-blue-700">AMC End:</strong> {formatDate(amcEndDate)}</p>

      <p className="flex items-center gap-2 mt-2 text-md">
        <span className={`w-3 h-3 rounded-full ${dotColor}`}></span>
        <strong>Time Left:</strong> {daysLeft === "Expired" ? "Expired" : `${daysLeft} days`}
      </p>

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => confirmDelete(_id)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1 rounded-md transition"
        >
          🗑 Delete
        </button>
        <Link to={`/edit-customer/${_id}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1 rounded-md transition">
            ✏️ Edit
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default CustomerCard;
