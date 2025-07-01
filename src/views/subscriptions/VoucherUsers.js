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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilViewColumn, cilSearch } from "@coreui/icons";
import "../Users/Usermanagement.css";

const VoucherUsers = () => {
  const [voucherUsers, setVoucherUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewVoucher, setViewVoucher] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

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
    fetchVoucherUsers();
  }, [page, search]);

  const fetchVoucherUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://18.209.91.97:7777/api/provider/getVoucherUsers?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        commonConfig
      );

      const { data = [] } = response.data;
      setVoucherUsers(data);
      setHasMore(data.length === limit);
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
          <div className="d-flex align-items-center w-100">
            <h4 className="mb-0">Voucher Users</h4>
            <div className="ms-auto">
              <CInputGroup size="md" style={{ width: "350px" }}>
                <CFormInput
                  placeholder="Search by business name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  style={{ height: "40px" }}
                />
                <CButton
                  color="primary"
                  size="md"
                  style={{ height: "40px" }}
                  onClick={fetchVoucherUsers}
                  title="Search"
                >
                  <CIcon icon={cilSearch} size="lg" />
                </CButton>
              </CInputGroup>
            </div>
          </div>
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
                    <CTableHeaderCell>Business Name</CTableHeaderCell>
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
                        <CTableDataCell>{v.userId?.businessName || "User Deleted"}</CTableDataCell>
                        <CTableDataCell>{v.userId?.email || "User Deleted"}</CTableDataCell>
                        <CTableDataCell>{v.code}</CTableDataCell>
                        <CTableDataCell>{formatDateToAEST(v.startDate)}</CTableDataCell>
                        <CTableDataCell>{formatDateToAEST(v.endDate)}</CTableDataCell>
                        <CTableDataCell>{v.status}</CTableDataCell>
                        <CTableDataCell>
                          <CIcon
                            className="me-2 text-primary cursor-pointer"
                            title="View Details"
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
                        No voucher users found for “{search}”.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

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

      <CModal visible={showViewModal} onClose={() => setShowViewModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Voucher Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewVoucher && (
            <div>
              <p><strong>Business Name:</strong> {viewVoucher.userId?.businessName || "N/A"}</p>
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
