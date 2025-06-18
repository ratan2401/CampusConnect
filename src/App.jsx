import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'



import Home from './pages/Home';

import ShareXP from './pages/ShareXP';
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Create from "./pages/Create";
import React from 'react';


import './styles.css';
import './App.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<Router>
      
      
      
      <Routes>
      <Route path="/" element={<ShareXP />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} /> {/* Login Route */}
          <Route path="/register" element={<Register />} /> {/* Register Route */}
          <Route path="/search" element={<Search />} /> {/* Search Route */}
          <Route path="/create" element={<Create />} /> {/* Create Route */}
  

        
        
         {/* <Route path="/auth" element={<Auth />} />
        
        <Route path="/CreateXP" element={<CreateXP />} />
        <Route path="/LoginXP" element={<LoginXP />} />
        <Route path="/Search" element={<Search />} />  */}
      </Routes>
    </Router>
    </>
  )






  // return (
  //   <>
  //     {/* Navigation Bar */}
  //     <nav className="navbar">
  //       <div className="logo">Mitr</div>
  //       <ul className="nav-links">
  //         <li><a href="#">Home</a></li>
  //         <li><a href="#features">Features</a></li>
  //         <li><a href="#about">About Us</a></li>
  //         <li><a href="#contact">Contact</a></li>
  //       </ul>
  //     </nav>

  //     {/* Hero Section */}
  //     <section className="hero">
  //       <div className="hero-content">
  //         <h1>स्वागत है! Welcome to Mitr</h1>
  //         <p>Connect with friends and communities across India.</p>
  //         <div className="cta-buttons">
  //           <button className="join-btn">Join Mitr</button>
  //           <button className="login-btn">Log In</button>
  //         </div>
  //       </div>
  //     </section>

  //     {/* Features Section */}
  //     <section id="features" className="features">
  //       <h2>Why Choose Mitr?</h2>
  //       <div className="feature-cards">
  //         <div className="card">
  //           <span className="icon">🌟</span>
  //           <h3>Personalized Feeds</h3>
  //           <p>Content tailored specifically for you.</p>
  //         </div>

  //         <div className="card">
  //           <span className="icon">🔒</span>
  //           <h3>Privacy First</h3>
  //           <p>Your data, your control.</p>
  //         </div>

  //         <div className="card">
  //           <span className="icon">📸</span>
  //           <h3>Multimedia Sharing</h3>
  //           <p>Share your moments through photos and videos.</p>
  //         </div>

  //         <div className="card">
  //           <span className="icon">💬</span>
  //           <h3>Real-time Messaging</h3>
  //           <p>Stay connected instantly with friends.</p>
  //         </div>

  //         <div className="card">
  //           <span className="icon">👥</span>
  //           <h3>Community Groups</h3>
  //           <p>Join groups based on your interests.</p>
  //         </div>
  //       </div>
  //     </section>

  //     {/* Testimonials Section */}
  //     <section id="about" className="testimonials">
  //       <h2>What Our Users Say</h2>

  //       <div className="testimonial-card">
  //         <p>"Mitr helped me reconnect with old friends and discover new communities. Truly amazing!"</p>
  //         <h4>- Anjali, Mumbai</h4>
  //       </div>

  //       <div className="testimonial-card">
  //         <p>"The privacy features are excellent. I feel safe sharing my thoughts."</p>
  //         <h4>- Rahul, Bengaluru</h4>
  //       </div>

  //       <div className="testimonial-card">
  //         <p>"I love how seamless multimedia sharing is. Highly recommended!"</p>
  //         <h4>- Priya, Delhi</h4>
  //       </div>

  //     </section>

  //     {/* Footer/Contact */}
  //     <footer id="contact" className="footer">
  //       ©2025 Mitr. Made with ❤️ in India.
  //     </footer>

  //   </>
  // );
}

export default App;

