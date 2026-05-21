import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import BlogPreview from './components/BlogPreview';
import Appointment from './components/Appointment';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BlogDetail from './components/BlogDetail';
import AdminLogin from './components/Admin/Login';
import AdminDashboard from './components/Admin/Dashboard';
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <Navbar />
      <main>
        <Hero onCTAClick={() => navigate('/admin/login')} />
        <Services />
        <About />
        <Testimonials />
        <Gallery />
        <BlogPreview />
        <Appointment />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
