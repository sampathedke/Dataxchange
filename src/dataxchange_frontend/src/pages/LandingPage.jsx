// src/pages/LandingPage.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/landing.css';
import AnimatedButton from '../components/AnimatedButton';

export default function LandingPage() {
  const { iiPrincipal, loginII } = useContext(UserContext);
  const navigate = useNavigate();

  const handleProtectedNavigate = async (path) => {
    if (!iiPrincipal) {
      const loggedIn = await loginII();
      if (loggedIn) {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        {/* <img src="/public/logo1.png" alt="Hero visual" className="hero-image" /> */}
      <h1 className="main-heading"> DataXchange</h1>
        <p className="sub-heading">
          Secure, decentralized data marketplace on Internet Computer Protocol (ICP).
        </p>
        <p className="hero-subtext">Connect. Share. Profit. With zero intermediaries.</p>
      {/* <button className="primary-cta" onClick={() => handleProtectedNavigate("/explore")}>
          Explore Datasets
        </button> */}
        <AnimatedButton className="primary-cta" onClick={() => handleProtectedNavigate("/explore")}>Explore</AnimatedButton>

      </section>

  

      {/* Why DataXchange Section */}
        <section className="info-section">
        <h2>Why DataXchange?</h2>
        <div className="info-cards">
          <div className="card">
            <img src="/public/secure.png" alt="Secure" />
            <h3>On-Chain Access</h3>
            <p>Built fully on Internet Computer with no central server.</p>
          </div>
          <div className="card">
            <img src="/public/finances.png" alt="Fast" />
            <h3>Plug-Free Payments</h3>
            <p>Manual ICP transfers with full transparency.</p>
          </div>
          <div className="card">
            <img src="/public/decentralized.png" alt="Decentralized" />
            <h3>Canister Storage</h3>
            <p>Resilient storage with tamper-proof datasets.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <h3>1. Upload</h3>
            <p>Dataset providers upload data with title,category, and price.</p>
          </div>
          <div className="step-card">
            <h3>2. Mint Canister</h3>
            <p>Smart contract saves metadata & access rules in decentralized storage.</p>
          </div>
          <div className="step-card">
            <h3>3.Request Access</h3>
            <p>Buyers request datasets and pay off-chain.</p>
          </div>
          <div className="step-card">
            <h3>4.Approve & Access</h3>
          <p>Seller approves access after manual payment.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div>
            <p>"DataXchange helped me monetize my datasets with ease!"</p>
            <strong>— AI Researcher</strong>
          </div>
          <div>
            <p>"Buying data was instant — no red tape, just results."</p>
            <strong>— Startup Developer</strong>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <h2>FAQs</h2>
        <div className="faq-item">
          <h4>How do I upload a dataset?</h4>
          <p>Login with Internet Identity → Upload → Done. No middleman.</p>
        </div>
        <div className="faq-item">
          <h4>How are payments verified?</h4>
          <p>Off-chain ICP payment → Seller confirms → On-chain approval.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Get Started?</h2>
         <button className="primary-cta" onClick={() => handleProtectedNavigate("/upload")}>
          Upload Dataset
        </button>
            </section>
    </div>
  );
}
