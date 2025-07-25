import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/application/recruiter/applications', {
          withCredentials: true,
        });
        setApplications(response.data.applications);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Job Applications Received</h2>
      {applications.length === 0 ? (
        <p>No applications received yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="border p-4 rounded shadow-md">
              <p><strong>Job Title:</strong> {app.jobId?.title}</p>
              <p><strong>Applicant:</strong> {app.applicantId?.name}</p>
              <p><strong>Email:</strong> {app.applicantId?.email}</p>
              <p><strong>Phone:</strong> {app.phone}</p>
              {app.applicantId?.profile?.resume && (
                <a
                  href={app.applicantId.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Resume
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;
