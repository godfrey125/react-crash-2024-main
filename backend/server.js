const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow specific file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// In-memory storage (replace with database in production)
let jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    type: "Full-Time",
    location: "Dar es Salaam, Tanzania",
    description: "We are seeking a talented Frontend Developer to join our dynamic team. You will be responsible for creating engaging user interfaces and ensuring optimal user experience across our web applications.",
    salary: "$40,000 - $50,000",
    company: {
      name: "Tech Solutions Ltd",
      description: "Leading technology company in East Africa specializing in web development and digital solutions.",
      contactEmail: "hr@techsolutions.co.tz",
      phone: "+255 123 456 789"
    },
    datePosted: new Date().toISOString()
  },
  {
    id: 2,
    title: "Marketing Manager",
    type: "Full-Time",
    location: "Arusha, Tanzania",
    description: "Join our marketing team as a Marketing Manager. You'll develop and execute marketing strategies to promote our services across East Africa.",
    salary: "$35,000 - $45,000",
    company: {
      name: "Safari Marketing Co",
      description: "Creative marketing agency specializing in tourism and hospitality sectors.",
      contactEmail: "careers@safarimarketing.co.tz",
      phone: "+255 987 654 321"
    },
    datePosted: new Date().toISOString()
  }
];

let applications = [];

// Routes

// Get all jobs
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

// Get single job
app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === parseInt(req.params.id));
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

// Create new job
app.post('/api/jobs', (req, res) => {
  const newJob = {
    id: jobs.length + 1,
    ...req.body,
    datePosted: new Date().toISOString()
  };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

// Update job
app.put('/api/jobs/:id', (req, res) => {
  const jobIndex = jobs.findIndex(j => j.id === parseInt(req.params.id));
  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  jobs[jobIndex] = {
    ...jobs[jobIndex],
    ...req.body,
    id: parseInt(req.params.id)
  };
  
  res.json(jobs[jobIndex]);
});

// Delete job
app.delete('/api/jobs/:id', (req, res) => {
  const jobIndex = jobs.findIndex(j => j.id === parseInt(req.params.id));
  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  jobs.splice(jobIndex, 1);
  res.json({ message: 'Job deleted successfully' });
});

// Submit job application
app.post('/api/applications', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetterFile', maxCount: 1 },
  { name: 'portfolio', maxCount: 1 },
  { name: 'certificate_0', maxCount: 1 },
  { name: 'certificate_1', maxCount: 1 },
  { name: 'certificate_2', maxCount: 1 },
  { name: 'certificate_3', maxCount: 1 },
  { name: 'certificate_4', maxCount: 1 }
]), (req, res) => {
  try {
    const applicationData = {
      id: applications.length + 1,
      jobId: parseInt(req.body.jobId),
      personalInfo: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone
      },
      professionalInfo: {
        coverLetter: req.body.coverLetter,
        experience: req.body.experience,
        education: req.body.education,
        skills: req.body.skills,
        expectedSalary: req.body.expectedSalary,
        availableStartDate: req.body.availableStartDate,
        linkedinProfile: req.body.linkedinProfile,
        portfolioWebsite: req.body.portfolioWebsite
      },
      files: {
        resume: req.files.resume ? req.files.resume[0].filename : null,
        coverLetterFile: req.files.coverLetterFile ? req.files.coverLetterFile[0].filename : null,
        portfolio: req.files.portfolio ? req.files.portfolio[0].filename : null,
        certificates: []
      },
      applicationDate: new Date().toISOString(),
      status: 'pending'
    };

    // Handle multiple certificates
    Object.keys(req.files).forEach(key => {
      if (key.startsWith('certificate_')) {
        applicationData.files.certificates.push(req.files[key][0].filename);
      }
    });

    applications.push(applicationData);

    // Log application submission (replace with email notification in production)
    console.log('New application received:', {
      applicant: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
      email: applicationData.personalInfo.email,
      jobId: applicationData.jobId,
      files: Object.keys(req.files)
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: applicationData.id
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
});

// Get all applications (for admin)
app.get('/api/applications', (req, res) => {
  res.json(applications);
});

// Get applications for a specific job
app.get('/api/applications/job/:jobId', (req, res) => {
  const jobApplications = applications.filter(app => app.jobId === parseInt(req.params.jobId));
  res.json(jobApplications);
});

// Get single application
app.get('/api/applications/:id', (req, res) => {
  const application = applications.find(app => app.id === parseInt(req.params.id));
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json(application);
});

// Update application status
app.patch('/api/applications/:id/status', (req, res) => {
  const applicationIndex = applications.findIndex(app => app.id === parseInt(req.params.id));
  if (applicationIndex === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  applications[applicationIndex].status = req.body.status;
  res.json(applications[applicationIndex]);
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Ajira Link API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: error.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Ajira Link API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💼 Jobs endpoint: http://localhost:${PORT}/api/jobs`);
  console.log(`📄 Applications endpoint: http://localhost:${PORT}/api/applications`);
});

module.exports = app;