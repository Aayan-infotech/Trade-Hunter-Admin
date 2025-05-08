// ProviderRatings.js
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
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://18.209.91.97:7787/api/rating/getAllProviderRatings?search=${encodeURIComponent(search)}`,
        authHeaders
      );
      setProviders(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [search]);

  const handleSearchChange = (e) => setSearch(e.target.value);

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
              placeholder="Search by name or email"
              value={search}
              onChange={handleSearchChange}
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
                  <CTableHeaderCell>Provider Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Avg Rating</CTableHeaderCell>
                  <CTableHeaderCell>Feedbacks</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {providers.map((prov, idx) => (
                  <CTableRow key={prov.providerId || prov._id}>
                    <CTableDataCell>{idx + 1}</CTableDataCell>
                    <CTableDataCell>{prov.contactName}</CTableDataCell>
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