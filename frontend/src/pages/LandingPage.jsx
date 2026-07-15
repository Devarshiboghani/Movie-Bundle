import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiFileText, 
  FiShield, 
  FiZap, 
  FiGift, 
  FiTrendingUp, 
  FiStar,
  FiShoppingBag,
  FiLock
} from 'react-icons/fi';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Checkout Form State
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
          console.log("Products API Response:", response.data);
        setProducts(response.data);
        if (response.data.length > 0) {
          setSelectedProduct(response.data[0]); // default to first product
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

     if (!selectedProduct) {
    setErrorMessage("No product selected.");
    return;
  }

    if (!checkoutName || !checkoutEmail) {
      setErrorMessage('Please fill in both your Name and Email address.');
      return;
    }

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(checkoutEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/payment/create-session', {
        productId: selectedProduct._id,
        customerName: checkoutName,
        customerEmail: checkoutEmail
      });

      if (response.data.url) {
        // Redirect to Stripe or Sandbox simulation
        window.location.href = response.data.url;
      } else {
        setErrorMessage('Failed to initiate checkout. Please try again.');
      }
    } catch (err) {
      console.error('Checkout creation error:', err);
      setErrorMessage(err.response?.data?.message || 'Server error initiating checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    // Smooth scroll to pricing
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner message="Loading the Digital Hub..." />;
  }

  // Backup Mock Product if DB is empty
  const defaultProduct = {
    name: 'The Ultimate Full-Stack Developer Kit (eBook + Templates)',
    description: 'Master React, Node.js, and System Architecture with our copy-paste starter kits, 300+ pages of high-resolution concepts, and modular microservice blueprints.',
    price: 19.99,
    features: [
      '300+ Page High-Resolution eBook (PDF)',
      '12 Production-Ready Code Templates',
      'Advanced CSS/Tailwind Styling Guides',
      'Secure Authentication Boilerplates',
      'Lifetime Free Updates & Add-ons',
      'Private Discord Access Channel'
    ]
  };

  const currentProduct = selectedProduct || defaultProduct;

  return (
    <div>
      {/* Background glow elements */}
      <div className="glow-ambient text-primary" style={{ top: '10%', left: '15%', width: '300px', height: '300px', background: 'rgba(99,102,241,0.15)' }}></div>
      <div className="glow-ambient text-secondary" style={{ top: '40%', right: '10%', width: '400px', height: '400px', background: 'rgba(168,85,247,0.12)' }}></div>

      {/* HERO SECTION */}
      <section className="py-5 py-md-7 text-center position-relative">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <span className="badge-premium mb-3 d-inline-block">
                ⚡ INSTANT DIGITAL DELIVERY
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-4 display-font lh-sm">
                Scale Your Coding with the <br />
                <span className="text-gradient-primary">Ultimate Developer Bundle</span>
              </h1>
              <p className="lead text-white-50 mb-5 mx-auto max-width-xl px-lg-5" style={{ maxWidth: '750px', fontSize: '1.2rem' }}>
                Gain master-level developer skills in React, Node, and Web Security. Get access to premium modular boilerplate kits, deep-dive eBooks, and production secrets.
              </p>
              
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <a href="#pricing" className="btn btn-premium-primary d-flex align-items-center justify-content-center gap-2 px-4 py-3">
                  Get the Bundle Now <FiArrowRight />
                </a>
                <a href="#contents" className="btn btn-premium-secondary d-flex align-items-center justify-content-center gap-2 px-4 py-3">
                  Explore Contents
                </a>
              </div>

              {/* Minimal social proof */}
              <div className="mt-5 pt-3 d-flex justify-content-center align-items-center gap-4 flex-wrap text-white-50">
                <div className="d-flex align-items-center gap-1">
                  <FiCheckCircle className="text-success" /> Trusted by 5,000+ Devs
                </div>
                <div className="d-flex align-items-center gap-1">
                  <FiShield className="text-primary" /> Secure Stripe Checkout
                </div>
                <div className="d-flex align-items-center gap-1">
                  <FiZap className="text-warning" /> Immediate PDF Download
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC PRODUCTS SECTION (If uploaded by Admin) */}
      {products.length > 1 && (
        <section className="py-5" id="products">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="text-gradient-primary mb-2">Available Digital Bundles</h2>
              <p className="text-white-50">Choose the custom digital product tailored to your career goal.</p>
            </div>
            <div className="row g-4 justify-content-center">
              {products.map((p) => (
                <div className="col-md-6 col-lg-4" key={p._id}>
                  <div className={`glass-card h-100 p-4 d-flex flex-column ${selectedProduct?._id === p._id ? 'border-primary' : ''}`}>
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt={p.name} className="img-fluid rounded mb-3" style={{ maxHeight: '180px', objectFit: 'cover' }} />
                    ) : (
                      <div className="d-flex justify-content-center align-items-center bg-dark rounded mb-3 text-secondary" style={{ height: '150px' }}>
                        <FiFileText size={48} />
                      </div>
                    )}
                    <h4 className="h5 text-white mb-2">{p.name}</h4>
                    <p className="text-white-50 small mb-4 flex-grow-1">{p.description.substring(0, 120)}...</p>
                    <div className="d-flex align-items-center justify-content-between mt-auto">
                      <span className="fs-4 fw-bold text-gradient-primary">${p.price.toFixed(2)}</span>
                      <button className="btn btn-premium-primary btn-sm px-3" onClick={() => handleSelectProduct(p)}>
                        Select Kit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HIGHLIGHTS SECTION */}
      <section className="py-5 position-relative" id="highlights">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-5 text-white mb-3">Why Developers Love This Bundle</h2>
            <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
              We skip the fluff. Get straight to actionable architecture guides, clear code boilerplates, and clean explanations.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded d-inline-block mb-3">
                  <FiFileText size={24} />
                </div>
                <h4 className="text-white mb-3">Actionable Blueprints</h4>
                <p className="text-white-50 mb-0">
                  Comprehensive 300+ page eBook layout explaining key database indexes, system patterns, and advanced API designs.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="bg-purple bg-opacity-10 text-purple p-3 rounded d-inline-block mb-3" style={{ color: 'var(--color-secondary)' }}>
                  <FiZap size={24} />
                </div>
                <h4 className="text-white mb-3">Modular Boilerplates</h4>
                <p className="text-white-50 mb-0">
                  Copy-paste React states, custom hooks, Axios connection rules, and server configurations to launch projects in minutes.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="bg-success bg-opacity-10 text-success p-3 rounded d-inline-block mb-3">
                  <FiShield size={24} />
                </div>
                <h4 className="text-white mb-3">Production Guard</h4>
                <p className="text-white-50 mb-0">
                  Learn to implement production JWT auth, CORS restrictions, rate limiting, and Stripe webhooks safely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUNDLE CONTENTS */}
      <section className="py-5" id="contents">
        <div className="container py-4">
          <div className="glass-card-no-hover p-4 p-md-5">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <span className="badge-premium mb-3 d-inline-block">INSIDE THE DIGITAL BUNDLE</span>
                <h2 className="display-6 text-white mb-4">What's Included in Your Purchase</h2>
                <p className="text-white-50 mb-4">
                  Everything you need to level up your development capabilities. No subscriptions, no hidden limits. Buy once, download and own forever.
                </p>
                <div className="row g-3">
                  <div className="col-sm-6 d-flex align-items-center gap-2">
                    <FiCheckCircle className="text-primary flex-shrink-0" /> <span>eBook PDF Document</span>
                  </div>
                  <div className="col-sm-6 d-flex align-items-center gap-2">
                    <FiCheckCircle className="text-primary flex-shrink-0" /> <span>Production Boilerplates</span>
                  </div>
                  <div className="col-sm-6 d-flex align-items-center gap-2">
                    <FiCheckCircle className="text-primary flex-shrink-0" /> <span>Code Snippets Toolkit</span>
                  </div>
                  <div className="col-sm-6 d-flex align-items-center gap-2">
                    <FiCheckCircle className="text-primary flex-shrink-0" /> <span>System Architecture files</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="bg-dark bg-opacity-50 p-4 rounded-4 border border-secondary">
                  <h4 className="text-white mb-4 d-flex align-items-center gap-2">
                    <FiGift className="text-warning" /> Bundle Checklist
                  </h4>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                    <li className="d-flex align-items-start gap-3">
                      <span className="badge bg-secondary mt-1">CH 1-5</span>
                      <div>
                        <h6 className="text-white mb-0">React State Management & Performance</h6>
                        <p className="text-white-50 small mb-0">Custom hooks, Context API tuning, memoization, and rendering optimization.</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-3">
                      <span className="badge bg-secondary mt-1">CH 6-10</span>
                      <div>
                        <h6 className="text-white mb-0">Express API Architectures & Security</h6>
                        <p className="text-white-50 small mb-0">JWT session rules, database connections, rate limiting, and payload checks.</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-3">
                      <span className="badge bg-secondary mt-1">CH 11-14</span>
                      <div>
                        <h6 className="text-white mb-0">Secure Stripe Payment Integrations</h6>
                        <p className="text-white-50 small mb-0">Checkout portals, webhooks verification, and dynamic order delivery rules.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & CHECKOUT SECTION */}
      <section className="py-5" id="pricing">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-7">
              <div className="text-center mb-5">
                <h2 className="display-6 text-white mb-2">Secure Premium Access</h2>
                <p className="text-white-50">Unlock the files instantly. Get direct email delivery immediately after checkout.</p>
              </div>

              {/* PRICING CARD */}
              <div className="glass-card-no-hover p-4 p-md-5 border border-primary border-opacity-50 position-relative shadow-lg">
                <div className="position-absolute top-0 end-0 translate-middle-y me-4">
                  <span className="badge bg-danger px-3 py-2 rounded-pill fs-6 fw-bold">60% OFF - TODAY ONLY</span>
                </div>

                <div className="text-center mb-4">
                  <h3 className="h5 text-white-50 text-uppercase tracking-wider mb-2">SELECTED PACKAGE</h3>
                  <h4 className="h3 text-white mb-3" style={{ fontSize: '1.75rem' }}>{currentProduct.name}</h4>
                  
                  <div className="d-flex justify-content-center align-items-center gap-3 my-4">
                    <span className="text-decoration-line-through text-white-50 fs-4">$49.99</span>
                    <span className="display-4 fw-extrabold text-gradient-primary display-font">${currentProduct.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checked features list */}
                <div className="row g-2 justify-content-center mb-4">
                  <div className="col-md-10">
                    <ul className="list-unstyled d-flex flex-column gap-2">
                      {currentProduct.features && currentProduct.features.map((feat, idx) => (
                        <li key={idx} className="d-flex align-items-center gap-2 text-white-80">
                          <FiCheckCircle className="text-success flex-shrink-0" /> <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* SECURE CHECKOUT FORM */}
                <div className="bg-dark bg-opacity-60 p-4 rounded-3 border border-secondary mt-4">
                  <h4 className="h5 text-white mb-3 d-flex align-items-center gap-2 justify-content-center">
                    <FiLock className="text-primary" /> Complete Secure Checkout
                  </h4>

                  {errorMessage && (
                    <div className="alert alert-danger py-2 text-center" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleCheckoutSubmit}>
                    <div className="mb-3">
                      <label htmlFor="customerName" className="form-label small text-white-50">Full Name</label>
                      <input
                        type="text"
                        className="form-control form-glass"
                        id="customerName"
                        placeholder="John Doe"
                        value={checkoutName}
                        onChange={(e) => setCheckoutName(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="customerEmail" className="form-label small text-white-50">Email Address (For eBook Delivery)</label>
                      <input
                        type="email"
                        className="form-control form-glass"
                        id="customerEmail"
                        placeholder="john@example.com"
                        value={checkoutEmail}
                        onChange={(e) => setCheckoutEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                      <div className="form-text text-white-50" style={{ fontSize: '0.75rem' }}>
                        Double check your email: the secure download link is sent here immediately.
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-premium-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-5 mt-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Initializing Checkout...
                        </>
                      ) : (
                        <>
                          <FiShoppingBag /> Purchase & Download Instantly
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="py-5" id="testimonials">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 text-white mb-2">What Other Developers Say</h2>
            <p className="text-white-50">Real feedback from developers, designers, and creators.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="glass-card p-4">
                <div className="d-flex gap-1 text-warning mb-3">
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                </div>
                <p className="text-white-80 italic mb-4">
                  "The React components templates saved me at least two weeks of writing setups from scratch. The PDF code explanations are clean and direct."
                </p>
                <div>
                  <h6 className="text-white mb-0">Devin Cole</h6>
                  <small className="text-white-50">Senior Frontend Engineer</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4">
                <div className="d-flex gap-1 text-warning mb-3">
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                </div>
                <p className="text-white-80 italic mb-4">
                  "I bought this bundle specifically to learn about secure Node.js streaming and Stripe setups. It is incredibly practical. Highly recommended."
                </p>
                <div>
                  <h6 className="text-white mb-0">Elena Rostova</h6>
                  <small className="text-white-50">Full Stack Developer</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4">
                <div className="d-flex gap-1 text-warning mb-3">
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                  <FiStar fill="currentColor" />
                </div>
                <p className="text-white-80 italic mb-4">
                  "The checkout was smooth, and the download email landed in my inbox within 5 seconds. Extremely satisfying user experience."
                </p>
                <div>
                  <h6 className="text-white mb-0">Rahul Sharma</h6>
                  <small className="text-white-50">Indie Hacker & Creator</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs SECTION */}
      <section className="py-5" id="faq">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="display-6 text-white mb-2">Frequently Asked Questions</h2>
                <p className="text-white-50">Got questions? We've got answers.</p>
              </div>

              <div className="accordion accordion-flush" id="faqAccordion">
                <div className="accordion-item accordion-glass-item">
                  <h3 className="accordion-header" id="faq-h1">
                    <button className="accordion-button collapsed accordion-glass-header" type="button" data-bs-toggle="collapse" data-bs-target="#faq-c1" aria-expanded="false" aria-controls="faq-c1">
                      How will I receive the digital bundle?
                    </button>
                  </h3>
                  <div id="faq-c1" className="accordion-collapse collapse" aria-labelledby="faq-h1" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-white-50 pt-1">
                      Immediately after a successful checkout, our system creates your order and sends an automated confirmation email. This email contains a secure, unique, and non-shareable download link for your PDF eBook files.
                    </div>
                  </div>
                </div>

                <div className="accordion-item accordion-glass-item">
                  <h3 className="accordion-header" id="faq-h2">
                    <button className="accordion-button collapsed accordion-glass-header" type="button" data-bs-toggle="collapse" data-bs-target="#faq-c2" aria-expanded="false" aria-controls="faq-c2">
                      Is the download link protected?
                    </button>
                  </h3>
                  <div id="faq-c2" className="accordion-collapse collapse" aria-labelledby="faq-h2" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-white-50 pt-1">
                      Yes! The download link uses a secure cryptographically secure token. It verifies payment confirmation directly in our MongoDB database and tracks download history (IP and Timestamp) to protect the eBook from unauthorized sharing.
                    </div>
                  </div>
                </div>

                <div className="accordion-item accordion-glass-item">
                  <h3 className="accordion-header" id="faq-h3">
                    <button className="accordion-button collapsed accordion-glass-header" type="button" data-bs-toggle="collapse" data-bs-target="#faq-c3" aria-expanded="false" aria-controls="faq-c3">
                      Can I read the eBook on any device?
                    </button>
                  </h3>
                  <div id="faq-c3" className="accordion-collapse collapse" aria-labelledby="faq-h3" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-white-50 pt-1">
                      Absolutely. The eBook is delivered in standard PDF format, compatible with Kindle, iPads, tablets, laptops, phones, and PDF readers.
                    </div>
                  </div>
                </div>

                <div className="accordion-item accordion-glass-item">
                  <h3 className="accordion-header" id="faq-h4">
                    <button className="accordion-button collapsed accordion-glass-header" type="button" data-bs-toggle="collapse" data-bs-target="#faq-c4" aria-expanded="false" aria-controls="faq-c4">
                      What payment gateways are supported?
                    </button>
                  </h3>
                  <div id="faq-c4" className="accordion-collapse collapse" aria-labelledby="faq-h4" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-white-50 pt-1">
                      We support Stripe Checkout which accepts Visa, Mastercard, American Express, Apple Pay, and Google Pay. If Stripe credentials are not active on the server, a developer payment sandbox is triggered automatically to test the checkout.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-6 text-center position-relative">
        <div className="container py-4">
          <div className="glass-card-no-hover p-5 border border-primary border-opacity-25" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.08) 100%)' }}>
            <h2 className="display-5 text-white mb-3">Ready to Accelerate Your Career?</h2>
            <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
              Grab the full kit today with a lifetime of free updates and immediate secure delivery.
            </p>
            <a href="#pricing" className="btn btn-premium-primary btn-lg px-4 py-3 d-inline-flex align-items-center gap-2">
              Purchase Instant Access <FiShoppingBag />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
