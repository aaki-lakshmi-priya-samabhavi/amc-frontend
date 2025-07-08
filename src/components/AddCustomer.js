import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    contact: '',
    amcStartDate: '',
    amcEndDate: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Add New Customer</h2>
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />
        <input name="contact" placeholder="Contact" onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />
        <input type="date" name="amcStartDate" onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />
        <input type="date" name="amcEndDate" onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition">Submit</button>
      </form>
    </div>
  );
};

export default AddCustomer;
