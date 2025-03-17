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
  CPagination,
  CFormInput,
  CPaginationItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilTrash,
  cilPencil,
  cilViewColumn,
  cilArrowBottom,
  cilArrowTop,
  cilSearch,
} from "@coreui/icons";
import "../Users/Usermanagement.css";

const formatDate = (dateObj) => {
  if (!dateObj) return "N/A";
  const date = new Date(dateObj);
  return date.toLocaleDateString();
};

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [sortedJobs, setSortedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("All");
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewJob, setViewJob] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      // If a job status filter is applied (not "All"), use the filter API
      if (jobStatusFilter !== "All") {
        response = await axios.get(
          `http://54.236.98.193:7777/api/jobs/filter?status=${jobStatusFilter}&page=${page}&limit=10`
        );
      } else {
        // Otherwise, use the default endpoint with search parameter
        response = await axios.get(
          `http://54.236.98.193:7777/api/jobs/?page=${page}&limit=10&search=${search}`
        );
      }
      setJobs(response.data.data.jobPosts || []);
      setTotalPages(response.data.data.pagination.totalPages || 1);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, search, jobStatusFilter]);

  useEffect(() => {
    // Default sort by createdAt (recent first)
    const sortedByRecent = [...jobs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setSortedJobs(sortedByRecent);
  }, [jobs]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (e) => {
    setJobStatusFilter(e.target.value);
    setPage(1);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    sortJobs(newOrder);
  };

  const sortJobs = (order) => {
    const sorted = [...jobs].sort((a, b) => {
      if (order === "asc") {
        return a.businessType.localeCompare(b.businessType);
      } else {
        return b.businessType.localeCompare(a.businessType);
      }
    });
    setSortedJobs(sorted);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        console.log("Initiating deletion for job id:", jobId);
        const token = localStorage.getItem("token");
        console.log("Retrieved token:", token);
        if (!token) {
          alert("Authentication token not found. Please log in again.");
          return;
        }
        const response = await axios.delete(`http://54.236.98.193:7777/api/jobPost/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Delete response:", response.data);
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job.");
      }
    }
  };
  
  
  
  
  

  const handleViewJob = (job) => {
    setViewJob(job);
    setShowViewModal(true);
  };

  const handleEditJob = (job) => {
    const formattedJob = {
      ...job,
      businessType: Array.isArray(job.businessType)
        ? job.businessType.join(", ")
        : job.businessType,
    };
    setEditJob(formattedJob);
    setShowEditModal(true);
  };

  const handleSaveEditJob = async () => {
    try {
      const updatedJob = {
        ...editJob,
        businessType: editJob.businessType
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      };

      if (updatedJob.provider) {
        delete updatedJob.provider;
      }

      console.log("Updated job payload:", updatedJob);

      const response = await axios.put(
        `http://54.236.98.193:7777/api/jobs/${editJob._id}`,
        updatedJob
      );
      console.log("Update response:", response.data);

      fetchJobs();
      setShowEditModal(false);
      setEditJob(null);
    } catch (error) {
      console.error(
        "Error updating job:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to update job.");
    }
  };

  return (
    <CContainer className="jobs-container">
      <CCard>
        <CCardHeader className="service-card-header">
          <h4>Jobs Management</h4>
          <div
            className="search-container"
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            {/* <select
              value={jobStatusFilter}
              onChange={handleStatusFilter}
              className="form-control"
              style={{ width: "200px" }}
            >
              <option value="All">Job Status</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="InProgress">InProgress</option>
              <option value="Completed">Completed</option>
              <option value="deleted">Deleted</option>
            </select> */}
            <CFormInput
              type="text"
              placeholder="Search by Hunters name or Providers name"
              value={search}
              onChange={handleSearch}
              className="search-input"
            />
            <CButton
              color="primary"
              onClick={fetchJobs}
              className="search-button"
            >
              <CIcon icon={cilSearch} /> Search
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody className="card-body-custom">
          {error && <p className="error-text">{error}</p>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CTable hover responsive className="jobs-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Hunters Name</CTableHeaderCell>
                  <CTableHeaderCell>Providers Name</CTableHeaderCell>
                  <CTableHeaderCell>Job Address</CTableHeaderCell>
                  <CTableHeaderCell>JobPosted Date</CTableHeaderCell>
                  <CTableHeaderCell>Completion Date</CTableHeaderCell>
                  <CTableHeaderCell
                    onClick={toggleSortOrder}
                    style={{ cursor: "pointer" }}
                  >
                    Business Type
                    <CIcon
                      icon={sortOrder === "asc" ? cilArrowBottom : cilArrowTop}
                      className="ms-2"
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {sortedJobs.length > 0 ? (
                  sortedJobs.map((job) => (
                    <CTableRow key={job._id}>
                      <CTableDataCell>{job.title}</CTableDataCell>
                      <CTableDataCell>{job.user?.name}</CTableDataCell>
                      <CTableDataCell>{job.provider?.contactName}</CTableDataCell>
                      <CTableDataCell>
                        {job.jobLocation?.jobAddressLine}
                      </CTableDataCell>
                      <CTableDataCell>{formatDate(job.createdAt)}</CTableDataCell>
                      <CTableDataCell>{formatDate(job.updatedAt)}</CTableDataCell>
                      <CTableDataCell>
                        {Array.isArray(job.businessType)
                          ? job.businessType.join(", ")
                          : job.businessType}
                      </CTableDataCell>
                      <CTableDataCell>{job.jobStatus}</CTableDataCell>
                      <CTableDataCell className="actions-cell">
                        <CIcon
                          className="action-icon view-icon"
                          onClick={() => handleViewJob(job)}
                          icon={cilViewColumn}
                          size="lg"
                        />
                        <CIcon
                          className="action-icon edit-icon"
                          onClick={() => handleEditJob(job)}
                          icon={cilPencil}
                          size="lg"
                        />
                        <CIcon
                          className="action-icon delete-icon"
                          onClick={() => handleDeleteJob(job._id)}
                          icon={cilTrash}
                          size="lg"
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center">
                      No jobs available.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}

          <CPagination align="center" className="mt-3">
            <CPaginationItem
              className="pagination-item"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </CPaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <CPaginationItem
                key={i + 1}
                active={i + 1 === page}
                onClick={() => setPage(i + 1)}
                className="pagination-item"
              >
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              className="pagination-item"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </CPaginationItem>
          </CPagination>
        </CCardBody>
      </CCard>

      {/* View Job Modal */}
      <CModal
        scrollable
        visible={showViewModal}
        onClose={() => setShowViewModal(false)}
      >
        <CModalHeader className="service-card-header">
          <CModalTitle>Job Details</CModalTitle>
        </CModalHeader>
        <CModalBody className="modal-body-custom">
          {viewJob && (
            <div className="view-job-details">
              <p>
                <strong>Title:</strong> {viewJob.title}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {viewJob.jobLocation?.jobAddressLine || "N/A"}
              </p>
              <p>
                <strong>Job Radius:</strong> {viewJob.jobLocation?.jobRadius}{" "}
                meters
              </p>
              <p>
                <strong>Estimated Budget:</strong> ${viewJob.estimatedBudget}
              </p>
              <p>
                <strong>Business Type:</strong>{" "}
                {Array.isArray(viewJob.businessType)
                  ? viewJob.businessType.join(", ")
                  : viewJob.businessType}
              </p>
              <p>
                <strong>Services:</strong> {viewJob.services}
              </p>
              <p>
                <strong>Requirements:</strong> {viewJob.requirements}
              </p>
              <p>
                <strong>Hunters ID:</strong> {viewJob.user?._id}
              </p>
              <p>
                <strong>Hunters Name:</strong> {viewJob.user?.name}
              </p>
              <p>
                <strong>Hunters email:</strong> {viewJob.user?.email}
              </p>
              <p>
                <strong>Job Status:</strong> {viewJob.jobStatus}
              </p>
              <p>
                <strong>Providers ID:</strong> {viewJob.provider?._id}
              </p>
              <p>
                <strong>Provider Name:</strong> {viewJob.provider?.contactName}
              </p>
              <p>
                <strong>Provider email:</strong> {viewJob.provider?.email}
              </p>
              <p>
                <strong>JobPosted Date:</strong> {formatDate(viewJob.createdAt)}
              </p>
              <p>
                <strong>Deleted By - Name:</strong> {viewJob.deleteBy?.name}
              </p>
              <p>
                <strong>Deleted By - Email:</strong> {viewJob.deleteBy?.email}
              </p>
              <p>
                <strong>Completion Date:</strong>{" "}
                {formatDate(viewJob.updatedAt)}
              </p>
              <p>
                <strong>Timeframe:</strong>
              </p>
              <ul>
                <li>
                  <strong>From:</strong>{" "}
                  {new Date(viewJob.timeframe?.from * 1000).toLocaleDateString()}
                </li>
                <li>
                  <strong>To:</strong>{" "}
                  {new Date(viewJob.timeframe?.to * 1000).toLocaleDateString()}
                </li>
              </ul>
              {viewJob.documents && viewJob.documents.length > 0 ? (
                <div>
                  <p>
                    <strong>Documents:</strong>
                  </p>
                  <ul>
                    {viewJob.documents.map((doc, index) => (
                      <li key={index}>
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Document {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>
                  <strong>Documents:</strong> No documents uploaded.
                </p>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter className="modal-footer-custom">
          <CButton
            onClick={() => setShowViewModal(false)}
            color="secondary"
            className="modal-close-button"
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Job Modal */}
      <CModal
        scrollable
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
      >
        <CModalHeader className="service-card-header">
          <CModalTitle>Edit Job</CModalTitle>
        </CModalHeader>
        <CModalBody className="modal-body-custom">
          {editJob && (
            <div className="edit-job-form">
              <label>Title</label>
              <input
                type="text"
                value={editJob.title}
                onChange={(e) =>
                  setEditJob({ ...editJob, title: e.target.value })
                }
                className="form-control mb-2"
              />
              <label>Location</label>
              <input
                type="text"
                value={editJob.jobLocation?.jobAddressLine || ""}
                onChange={(e) =>
                  setEditJob({
                    ...editJob,
                    jobLocation: {
                      ...editJob.jobLocation,
                      jobAddressLine: e.target.value,
                    },
                  })
                }
                className="form-control mb-2"
              />
              <label>Estimated Budget ($)</label>
              <input
                type="number"
                value={editJob.estimatedBudget || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, estimatedBudget: e.target.value })
                }
                className="form-control mb-2"
              />
              <label>Business Type</label>
              <input
                type="text"
                value={editJob.businessType || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, businessType: e.target.value })
                }
                className="form-control mb-2"
              />
              <label>Job Status</label>
              <select
                value={editJob.jobStatus || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, jobStatus: e.target.value })
                }
                className="form-control mb-2"
              >
                <option value="">Change Status</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="InProgress">InProgress</option>
                <option value="Completed">Completed</option>
              </select>
              <label>Job Assigned</label>
              <select
                value={editJob.jobAssigned || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, jobAssigned: e.target.value })
                }
                className="form-control mb-2"
              >
                <option value="Cancel">Cancel</option>
                <option value="ReAssign">ReAssign</option>
                <option value="Assigned">Assigned</option>
              </select>
            </div>
          )}
        </CModalBody>
        <CModalFooter className="modal-footer-custom">
          <CButton
            onClick={() => setShowEditModal(false)}
            color="secondary"
            className="modal-close-button"
          >
            Cancel
          </CButton>
          <CButton
            onClick={handleSaveEditJob}
            color="primary"
            className="modal-save-button"
          >
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default JobsManagement;
