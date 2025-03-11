import React, { useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';
import { FaTicketAlt, FaCopy } from 'react-icons/fa';
import '../Users/Usermanagement.css';

const API_ENDPOINT = "https://your-api-endpoint.com/api/vouchers";

const CreateVoucher = () => {
  const [voucherName, setVoucherName] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [couponCode, setCouponCode] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscribedUsers] = useState([]);

  const handleVoucherNameChange = (e) => {
    setVoucherName(e.target.value.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { voucherName, validFrom, validTo };
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setResponse(result);
      if (result.couponCode) {
        setCouponCode(result.couponCode);
      }
    } catch (error) {
      console.error("Error creating voucher:", error);
      setResponse({ error: "Failed to create voucher." });
    }
    setLoading(false);
  };

  const handleCopyCouponCode = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      alert("Coupon code copied to clipboard!");
    }
  };

  return (
    <>
      <CContainer fluid className="d-flex align-items-center justify-content-center mt-5">
        <CCard className="voucher-card shadow" style={{ maxWidth: '600px' }}>
          <CCardHeader className="voucher-card-header text-center">
            <FaTicketAlt size={30} className="mr-2" />
            Create Subscription Voucher
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="voucherName">Voucher Code</CFormLabel>
                  <CFormInput
                    type="text"
                    id="voucherName"
                    value={voucherName}
                    onChange={handleVoucherNameChange}
                    placeholder="ENTER VOUCHER CODE"
                    required
                    className="custom-input"
                    style={{ textTransform: "uppercase", letterSpacing: "1px" }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="validFrom">Valid From</CFormLabel>
                  <CFormInput
                    type="date"
                    id="validFrom"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    required
                    className="custom-input"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="validTo">Valid To</CFormLabel>
                  <CFormInput
                    type="date"
                    id="validTo"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    required
                    className="custom-input"
                  />
                </CCol>
              </CRow>
              <div className="text-center mb-3">
                <CButton type="submit" color="primary" disabled={loading} className="voucher-button">
                  {loading ? "Creating..." : "Create Voucher"}
                </CButton>
              </div>
            </CForm>
            {couponCode && (
              <div className="coupon-code-section mt-4 d-flex align-items-center justify-content-between">
                <span className="coupon-code">{couponCode}</span>
                <FaCopy className="copy-icon" onClick={handleCopyCouponCode} />
              </div>
            )}
            {response && !couponCode && (
              <div className="mt-4 response-box">
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
      
      <CContainer fluid className="mt-5">
        <div className="subscribers-table-section">
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>User ID</CTableHeaderCell>
                <CTableHeaderCell>Provider Name</CTableHeaderCell>
                <CTableHeaderCell>Email Id</CTableHeaderCell>
                <CTableHeaderCell>Subscribed At</CTableHeaderCell>
                <CTableHeaderCell>Subscription Type</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {subscribedUsers && subscribedUsers.length > 0 ? (
                subscribedUsers.map((user) => (
                  <CTableRow key={user.id}>
                    <CTableDataCell>{user.id}</CTableDataCell>
                    <CTableDataCell>{user.userName}</CTableDataCell>
                    <CTableDataCell>{user.userEmail}</CTableDataCell>
                    <CTableDataCell>{user.subscribedAt}</CTableDataCell>
                    <CTableDataCell>{user.type}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center">
                    No data available
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      </CContainer>
    </>
  );
};

export default CreateVoucher;
