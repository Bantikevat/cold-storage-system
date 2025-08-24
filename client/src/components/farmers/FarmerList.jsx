// src/components/farmers/FarmerList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaEdit, FaTrash, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import API_ENDPOINTS from '../../config/api';

const MySwal = withReactContent(Swal);

const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [farmersPerPage, setFarmersPerPage] = useState(10);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting states
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const navigate = useNavigate();

  useEffect(() => {
    fetchFarmers();
  }, [currentPage, farmersPerPage, sortBy, sortOrder, searchQuery]);

  const fetchFarmers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API_ENDPOINTS.FARMERS, {
        params: {
          page: currentPage,
          limit: farmersPerPage,
          sortBy: sortBy,
          sortOrder: sortOrder,
          search: searchQuery,
        },
      });
      setFarmers(res.data.farmers);
      setTotalFarmers(res.data.totalFarmers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching farmers:', err.message);
      setError('Failed to fetch farmers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-farmer/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! This will delete the farmer permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_ENDPOINTS.FARMERS}/${id}`);
        MySwal.fire('Deleted!', 'The farmer has been deleted.', 'success');
        fetchFarmers();
      } catch (err) {
        console.error("Error deleting farmer:", err.message);
        MySwal.fire('Error!', `Failed to delete farmer: ${err.response?.data?.message || err.message}`, 'error');
      }
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFarmersPerPageChange = (e) => {
    setFarmersPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-700">📄 Farmer List</h2>
          <div className="flex items-center border rounded px-2 py-1 bg-white shadow w-full md:w-80">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search name, phone, address, Aadhaar, email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="outline-none w-full text-sm px-1"
            />
          </div>
        </div>

        {loading && <p className="text-center text-gray-600">Loading farmers...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-auto rounded shadow bg-white">
              <table className="w-full text-sm text-left">
                <thead className="bg-sky-100 text-sky-800">
                  <tr>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('name')}>
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('phone')}>
                      Phone {sortBy === 'phone' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('address')}>
                      Address {sortBy === 'address' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('aadhaar')}>
                      Aadhaar {sortBy === 'aadhaar' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('email')}>
                      Email {sortBy === 'email' && (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />)}
                    </th>
                    <th className="p-3 whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {farmers.length > 0 ? (
                    farmers.map((farmer) => (
                      <tr key={farmer._id} className="border-t hover:bg-gray-50">
                        <td className="p-3 whitespace-nowrap">{farmer.name}</td>
                        <td className="p-3 whitespace-nowrap">
                          <a href={`tel:${farmer.phone}`} className="text-blue-600 hover:underline">{farmer.phone}</a>
                        </td>
                        <td className="p-3 whitespace-nowrap">{farmer.address}</td>
                        <td className="p-3 whitespace-nowrap">{farmer.aadhaar}</td>
                        <td className="p-3 whitespace-nowrap">
                          <a href={`mailto:${farmer.email}`} className="text-blue-600 hover:underline">{farmer.email}</a>
                        </td>
                        <td className="p-3 whitespace-nowrap flex justify-center gap-3">
                          <button onClick={() => handleEdit(farmer._id)} className="text-blue-600 hover:text-blue-800">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(farmer._id)} className="text-red-600 hover:text-red-800">
                            <FaTrash />
                          </button>
                          {/* NEW: Ledger and Add Payment buttons */}
                          <button onClick={() => navigate(`/ledger/${farmer._id}`)} className="text-purple-600 hover:text-purple-800 text-xs px-2 py-1 rounded border border-purple-300">🧾 Ledger</button>
                          <button onClick={() => navigate(`/add-payment/${farmer._id}`)} className="text-green-600 hover:text-green-800 text-xs px-2 py-1 rounded border border-green-300">➕ Add Payment</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">No farmers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 p-2 bg-white rounded shadow">
              <div>
                <label htmlFor="farmersPerPage" className="text-sm text-gray-700 mr-2">Farmers per page:</label>
                <select
                  id="farmersPerPage"
                  value={farmersPerPage}
                  onChange={handleFarmersPerPageChange}
                  className="border rounded p-1 text-sm"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages} ({totalFarmers} farmers total)
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FarmerList;
