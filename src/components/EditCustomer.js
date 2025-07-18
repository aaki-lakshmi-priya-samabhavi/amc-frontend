import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: '',
    contact: '',
    amcStartDate: '',
    amcEndDate: ''
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/customers/${id}`);
        setCustomer(res.data);
      } catch (err) {
        console.error("❌ Error fetching customer:", err);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/customers/${id}`, customer);
      alert("✅ Customer updated successfully!");
      navigate('/');
    } catch (err) {
      console.error("❌ Error updating customer:", err);
      alert("Failed to update customer");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Edit Customer</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">

        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleChange}
          placeholder="Customer Name"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="contact"
          value={customer.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="date"
          name="amcStartDate"
          value={customer.amcStartDate?.slice(0, 10)} // Format for input
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="amcEndDate"
          value={customer.amcEndDate?.slice(0, 10)}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
        >
          Update Customer
        </button>
      </form>
    </div>
  );
};

export default EditCustomer;
