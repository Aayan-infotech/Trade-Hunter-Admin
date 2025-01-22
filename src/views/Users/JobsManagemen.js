import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const JobsManagemen = () => {
  const { state } = useLocation(); // Access the passed state from `navigate`
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`http://44.196.64.110:7777/api/users/jobposts/${state._id}`);
        setJobData(response.data?.data || []); // Set jobData to the array of jobs
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

  const getStatusBadge = (status) => {
    let badgeClass = '';
    switch (status) {
      case 'pending':
        badgeClass = 'bg-success';
        break;
      case 'In Progress':
        badgeClass = 'bg-warning';
        break;
      case 'Closed':
        badgeClass = 'bg-danger';
        break;
      default:
        badgeClass = 'bg-secondary';
        break;
    }
    return <span className={`badge ${badgeClass} text-white`}>{status}</span>;
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (jobData.length === 0) {
    return <div className="text-center mt-5">No job listings from Hunter at the moment.</div>;
  }

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingTop: '20px' }}>
      <div className="container">
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white text-center">
            <h2>Job Details</h2>
          </div>
        </div>
        {jobData.map((job) => (
          <div key={job._id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary mb-2"><strong>{job.title}</strong></h5>
              <div className="row">
                <div className="col-md-4 mb-2">
                  <p className="mb-1"><strong>Location:</strong></p>
                  <p className="text-muted">{job.location?.jobaddress || 'N/A'}</p>
                </div>
                <div className="col-md-4 mb-2">
                  <p className="mb-1"><strong>Estimated Budget:</strong></p>
                  <p className="text-muted">${job.estimatedBudget}</p>
                </div>
                <div className="col-md-4 mb-2">
                  <p className="mb-1"><strong>Service Type:</strong></p>
                  <p className="text-muted">{job.serviceType}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-2">
                  <p className="mb-1"><strong>Service:</strong></p>
                  <p className="text-muted">{job.service}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-1"><strong>Requirements:</strong></p>
                  <p className="text-muted">{job.requirements}</p>
                </div>
                <div className="col-lg-4">
                  <p className="mb-1"><strong>Timeframe:</strong></p>
                  <p className="text-muted">
                    {new Date(job.timeframe.from).toLocaleString()} to {new Date(job.timeframe.to).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className='row gy-2'>

                <div className="col-lg-6">
                  <p className="mb-1"><strong>Job Status:</strong></p>
                  <span className="fs-5">{getStatusBadge(job.jobStatus)}</span>

                </div>
              </div>


            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsManagemen;
