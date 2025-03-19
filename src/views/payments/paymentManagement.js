import React, { useState, useEffect } from "react";
import axios from "axios";
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
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilViewColumn } from "@coreui/icons";
import "../Users/Usermanagement.css";

const PaymentManagement = () => {
  const [Payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewPayment, setViewPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchPayment();
  }, []);

  const fetchPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://3.223.253.106:7777/api/payment/getAllPayment");
      const sortedPayments = (response.data.data || []).sort(
        (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
      );
      console.log(sortedPayments);
      setPayment(sortedPayments);
    } catch (error) {
      console.error("Error fetching Payments:", error);
      setError("Failed to load payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayment = (payment) => {
    setViewPayment(payment);
    setShowViewModal(true);
  };

  return (
    <CContainer>
      <CCard>
        <CCardHeader className="service-card-header">
          <h4>Payments</h4>
        </CCardHeader>
        <CCardBody style={{ maxHeight: "400px", overflowY: "auto" }}>
          {error && <p className="text-danger">{error}</p>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Transaction ID</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Provider Name</CTableHeaderCell>
                  <CTableHeaderCell>Transaction Amount</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Mode</CTableHeaderCell>
                  <CTableHeaderCell>Subscription Type</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {Payment.length > 0 ? (
                  Payment.map((payment) => (
                    <CTableRow key={payment._id}>
                      <CTableDataCell>{payment.transactionId}</CTableDataCell>
                      <CTableDataCell>{payment.transactionDate}</CTableDataCell>
                      <CTableDataCell>{payment?.userId?.contactName}</CTableDataCell>
                      <CTableDataCell>${payment.transactionAmount}</CTableDataCell>
                      <CTableDataCell>{payment.transactionStatus}</CTableDataCell>
                      <CTableDataCell>{payment.transactionMode}</CTableDataCell>
                      <CTableDataCell>{payment.type}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon
                          className="me-2 text-primary cursor-pointer"
                          onClick={() => handleViewPayment(payment)}
                          icon={cilViewColumn}
                          size="lg"
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center">
                      No payments available.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={showViewModal} onClose={() => setShowViewModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Payment Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewPayment && (
            <div>
              <p>
                <strong>Transaction ID:</strong> {viewPayment.transactionId}
              </p>
              <p>
                <strong>Date:</strong> {viewPayment.transactionDate}
              </p>
              <p>
                <strong>Status:</strong> {viewPayment.transactionStatus}
              </p>
              <p>
                <strong>Amount:</strong> ${viewPayment.transactionAmount}
              </p>
              <p>
                <strong>Mode:</strong> {viewPayment.transactionMode}
              </p>
              <p>
                <strong>Subscription ID:</strong> {viewPayment.SubscriptionId || "N/A"}
              </p>
              <p>
                <strong>Subscription Amount:</strong> ${viewPayment.SubscriptionAmount || "0.00"}
              </p>
              <p>
                <strong>User ID:</strong> {viewPayment?.userId?._id}
              </p>
              <p>
                <strong>Provider Name:</strong> {viewPayment?.userId?.contactName}
              </p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default PaymentManagement;
