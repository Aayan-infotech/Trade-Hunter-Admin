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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilViewColumn } from "@coreui/icons";
import "../Users/Usermanagement.css";

const VoucherUsers = () => {
  const [voucherUsers, setVoucherUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewVoucher, setViewVoucher] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const token = localStorage.getItem("token");
  const commonConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    fetchVoucherUsers();
  }, []);

  const fetchVoucherUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://18.209.91.97:7787/api/provider/getVoucherUsers",
        commonConfig
      );
      const data = response.data.data || [];
      // sort by startDate descending
      const sorted = data.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      setVoucherUsers(sorted);
    } catch (err) {
      console.error("Error fetching voucher users:", err);
      setError("Failed to load voucher users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewVoucher = (voucher) => {
    setViewVoucher(voucher);
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
          <h4>Voucher Users</h4>
        </CCardHeader>
        <CCardBody style={{ maxHeight: "400px", overflowY: "auto" }}>
          {error && <p className="text-danger">{error}</p>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Contact Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Code</CTableHeaderCell>
                  <CTableHeaderCell>Start Date</CTableHeaderCell>
                  <CTableHeaderCell>End Date</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {voucherUsers.length > 0 ? (
                  voucherUsers.map((v) => (
                    <CTableRow key={v._id}>
                      <CTableDataCell>
                        {v.userId?.contactName || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell>
                        {v.userId?.email || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell>{v.code}</CTableDataCell>
                      <CTableDataCell>
                        {formatDateToAEST(v.startDate)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatDateToAEST(v.endDate)}
                      </CTableDataCell>
                      <CTableDataCell>{v.status}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon
                          className="me-2 text-primary cursor-pointer"
                          title="view"
                          onClick={() => handleViewVoucher(v)}
                          icon={cilViewColumn}
                          size="lg"
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center">
                      No voucher users available.
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
          <CModalTitle>Voucher Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewVoucher && (
            <div>
              <p><strong>Contact Name:</strong> {viewVoucher.userId?.contactName || "N/A"}</p>
              <p><strong>Email:</strong> {viewVoucher.userId?.email || "N/A"}</p>
              <p><strong>Type:</strong> {viewVoucher.type}</p>
              <p><strong>Voucher ID:</strong> {viewVoucher.voucherId}</p>
              <p><strong>Code:</strong> {viewVoucher.code}</p>
              <p><strong>Start Date:</strong> {formatDateToAEST(viewVoucher.startDate)}</p>
              <p><strong>End Date:</strong> {formatDateToAEST(viewVoucher.endDate)}</p>
              <p><strong>Status:</strong> {viewVoucher.status}</p>
              <p><strong>Km Radius:</strong> {viewVoucher.kmRadius}</p>
              <p><strong>Created At:</strong> {formatDateToAEST(viewVoucher.createdAt)}</p>
              <p><strong>Updated At:</strong> {formatDateToAEST(viewVoucher.updatedAt)}</p>
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

export default VoucherUsers;
