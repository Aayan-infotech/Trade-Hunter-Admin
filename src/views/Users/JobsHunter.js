import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Usermanagement.css';

const JobsHuunter = () => {
  const { state } = useLocation();
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`http://54.236.98.193:7777/api/users/jobposts/${state._id}`);
        setJobData(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (state?._id) {
      fetchJobData();
    }
  }, [state]);

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`http://54.236.98.193:7777/api/jobs/${jobId}`);
      setJobData((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      alert('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete the job. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (jobData.length === 0) {
    return <div className="text-center mt-5">No data found for the provided ID.</div>;
  }

  return (
    <div className="jobs-hunter-wrapper">
      <div className="jobs-hunter-container">
        <div className="page-header card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white text-center">
            <h2 className="mb-0">Job Details</h2>
          </div>
        </div>
        {jobData.map((job) => (
          <div key={job._id} className="job-card card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary mb-2">
                <strong>{job.title}</strong>
              </h5>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <p className="mb-1"><strong>Location:</strong></p>
                  <p className="text-muted">{job.location?.jobaddress || 'N/A'}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <p className="mb-1"><strong>Estimated Budget:</strong></p>
                  <p className="text-muted">${job.estimatedBudget}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <p className="mb-1"><strong>Business Type:</strong></p>
                  <p className="text-muted">{job.businessType}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <p className="mb-1"><strong>Services:</strong></p>
                  <p className="text-muted">{job.services}</p>
                </div>
              </div>
              <div className="mb-2">
                <p className="mb-1"><strong>Requirements:</strong></p>
                <p className="text-muted">{job.requirements}</p>
              </div>
              <div className="timeframe mb-2">
                <p className="mb-1"><strong>Timeframe:</strong></p>
                <p className="text-muted">
                  {new Date(job.timeframe.from).toLocaleString()} to {new Date(job.timeframe.to).toLocaleString()}
                </p>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteJob(job._id)}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Job'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsHuunter;
