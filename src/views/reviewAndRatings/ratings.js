import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilViewColumn } from '@coreui/icons';

const ProviderRatings = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [minAvgRating, setMinAvgRating] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };

  // Fetch providers with optional filters
  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (minAvgRating) params.append('minAvgRating', minAvgRating);

      const url = `http://18.209.91.97:7787/api/rating/getAllProviderRatings?${params.toString()}`;
      const { data } = await axios.get(url, authHeaders);
      setProviders(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchProviders();
  }, [search, minAvgRating]);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleRatingChange = (e) => {
    const value = e.target.value;
    // allow only numbers between 0 and 5
    if (value === '' || (/^\d*(\.\d*)?$/).test(value)) {
      setMinAvgRating(value);
    }
  };

  const handleAction = (provider) => {
    navigate('/allFeedbacks', { state: { provider } });
  };

  const renderStars = (rating) => {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };

  return (
    <CContainer>
      <CCard>
        <CCardHeader className="service-card-header">
          <h4>Ratings And Feedbacks</h4>
          <div className="d-flex" style={{ gap: '8px' }}>
            <CFormInput
              placeholder="Search by Business Name or Email"
              value={search}
              onChange={handleSearchChange}
              style={{ width: '200px' }}
            />
            <CFormInput
              type="number"
              placeholder="Min Avg Rating (0-5)"
              value={minAvgRating}
              onChange={handleRatingChange}
              style={{ width: '150px' }}
              min="0"
              max="5"
              step="0.5"
            />
            <CButton color="primary" onClick={fetchProviders}>
              <CIcon icon={cilSearch} />
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr. No</CTableHeaderCell>
                  <CTableHeaderCell>Business Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Avg Rating</CTableHeaderCell>
                  <CTableHeaderCell>Feedbacks</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {providers.map((prov, idx) => (
                  <CTableRow key={prov.providerId || prov._id}>
                    <CTableDataCell>{idx + 1}</CTableDataCell>
                    <CTableDataCell>{prov.businessName}</CTableDataCell>
                    <CTableDataCell>{prov.email}</CTableDataCell>
                    <CTableDataCell>{renderStars(prov.avgRating)}</CTableDataCell>
                    <CTableDataCell>
                      <CButton size="sm" onClick={() => handleAction(prov)}>
                        <CIcon icon={cilViewColumn} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default ProviderRatings;
