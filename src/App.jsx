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
}

function App() {
  return (
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
