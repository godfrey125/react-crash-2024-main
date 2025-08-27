import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import JobListing from './JobListing'; 
import { Link } from 'react-router-dom';// Assuming you create this component

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchJobs = async () => {
      const apiUrl = isHome ? '/api/jobs?_limit=3' : '/api/jobs';
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.log('Error fetching data', error);
        setError(error.message); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isHome]); // Include isHome in the dependency array

  return (
    <section className='bg-blue-50 px-4 py-10'>
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? 'Recent Jobs' : 'Browse Jobs'}
        </h2>
        <Link
           to={`/apply/${jobs.id}`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
           Apply Now
           </Link>

        {loading ? (
          <Spinner loading={loading} />
        ) : error ? ( // Display error message if there's an error
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobListing key={job.id} job={job} /> // Use JobListing component
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
