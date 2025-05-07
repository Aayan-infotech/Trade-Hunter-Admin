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
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewPayment, setViewPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        "http://18.209.91.97:7787/api/eway/getAllTransactions"
      );
      const sorted = (res.data.transactions || []).sort(
        (a, b) =>
          new Date(b.transaction.transactionDate) -
          new Date(a.transaction.transactionDate)
      );
      setPayments(sorted);
    } catch (e) {
      console.error("Error fetching payments:", e);
      setError("Failed to load payments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayment = (payment) => {
    setViewPayment(payment);
    setShowViewModal(true);
  };

  const formatDateToAEST = (dateString) =>
    new Date(dateString).toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });


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
                  <CTableHeaderCell>$ </CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Mode</CTableHeaderCell>
                  <CTableHeaderCell>Plan Name</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {payments.length > 0 ? (
                  payments.map((pay) => (
                    <CTableRow key={pay._id}>
                      <CTableDataCell>
                        {pay.transaction.transactionId}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(
                          pay.transaction.transactionDate
                        ).toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        {pay.userId?.contactName ?? "—"}
                      </CTableDataCell>
                      <CTableDataCell>
                        {(pay.transaction.transactionPrice)}
                      </CTableDataCell>
                      <CTableDataCell>{pay.status}</CTableDataCell>
                      <CTableDataCell>
                        {pay.payment.paymentSource}
                      </CTableDataCell>
                      <CTableDataCell>
                        {pay.subscriptionPlanId?.planName ?? "—"}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CIcon
                          className="me-2 text-primary cursor-pointer"
                          icon={cilViewColumn}
                          size="lg"
                          onClick={() => handleViewPayment(pay)}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center">
                      No payments available.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* View Details Modal */}
      <CModal
        visible={showViewModal}
        onClose={() => setShowViewModal(false)}
        scrollable
      >
        <CModalHeader className="service-card-header">
          <CModalTitle>Payment Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewPayment && (
            <div className="p-2">
              <p><strong>_id:</strong> {viewPayment._id}</p>
              <p><strong>Transaction ID:</strong> {viewPayment.transaction.transactionId}</p>
              <p><strong>Transaction Date:</strong> {formatDateToAEST(viewPayment.transactionDate)}</p>
              <p><strong>Transaction Price:</strong> {(viewPayment.transaction.transactionPrice)}</p>
              <p><strong>Authorisation Code:</strong> {viewPayment.transaction.authorisationCode}</p>
              <p><strong>Transaction Status:</strong> {viewPayment.transaction.transactionStatus}</p>
              <p><strong>Transaction Type:</strong> {viewPayment.transaction.transactionType}</p>
              <hr />
              <p><strong>Payment Source:</strong> {viewPayment.payment.paymentSource}</p>
              <p><strong>Payment Total Amount:</strong> {(viewPayment.payment.totalAmount)}</p>
              <p><strong>Currency Code:</strong> {viewPayment.payment.countryCode}</p>
              <hr />
              <p><strong>Payer ID:</strong> {viewPayment.payer.payerId || "—"}</p>
              <p><strong>Payer Name:</strong> {viewPayment.payer.payerName}</p>
              <p><strong>Payer Email:</strong> {viewPayment.payer.payerEmail}</p>
              <hr />
              <p><strong>Provider ID:</strong> {viewPayment.userId?._id || "—"}</p>
              <p><strong>Provider Name:</strong> {viewPayment.userId?.contactName}</p>
              <p><strong>Provider Email:</strong> {viewPayment.userId?.email}</p>
              <hr />
              <p><strong>Plan ID:</strong> {viewPayment.subscriptionPlanId?._id || "—"}</p>
              <p><strong>Plan Name:</strong> {viewPayment.subscriptionPlanId?.planName}</p>
              <p><strong>KM Radius:</strong> {viewPayment.subscriptionPlanId?.kmRadius}</p>
              <hr />
              <p><strong>Record Created At:</strong> {formatDateToAEST(viewPayment.createdAt)}</p>
              <p><strong>Record Updated At:</strong> {formatDateToAEST(viewPayment.updatedAt)}</p>
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
