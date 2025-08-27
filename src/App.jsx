// Alternative version if you don't have a backend API
import { 
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
import JobPage, { jobLoader } from './pages/JobPage';
import AddJobPage from './pages/AddJobPage';
import AboutUs from './pages/AboutUs';
import EditJobPage from './pages/EditJobPage';
import ApplyNow, { jobLoader } from './pages/ApplyNow';

const App = () => {
  // Mock data for development - replace with real API later
  const [jobs, setJobs] = useState([
    {
      id: '1',
      title: 'React Developer',
      type: 'Full-Time',
      location: 'Dar es Salaam',
      description: 'We are looking for a skilled React developer...',
      salary: '$70K - 80K',
      company: {
        name: 'Tech Solutions TZ',
        description: 'Leading tech company in Tanzania',
        contactEmail: 'hr@techsolutions.co.tz',
        contactPhone: '+255 123 456 789'
      }
    }
  ]);

  // Add new Job - Mock version
  const addJob = async (newJob) => {
    try {
      console.log('Adding job:', newJob);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new job with ID
      const jobWithId = {
        ...newJob,
        id: Date.now().toString() // Simple ID generation
      };
      
      // Update state
      setJobs(prevJobs => [...prevJobs, jobWithId]);
      
      console.log('Job added successfully:', jobWithId);
      return jobWithId;

    } catch (error) {
      console.error('Error adding job:', error);
      throw error;
    }
  };

  // Delete job - Mock version
  const deleteJob = async (id) => {
    try {
      console.log('Deleting job:', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      
      console.log('Job deleted successfully');
      return;

    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Update job - Mock version
  const updateJob = async (updatedJob) => {
    try {
      console.log('Updating job:', updatedJob);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update state
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === updatedJob.id ? updatedJob : job
        )
      );
      
      console.log('Job updated successfully:', updatedJob);
      return updatedJob;

    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='/jobs' element={<JobsPage jobs={jobs} />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='/add-job' element={<AddJobPage addJobSubmit={addJob} />} />
        <Route path='/jobs/:id' element={<JobPage deleteJob={deleteJob} jobs={jobs} />} loader={jobLoader} />
        <Route path='/edit-jobs/:id' element={<EditJobPage updateJobSubmit={updateJob} />} loader={jobLoader} />
        <Route path='/apply/:id' element={<ApplyNow />} loader={jobLoader} />

  
  
 
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    ) 
  );
  
  return <RouterProvider router={router} />;
}

export default App;