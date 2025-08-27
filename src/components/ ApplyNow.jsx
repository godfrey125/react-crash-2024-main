import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaArrowLeft, FaMapMarker, FaUser, FaFileUpload, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ApplyNow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const job = useLoaderData();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    experience: '',
    education: '',
    skills: '',
    expectedSalary: '',
    availableStartDate: '',
    linkedinProfile: '',
    portfolioWebsite: ''
  });

  // File uploads state
  const [files, setFiles] = useState({
    resume: null,
    coverLetterFile: null,
    certificates: [],
    portfolio: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    
    if (name === 'certificates') {
      setFiles(prev => ({
        ...prev,
        certificates: Array.from(selectedFiles)
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        [name]: selectedFiles[0]
      }));
    }
  };

  // Remove certificate file
  const removeCertificate = (index) => {
    setFiles(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  // Form validation
  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'coverLetter'];
    const missing = required.filter(field => !formData[field].trim());
    
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(', ')}`);
      return false;
    }

    if (!files.resume) {
      toast.error('Please upload your resume');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const applicationData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        applicationData.append(key, formData[key]);
      });
      
      // Add job ID
      applicationData.append('jobId', id);
      
      // Add files
      if (files.resume) applicationData.append('resume', files.resume);
      if (files.coverLetterFile) applicationData.append('coverLetterFile', files.coverLetterFile);
      if (files.portfolio) applicationData.append('portfolio', files.portfolio);
      
      // Add certificates
      files.certificates.forEach((cert, index) => {
        applicationData.append(`certificate_${index}`, cert);
      });

      // Submit to backend (replace with your API endpoint)
      const response = await fetch(`/api/applications`, {
        method: 'POST',
        body: applicationData
      });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        navigate('/jobs');
      } else {
        throw new Error('Failed to submit application');
      }

    } catch (error) {
      console.error('Application submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>

      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            to={`/job/${id}`}
            className="text-indigo-500 hover:text-indigo-600 flex items-center"
          >
            <FaArrowLeft className='mr-2'/> Back to Job Details
          </Link>
        </div>
      </section>

      <section className="bg-indigo-50 min-h-screen">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-70/30 w-full gap-6">
            
           
            <main>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                  <FaPaperPlane className="text-indigo-600 text-2xl mr-3" />
                  <h1 className="text-3xl font-bold text-gray-900">Apply for this Position</h1>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
         
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-xl font-semibold text-indigo-800 mb-4">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                    </div>
     
                </form>
              </div>
            </main>

          
            <aside>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-indigo-800">Job Details</h3>
             
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};
   export default ApplyNow;
