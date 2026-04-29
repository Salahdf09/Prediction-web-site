<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useRef } from 'react'

// Landing page components (friend's work)
import Navbar from './components/LandingPage/Navbar/Navbar.jsx'
import Hero from './components/LandingPage/Hero/Hero.jsx'
import About from './components/LandingPage/About us/About.jsx'
import Services from './components/LandingPage/Services/Services.jsx'
import HowItWorks from './components/LandingPage/How it works/HowItWorks.jsx'
import Contact from './components/LandingPage/Contact us/Contact.jsx'
import Footer from './components/LandingPage/Footer/Footer.jsx'

import SignUpStudent from './components/SignPages/SignUp/SignUpStudent.jsx'
import SignUpSchool from './components/SignPages/SignUp/SignUpSchool.jsx'
import SignUpParent from './components/SignPages/SignUp/SignUpParent.jsx'
import SignUpAdmin from './components/SignPages/SignUp/SignUpAdmin.jsx'
import Login from './components/SignPages/logIn/Login.jsx'
import StudentSettings from './components/Student/StudentSettings'

import './App.css'

function HomePage() {
  const containerRef = useRef(null)

  const handleWheel = (e) => {
    e.preventDefault()
    const container = containerRef.current
    container.scrollBy({
      top: e.deltaY > 0 ? window.innerHeight : -window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <div className="snap-container" ref={containerRef} onWheel={handleWheel}>
      <div className="snap-section">
        <Navbar />
        <Hero />
      </div>
      <div className="snap-section">
        <Navbar />
        <About />
      </div>
      <div className="snap-section">
        <Navbar />
        <Services />
      </div>
      <div className="snap-section">
        <Navbar />
        <HowItWorks />
      </div>
      <div className="snap-section">
        <Navbar />
        <Contact />
      </div>
      <div className="snap-section">
        <Footer />
      </div>
    </div>
  )
=======
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About us/About';
import Services from './components/Services/Services';
import HowItWorks from './components/How it works/HowItWorks';
import Contact from './components/Contact us/Contact';
import Footer from './components/Footer/Footer';
import SignUpChoice from './pages/SignUpChoice/SignUpChoice';
import SchoolDashboard from './pages/School/SchoolDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';



//import Feedback from './components/Feedback';


function LandingPage() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <HowItWorks />
      <Contact />
      <Footer />
    </div>
  );
>>>>>>> origin/prediction-_app--yousra-front
}

function App() {
  return (
<<<<<<< HEAD
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/signup/student" element={<SignUpStudent />} />
        <Route path="/signup/school"  element={<SignUpSchool />} />
        <Route path="/signup/parent"  element={<SignUpParent />} />
        <Route path="/signup/admin"   element={<SignUpAdmin />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/student/settings" element={<StudentSettings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
=======
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpChoice />} />
      <Route path="/school" element={<SchoolDashboard />} />
      <Route path="/signup/school" element={<SchoolDashboard />} /> 
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/signup/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
>>>>>>> origin/prediction-_app--yousra-front
