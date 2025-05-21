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
  CInputGroup,
  CFormInput,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilViewColumn, cilSearch } from "@coreui/icons";
import "../Users/Usermanagement.css";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewPayment, setViewPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Pagination & Search
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const token = localStorage.getItem("token");
  const commonConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    fetchPayments();
  }, [page, search]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://18.209.91.97:7787/api/eway/getAllTransactions?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        commonConfig
      );
      const data = res.data.transactions || [];
      setPayments(data);
      setHasMore(data.length === limit);
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
          <CRow className="align-items-center w-100">
            <CCol>
              <h4 className="text-start">Payments</h4>
            </CCol>
            <CCol className="d-flex justify-content-end">
              <CInputGroup style={{ width: "360px" }}>
                <CFormInput
                  placeholder="Search by business name..."
                  value={search}
                  size="md"
                  style={{ height: "40px" }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                <CButton
                  color="primary"
                  size="md"
                  style={{ height: "40px" }}
                  onClick={fetchPayments}
                  title="Search"
                >
                  <CIcon icon={cilSearch} size="lg" />
                </CButton>
              </CInputGroup>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody style={{ maxHeight: "400px", overflowY: "auto" }}>
          {error && <p className="text-danger">{error}</p>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <CTable hover responsive>
                <CTableHead className="sticky-header">
                  <CTableRow>
                    <CTableHeaderCell>Transaction ID</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Business Name</CTableHeaderCell>
                    <CTableHeaderCell>$</CTableHeaderCell>
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
                          {formatDateToAEST(
                            pay.transaction.transactionDate
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {pay.userId?.businessName ?? "User Deleted"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {pay.transaction.transactionPrice.toFixed(2)}
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
                        No payments found for “{search}”.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {/* Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <CButton
                  color="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </CButton>
                <span>Page {page}</span>
                <CButton
                  color="secondary"
                  size="sm"
                  disabled={!hasMore}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </CButton>
              </div>
            </>
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
              <p>
                <strong>_id:</strong> {viewPayment._id}
              </p>
              <p>
                <strong>Transaction ID:</strong>{" "}
                {viewPayment.transaction.transactionId}
              </p>
              <p>
                <strong>Transaction Date:</strong>{" "}
                {formatDateToAEST(
                  viewPayment.transaction.transactionDate
                )}
              </p>
              <p>
                <strong>Transaction Price:</strong>{" "}
                {viewPayment.transaction.transactionPrice.toFixed(2)}
              </p>
              <p>
                <strong>Authorisation Code:</strong>{" "}
                {viewPayment.transaction.authorisationCode}
              </p>
              <p>
                <strong>Transaction Status:</strong>{" "}
                {viewPayment.transaction.transactionStatus}
              </p>
              <p>
                <strong>Transaction Type:</strong>{" "}
                {viewPayment.transaction.transactionType}
              </p>
              <hr />
              <p>
                <strong>Payment Source:</strong>{" "}
                {viewPayment.payment.paymentSource}
              </p>
              <p>
                <strong>Payment Total Amount:</strong>{" "}
                {viewPayment.payment.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Currency Code:</strong>{" "}
                {viewPayment.payment.countryCode}
              </p>
              <hr />
              <p>
                <strong>Payer ID:</strong> {viewPayment.payer.payerId || "—"}
              </p>
              <p>
                <strong>Payer Name:</strong> {viewPayment.payer.payerName}
              </p>
              <p>
                <strong>Payer Email:</strong> {viewPayment.payer.payerEmail}
              </p>
              <hr />
              <p>
                <strong>Provider ID:</strong> {viewPayment.userId?._id || "—"}
              </p>
              <p>
                <strong>Business Name:</strong>{" "}
                {viewPayment.userId?.businessName}
              </p>
              <p>
                <strong>Provider Email:</strong> {viewPayment.userId?.email}
              </p>
              <hr />
              <p>
                <strong>Plan ID:</strong>{" "}
                {viewPayment.subscriptionPlanId?._id || "—"}
              </p>
              <p>
                <strong>Plan Name:</strong>{" "}
                {viewPayment.subscriptionPlanId?.planName}
              </p>
              <p>
                <strong>KM Radius:</strong>{" "}
                {viewPayment.subscriptionPlanId?.kmRadius}
              </p>
              <hr />
              <p>
                <strong>Record Created At:</strong>{" "}
                {formatDateToAEST(viewPayment.createdAt)}
              </p>
              <p>
                <strong>Record Updated At:</strong>{" "}
                {formatDateToAEST(viewPayment.updatedAt)}
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
