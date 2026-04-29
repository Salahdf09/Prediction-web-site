import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from '../components2/Navbar/Navbar.jsx'
import Hero from '../components2/Hero/Hero.jsx'
import About from '../components2/About us/About.jsx'
import Services from '../components2/Services/Services.jsx'
import HowItWorks from '../components2/How it works/HowItWorks.jsx'
import Feedback from '../components2/Feedback/Feedback.jsx'
import Contact from '../components2/Contact us/Contact.jsx'
import Footer from '../components2/Footer/Footer.jsx'

import SignUpChoice from '../pages2/SignUpChoice/SignUpChoice.jsx'
import SignUpStudent from './components/SignPages/SignUp/SignUpStudent.jsx'
import SignUpSchool from './components/SignPages/SignUp/SignUpSchool.jsx'
import SignUpParent from './components/SignPages/SignUp/SignUpParent.jsx'
import SignUpAdmin from './components/SignPages/SignUp/SignUpAdmin.jsx'
import Login from './components/SignPages/logIn/Login.jsx'
import StudentSettings from './components/Student/StudentSettings'
import StudentDashboard from './components/Student/StudentDashboard'
import ParentDashboard from './components/Parent/ParentDashboard.jsx'
import ParentSettings from './components/Parent/ParentSettings.jsx'
import SchoolDashboard from '../pages2/School/SchoolDashboard.jsx'
import AdminDashboard from '../pages2/Admin/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

function HomePage() {
  return (
    <div>
      <Navbar />
      <div id="home"><Hero /></div>
      <div id="about"><About /></div>
      <div id="services"><Services /></div>
      <HowItWorks />
      <div id="feedback"><Feedback /></div>
      <Contact />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<HomePage />} />
        <Route path="/signup-choice"   element={<SignUpChoice />} />
        <Route path="/signup/student"  element={<SignUpStudent />} />
        <Route path="/signup/school"   element={<SignUpSchool />} />
        <Route path="/signup/parent"   element={<SignUpParent />} />
        <Route path="/signup/admin"    element={<SignUpAdmin />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/settings" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentSettings />
          </ProtectedRoute>
        } />
        <Route path="/parent/dashboard" element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/parent/settings" element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentSettings />
          </ProtectedRoute>
        } />
        <Route path="/school" element={
          <ProtectedRoute allowedRoles={['school']}>
            <SchoolDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
