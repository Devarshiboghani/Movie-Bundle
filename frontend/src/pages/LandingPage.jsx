import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import heroImg from '../assets/hero.png';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiZap, 
  FiShield, 
  FiShoppingBag,
  FiLock,
  FiClock,
  FiAward,
  FiVideo,
  FiTrendingUp,
  FiUserCheck,
  FiHelpCircle,
  FiPlus,
  FiMinus
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

  // Evergreen Countdown Timer State (15 minutes)
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [showStickyBar, setShowStickyBar] = useState(false);

  // FAQ Expand state
  const [openFaq, setOpenFaq] = useState({});

  const toggleFaq = (index) => {
    setOpenFaq(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 900; // Reset to 15 minutes (evergreen)
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll visibility for sticky bottom bar
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom < 0) {
          setShowStickyBar(true);
        } else {
          setShowStickyBar(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const timeFormatted = formatTime(timeLeft);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedProduct && products.length > 0) {
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
      const productIdToSend = selectedProduct ? selectedProduct._id : 'default-movie-bundle-id';
      const response = await api.post('/payment/create-session', {
        productId: productIdToSend,
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

  const scrollToCheckout = () => {
    const element = document.getElementById('checkout-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Default fallback product if database is empty
  const defaultProduct = {
    name: '6000+ Viral Movie Clips Bundle (Full Package)',
    description: 'अपने Facebook Page/YouTube को Viral करें और Monetize करें हमारे 6000+ Viral Movie Clips Bundle के साथ 30 दिनों में।',
    price: 149,
    features: [
      'Hindi Movie Clips (2025/2026)',
      'South Dubbed Movie Clips',
      'Action Movie Clips',
      'Old 90s Movie Clips',
      'Romantic Movie Clips',
      'Horror Movie Clips',
      'Web Series Clips',
      '1000+ Pre Made Video Titles (English & Hindi)',
      '1000+ Viral Facebook Hashtags (2026)',
      'Facebook Viral Course A to Z (2025/2026)',
      'Best For Beginner with Step-by-Step Guide',
      '100% Copyright Free on FB & YouTube',
      'Direct Upload Without Editing'
    ]
  };

  const currentProduct = selectedProduct || defaultProduct;

  return (
    <div className="position-relative overflow-hidden pb-5">
      {/* Background glow elements */}
      <div className="glow-ambient text-danger" style={{ top: '5%', left: '5%', width: '400px', height: '400px', background: 'rgba(255,0,0,0.12)' }}></div>
      <div className="glow-ambient text-warning" style={{ top: '35%', right: '5%', width: '500px', height: '500px', background: 'rgba(255,204,0,0.08)' }}></div>
      <div className="glow-ambient text-danger" style={{ bottom: '20%', left: '10%', width: '400px', height: '400px', background: 'rgba(255,0,0,0.1)' }}></div>

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-danger text-white text-center py-2 fw-bold tracking-wider pulse-animation border-bottom border-dark position-relative z-3" style={{ fontSize: '0.9rem' }}>
        ⏱️ First Time On Internet "Biggest Sale Ever"
      </div>

      {/* HERO / HEADER SECTION */}
      <section id="hero-section" className="py-5 text-center position-relative">
        <div className="container py-3">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              <span className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-50 px-3 py-2 rounded-pill fw-bold mb-3 d-inline-block">
                🔥 95% DISCOUNT ONLY FOR TODAY
              </span>
              
              <h1 className="display-4 fw-black text-white mb-3 lh-sm display-font px-md-3">
                अपने Facebook Page/YouTube को Viral करें और Monetize करें हमारे <br />
                <span className="text-gradient-red fw-extrabold">6000+ Viral Movie Clips Bundle</span> के साथ 30 दिनों में!
              </h1>

              {/* Red Warning/Trick Bar */}
              <div className="bg-dark bg-opacity-70 border border-warning border-opacity-30 rounded-3 p-3 my-4 mx-auto max-width-lg" style={{ maxWidth: '800px' }}>
                <h4 className="h5 text-warning mb-0 fw-bold d-flex align-items-center justify-content-center gap-2 flex-wrap">
                  <span>⚡ 24 Hours मैं वीडियो Viral करने की ट्रिक अनलॉक करें (2026 Method)</span>
                  <span className="badge bg-danger fs-7 px-2 py-1">LATEST</span>
                </h4>
              </div>

              <p className="lead text-white-50 mb-4 mx-auto" style={{ maxWidth: '750px', fontSize: '1.15rem' }}>
                घर बैठे Daily 2-3 क्लिप अपलोड करें हमारे Bundle के साथ। <br />
                अपने Page पर FB Bonuses & Instream Ads Unlock करें! 100+ Facebook Page Monetized With Our Bundle!
              </p>

              {/* Bold Proof Badges */}
              <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mb-5 text-white fw-bold">
                <span className="badge bg-success px-3 py-2 fs-7 d-flex align-items-center gap-1">
                  <FiCheckCircle /> 100% Guarantee Monetization
                </span>
                <span className="badge bg-warning text-dark px-3 py-2 fs-7 d-flex align-items-center gap-1">
                  <FiCheckCircle /> 100+ Pages Monetized
                </span>
                <span className="badge bg-primary px-3 py-2 fs-7 d-flex align-items-center gap-1">
                  <FiCheckCircle /> Step-By-Step Support
                </span>
              </div>

              {/* Product Mockup & Side-by-Side Points */}
              <div className="row g-4 align-items-center justify-content-center mt-3 text-start">
                <div className="col-md-6 col-lg-5 text-center">
                  <div className="position-relative d-inline-block">
                    {/* Glow behind box */}
                    <div className="position-absolute top-50 start-50 translate-middle bg-danger rounded-circle filter-blur" style={{ width: '110%', height: '110%', opacity: 0.15, filter: 'blur(30px)', zIndex: -1 }}></div>
                    <img 
                      src="https://digibundleshopz.online/wp-content/uploads/2024/06/product-box-mockup-3-e1774680855484-842x1024.png" 
                      alt="6000+ Movie Clips Product Box" 
                      className="img-fluid rounded-4 shadow-2xl transition-transform hover-scale"
                      style={{ maxHeight: '420px', width: 'auto' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        // Fallback to local heroImg if remote fails
                        e.target.src = heroImg;
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-lg-6">
                  <div className="glass-card-no-hover p-4 border-danger border-opacity-30">
                    <h3 className="h4 text-white mb-3 border-bottom border-secondary border-opacity-30 pb-2 fw-bold">
                      📦 बंडल की मुख्य विशेषताएं
                    </h3>
                    <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                      <li className="d-flex align-items-start gap-2">
                        <FiCheckCircle className="text-danger mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-white">Hindi Movie Clips (2025/2026)</strong>
                          <span className="text-white-50 d-block small">सभी Latest ट्रेंडिंग मूवी क्लिप्स और साउथ मूवीज़।</span>
                        </div>
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <FiCheckCircle className="text-danger mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-white">1000+ Pre-Made Video Titles</strong>
                          <span className="text-white-50 d-block small">वीडियो को वायरल करने वाले हुक और आकर्षक टाइटल्स।</span>
                        </div>
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <FiCheckCircle className="text-danger mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-white">1000+ Viral Facebook Hashtags</strong>
                          <span className="text-white-50 d-block small">क्लिक और रीच बढ़ाने वाले 2026 के सीक्रेट टैग्स।</span>
                        </div>
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <FiCheckCircle className="text-danger mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-white">Facebook Viral Course A to Z</strong>
                          <span className="text-white-50 d-block small">शुरुआती लोगों के लिए पूरी वीडियो गाइड और टिप्स।</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* EVERGREEN TIMER BOX */}
              <div className="row justify-content-center mt-5">
                <div className="col-md-8 col-lg-7">
                  <div className="glass-card p-4 border-warning border-opacity-30 pulse-animation">
                    <h4 className="text-white h5 mb-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                      <FiClock className="text-warning" /> ऑफर समाप्त होने में समय बाकी:
                    </h4>
                    
                    <div className="d-flex justify-content-center align-items-center gap-3">
                      <div className="countdown-box">
                        <div className="countdown-number">{timeFormatted.hours}</div>
                        <div className="countdown-label">Hours</div>
                      </div>
                      <div className="fs-3 fw-bold text-warning">:</div>
                      <div className="countdown-box">
                        <div className="countdown-number">{timeFormatted.minutes}</div>
                        <div className="countdown-label">Minutes</div>
                      </div>
                      <div className="fs-3 fw-bold text-warning">:</div>
                      <div className="countdown-box">
                        <div className="countdown-number">{timeFormatted.seconds}</div>
                        <div className="countdown-label">Seconds</div>
                      </div>
                    </div>

                    <button 
                      onClick={scrollToCheckout} 
                      className="btn btn-premium-red w-100 py-3 mt-4 fs-5 d-flex align-items-center justify-content-center gap-2 pulse-animation"
                    >
                      <FiShoppingBag /> BUY NOW AT JUST ₹{currentProduct.price}/- ONLY
                    </button>

                    {/* Under Button points */}
                    <div className="d-flex justify-content-center align-items-center gap-3 mt-3 flex-wrap text-white-50 small">
                      <span className="d-flex align-items-center gap-1"><FiShield className="text-success" /> 100% Copyright Free</span>
                      <span className="d-flex align-items-center gap-1"><FiZap className="text-warning" /> Direct Upload No Editing</span>
                      <span className="d-flex align-items-center gap-1"><FiAward className="text-primary" /> Free ₹5,000 Bonuses Included</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* DEMO VIDEOS SECTION */}
      <section className="py-5 bg-dark bg-opacity-40 border-top border-bottom border-secondary border-opacity-20">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 text-white mb-2 fw-black">DEMO CLIPS VIDEOS 🔥</h2>
            <p className="text-white-50">हमारे बंडल में दी गई क्लिप्स की क्वालिटी और एडिटिंग यहां देखें:</p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              "https://digibundleshopz.online/wp-content/uploads/2024/06/AQOpon45KMc30b_ihRZyVje9m0CVOPircvd_dpeG58wyVrr1qpYN1n41LUksSDFxJx6HMH.mp4",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/AQM7-Tlj9e39znCVm_2O3JKTczOr0Pe4grjd4EHVAMeB2dsK3SawzQapGoL2FS7c8U7DVJNPIu-vuMykY9zmnGeq.mp4",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/AQMug3I0xCFH9cV3AXo5qRJu9Q_dFrGw_6CrjdX8XOxKL82N6s2FWjgOQeWoQRd-1.mp4",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/AQMDI847YzfwV-2Fu_R-N06z-hz39CoxwKKvLySRGgKE3UnRkhELfxDC-oDAKAiaxHaiDm5qZH7IFYVXgI85hGRs-1.mp4"
            ].map((videoUrl, idx) => (
              <div className="col-sm-6 col-lg-3" key={idx}>
                <div className="glass-card overflow-hidden p-2 border-secondary border-opacity-30">
                  <div className="position-relative ratio ratio-9x16 bg-black rounded-3 overflow-hidden">
                    <video 
                      className="object-fit-cover w-100 h-100" 
                      src={videoUrl} 
                      controls 
                      preload="metadata" 
                      controlsList="nodownload"
                    ></video>
                  </div>
                  <div className="p-2 text-center text-white small fw-bold mt-2">
                    <FiVideo className="text-danger me-1" /> Clip Preview {idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-danger bg-opacity-10 border border-danger border-opacity-30 rounded-3 p-3 text-center mt-5 mx-auto" style={{ maxWidth: '850px' }}>
            <h4 className="h5 text-white mb-0 fw-bold">
              🍿 2026 की सारी Latest Movie Clips जेसे की <span className="text-warning text-decoration-underline">Pushpa 2, Chhaava, Dhurandhar & South Movies</span> हमारे बंडल में मिलेगा!
            </h4>
          </div>
        </div>
      </section>

      {/* PROOF SECTION 1: DAILY PROOF */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 text-white mb-2 fw-black text-uppercase">GET MOVIE CLIPS DAILY PROOF</h2>
            <p className="text-white-50">हमारे मेंबर्स द्वारा रोज़ाना मिलने वाले व्यूज और सब्सक्राइबर्स का लाइव प्रूफ:</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-5">
              <div className="glass-card p-3 border-danger border-opacity-20 text-center shadow-lg">
                <img 
                  src="https://digibundleshopz.online/wp-content/uploads/2024/06/Add-a-subheading-11-461x1024.png" 
                  alt="Daily Views Proof" 
                  className="img-fluid rounded-3"
                  style={{ maxHeight: '600px', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF SECTION 2: PAGE MONETIZATION PROOF */}
      <section className="py-5 bg-dark bg-opacity-30">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 text-white mb-2 fw-black text-uppercase">MOVIE CLIPS <span className="text-danger">PAGE MONETIZATION</span> PROOF</h2>
            <p className="text-white-50">फेसबुक पेजों के मोनेटाइजेशन और कमाई का लाइव डैशबोर्ड स्क्रीनशॉट:</p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Add-a-subheading-2-461x1024.png",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Add-a-subheading-3-461x1024.png",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Add-a-subheading-1-461x1024.png",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Untitled-design-53-461x1024.png"
            ].map((imgUrl, idx) => (
              <div className="col-6 col-md-3" key={idx}>
                <div className="glass-card p-2 border-secondary border-opacity-30 h-100 d-flex align-items-center justify-content-center">
                  <img 
                    src={imgUrl} 
                    alt={`Monetization Proof ${idx + 1}`} 
                    className="img-fluid rounded-3"
                    style={{ maxHeight: '420px', width: 'auto', objectFit: 'contain' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <h3 className="h4 text-warning fw-bold mb-4">
              ✨ इनकी तरह आप भी Daily 2-3 क्लिप अपलोड करें और Page मॉनिटाइज करें!
            </h3>
            <span className="badge bg-success bg-opacity-20 text-success border border-success px-4 py-2 fs-6 rounded-pill fw-bold">
              🤝 FULL MONETIZATION SUPPORT INCLUDED
            </span>
          </div>
        </div>
      </section>

      {/* PROOF SECTION 3: PAGE GROWTH FROM BUNDLE */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 text-white mb-2 fw-black text-uppercase">MOVIE CLIPS <span className="text-danger">PAGE GROWTH</span> FROM BUNDLE</h2>
            <p className="text-white-50">बंडल अपलोड करने के बाद फॉलोअर्स और रीच में हुआ धमाका:</p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Kid-1-5-1024x1024.webp",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Kid-1-6-1024x1024.webp",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Kid-1-7-1024x1024.webp"
            ].map((imgUrl, idx) => (
              <div className="col-md-4 col-sm-6" key={idx}>
                <div className="glass-card p-3 border-secondary border-opacity-20 h-100 text-center">
                  <img 
                    src={imgUrl} 
                    alt={`Page Growth Proof ${idx + 1}`} 
                    className="img-fluid rounded-3 shadow"
                    style={{ maxHeight: '350px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF SECTION 4: MEMBERS PAGE GROWTH */}
      <section className="py-5 bg-dark bg-opacity-40">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 text-white mb-2 fw-black text-uppercase">
              CHECK HOW <span className="text-gradient-red">MOVIE CLIPS BUNDLE</span> HAS GROWN OUR MEMBERS PAGE 📈
            </h2>
            <p className="text-white-50">हमारे मेंबर्स के पेजों की रीच, लाइक्स और वीडियो वायरल होने की रिपोर्ट:</p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Untitled-design-49-461x1024.png",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Untitled-design-45-461x1024.png",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Untitled-design-46-461x1024.png",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Untitled-design-50-461x1024.png",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Untitled-design-47-461x1024.png",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Untitled-design-48-1-461x1024.png"
            ].map((imgUrl, idx) => (
              <div className="col-6 col-md-4 col-lg-2" key={idx}>
                <div className="glass-card p-2 border-secondary border-opacity-30 h-100 d-flex align-items-center justify-content-center">
                  <img 
                    src={imgUrl} 
                    alt={`Member Growth ${idx + 1}`} 
                    className="img-fluid rounded-3"
                    style={{ maxHeight: '350px', width: 'auto', objectFit: 'contain' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5 py-4 border-top border-secondary border-opacity-25 mx-auto" style={{ maxWidth: '800px' }}>
            <h3 className="h4 text-white fw-bold mb-3">
              👑 6000+ Movie Clips Bundle Will Help You To Generate More Followers, Views, Engagement & Revenue 💰
            </h3>
            <button onClick={scrollToCheckout} className="btn btn-premium-red btn-lg px-5 py-3 fs-5 pulse-animation">
              START YOUR VIRAL JOURNEY TODAY
            </button>
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCE SECTION */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 text-white mb-2 fw-black text-uppercase">Who Is This Movie Clips For?</h2>
            <p className="text-white-50">यह बंडल किन लोगों के लिए सबसे ज्यादा फायदेमंद है:</p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              {
                title: "Content Creators",
                desc: "Content Creators running out of ideas, who want to easily post these pre-edited viral clips and gain instant engagement.",
                img: "https://digibundleshopz.online/wp-content/uploads/2024/06/7916687_3785602.jpg"
              },
              {
                title: "FB Page Owners",
                desc: "Facebook Admins of any category who want high engagement, organic reach, and new page followers every day.",
                img: "https://digibundleshopz.online/wp-content/uploads/2024/06/2.png"
              },
              {
                title: "YouTubers",
                desc: "Any newbie YouTuber looking to start a Shorts channel and who needs copyright-free content and growth tools.",
                img: "https://digibundleshopz.online/wp-content/uploads/2024/06/7800184_3751179-scaled.jpg"
              },
              {
                title: "Influencers",
                desc: "Instagram and YouTube influencers wanting to build a massive social media following and make money.",
                img: "https://digibundleshopz.online/wp-content/uploads/2024/06/12218313_4912335.jpg"
              }
            ].map((item, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div className="glass-card p-3 h-100 text-center d-flex flex-column border-secondary border-opacity-30">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="img-fluid rounded-circle mb-3 mx-auto" 
                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #ff0000' }}
                  />
                  <h4 className="h5 text-white fw-bold mb-2">{item.title}</h4>
                  <p className="text-white-50 small mb-0 flex-grow-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE TO UPLOAD SECTION */}
      <section className="py-5 bg-dark bg-opacity-30 border-top border-bottom border-secondary border-opacity-20">
        <div className="container text-center">
          <h2 className="display-6 text-white mb-4 fw-black text-uppercase">Where can I Upload these Movie Clips?</h2>
          
          <div className="row g-4 justify-content-center align-items-center">
            {[
              { name: "Facebook Reels & Videos", img: "https://digibundleshopz.online/wp-content/uploads/2024/06/1.png" },
              { name: "Instagram Reels", img: "https://digibundleshopz.online/wp-content/uploads/2024/06/2.png" },
              { name: "YouTube Shorts", img: "https://digibundleshopz.online/wp-content/uploads/2024/06/3.png" }
            ].map((plat, idx) => (
              <div className="col-6 col-md-3" key={idx}>
                <div className="glass-card p-3 border-secondary border-opacity-20 h-100">
                  <img 
                    src={plat.img} 
                    alt={plat.name} 
                    className="img-fluid rounded-3 mb-2 mx-auto"
                    style={{ maxHeight: '80px', objectFit: 'contain' }}
                  />
                  <div className="text-white small fw-bold">{plat.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BONUSES SECTION */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-2">🎁 EXTRA BONUSES</span>
            <h2 className="display-5 text-white mb-2 fw-black text-uppercase">Unlock Bonuses Worth ₹4,999/-</h2>
            <h3 className="h5 text-danger fw-bold">If You Enroll Today! Limited Period Offer - Next Price Will be 499/-</h3>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              {
                title: "Facebook Growth Mastery Course",
                desc: "Ignite explosive Facebook growth. Master elite tactics to go viral. Transform your account with our Facebook Growth Mastery Course.",
                img: "https://digibundleshopz.online/wp-content/uploads/2024/06/product-box-mockup-37-e1739363574689-768x832.png"
              },
              {
                title: "25,000+ Reels Bundle",
                desc: "Get 25,000+ Reels Bundle covering all niches on Instagram. Clean, non-watermarked, and ready to post.",
                img: "https://digibundleshopz.online/wp-content/uploads/2024/06/product-box-mockup-38-e1739364626291-983x1024.png"
              },
              {
                title: "YouTube Growth Mastery Course",
                desc: "Explode your YouTube channel's growth. Master viral shorts creation, insider optimization tags, and promotion tips.",
                img: "https://digibundleshopz.online/wp-content/uploads/2024/06/product-box-mockup-36-e1739363646648-1007x1024.png"
              }
            ].map((bonus, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="glass-card p-4 border-warning border-opacity-20 h-100 d-flex flex-column text-center">
                  <span className="badge bg-danger align-self-center px-3 py-1 text-uppercase fw-bold mb-3">FREE BONUS {idx + 1}</span>
                  <img 
                    src={bonus.img} 
                    alt={bonus.title} 
                    className="img-fluid rounded mb-3 mx-auto"
                    style={{ maxHeight: '180px', objectFit: 'contain' }}
                  />
                  <h4 className="h5 text-white fw-bold mb-2">{bonus.title}</h4>
                  <p className="text-white-50 small mb-0 flex-grow-1">{bonus.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS (WHATSAPP SCREENSHOTS) */}
      <section className="py-5 bg-dark bg-opacity-30">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 text-white mb-2 fw-black text-uppercase">Customer Reviews</h2>
            <p className="text-white-50">हमारे मेंबर्स द्वारा व्हाट्सएप पर भेजे गए फीडबैक और चैट्स:</p>
          </div>

          <div className="row g-3 justify-content-center">
            {[
              "https://digibundleshopz.online/wp-content/uploads/2024/06/photo_2024-09-09_10-17-14-461x1024.jpg",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/photo_2024-09-09_10-17-58-461x1024.jpg",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/Digibundleshop-511x1024.png",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/WhatsApp-Image-2024-05-04-at-4.10.51-PM-1-461x1024.jpeg",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/WhatsApp-Image-2024-06-12-at-6.50.29-PM-461x1024.jpeg",
              "https://digibundleshopz.online/wp-content/uploads/2024/06/WhatsApp-Image-2024-06-12-at-6.50.30-PM-461x1024.jpeg"
            ].map((imgUrl, idx) => (
              <div className="col-6 col-md-4" key={idx}>
                <div className="glass-card p-2 border-secondary border-opacity-30 h-100 d-flex align-items-center justify-content-center">
                  <img 
                    src={imgUrl} 
                    alt={`Review Screenshot ${idx + 1}`} 
                    className="img-fluid rounded-3"
                    style={{ maxHeight: '450px', width: 'auto', objectFit: 'contain' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING & CHECKOUT SECTION */}
      <section className="py-5" id="pricing-section">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-7">
              <div className="text-center mb-5">
                <h2 className="display-6 text-white mb-2 fw-black">SECURE ACCESS CHECKOUT</h2>
                <p className="text-white-50">पेमेंट के तुरंत बाद डाउनलोड लिंक आपकी ईमेल पर आ जाएगी।</p>
              </div>

              {/* CHECKOUT CARD */}
              <div id="checkout-card" className="glass-card-no-hover p-4 p-md-5 border-danger border-opacity-50 position-relative shadow-lg">
                <div className="position-absolute top-0 end-0 translate-middle-y me-4">
                  <span className="badge bg-danger px-3 py-2 rounded-pill fs-6 fw-bold">95% OFF - TODAY ONLY</span>
                </div>

                <div className="text-center mb-4">
                  <h3 className="h6 text-white-50 text-uppercase tracking-wider mb-2">SELECTED PACKAGE</h3>
                  <h4 className="h3 text-white mb-3 fw-black" style={{ fontSize: '1.6rem' }}>{currentProduct.name}</h4>
                  
                  <div className="d-flex justify-content-center align-items-center gap-3 my-4">
                    <span className="text-decoration-line-through text-white-50 fs-3">₹2999</span>
                    <span className="display-4 fw-black text-gradient-red display-font">₹{currentProduct.price}/-</span>
                  </div>
                </div>

                {/* Checked features list */}
                <div className="row g-2 justify-content-center mb-4">
                  <div className="col-md-11">
                    <ul className="list-unstyled d-flex flex-column gap-2">
                      {currentProduct.features && currentProduct.features.map((feat, idx) => (
                        <li key={idx} className="d-flex align-items-center gap-2 text-white-80 small">
                          <FiCheckCircle className="text-success flex-shrink-0" /> <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* SECURE CHECKOUT FORM */}
                <div className="bg-dark bg-opacity-60 p-4 rounded-3 border border-secondary mt-4">
                  <h4 className="h5 text-white mb-3 d-flex align-items-center gap-2 justify-content-center fw-bold">
                    <FiLock className="text-danger" /> Complete Secure Checkout
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
                        placeholder="Enter your name"
                        value={checkoutName}
                        onChange={(e) => setCheckoutName(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="customerEmail" className="form-label small text-white-50">Email Address (For Instant eBook Delivery)</label>
                      <input
                        type="email"
                        className="form-control form-glass"
                        id="customerEmail"
                        placeholder="Enter your active email"
                        value={checkoutEmail}
                        onChange={(e) => setCheckoutEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                      <div className="form-text text-white-50 mt-1" style={{ fontSize: '0.75rem' }}>
                        कृपया सही ईमेल दर्ज करें: डाउनलोड लिंक इसी ईमेल पर तुरंत भेजी जाएगी।
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-premium-red w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-5 mt-4 pulse-animation"
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

      {/* FAQS ACCORDION SECTION */}
      <section className="py-5 bg-dark bg-opacity-20" id="faq">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="display-6 text-white mb-2 fw-black">Frequently Asked Questions</h2>
                <p className="text-white-50">अक्सर पूछे जाने वाले सवाल और उनके जवाब:</p>
              </div>

              <div className="d-flex flex-column gap-3">
                {[
                  {
                    q: "How will I receive the digital bundle?",
                    a: "Immediately after a successful checkout, our system creates your order and sends an automated confirmation email. This email contains a secure, unique, and non-shareable download link for your Movie Clips files."
                  },
                  {
                    q: "Is the download link protected?",
                    a: "Yes! The download link uses a secure cryptographically secure token. It verifies payment confirmation directly in our MongoDB database and tracks download history (IP and Timestamp) to protect the files from unauthorized sharing."
                  },
                  {
                    q: "What is included in the Movie Clips bundle?",
                    a: "The bundle contains 6000+ pre-edited viral movie clips, categorized into Hindi, South Dubbed, Action, 90s, Romantic, and Horror. You also receive 1000+ Pre-Made Video Titles, 1000+ Viral Hashtags, and a Facebook Growth Course."
                  },
                  {
                    q: "Will I get monetization support?",
                    a: "Absolutely! We provide step-by-step guidance. The A-Z guide included explains how to avoid copyright claims, set up page settings, and build engagement to unlock monetization rewards."
                  },
                  {
                    q: "Clips Are Copyright Free?",
                    a: "Yes, the clips are copyright free. Please make sure to go through our Facebook Course. If you face any issues, we will provide you with full assistance and replacement files."
                  }
                ].map((faq, idx) => (
                  <div className="glass-card p-3 border-secondary border-opacity-30" key={idx}>
                    <button 
                      onClick={() => toggleFaq(idx)} 
                      className="btn w-100 text-start d-flex align-items-center justify-content-between p-0 text-white fw-bold border-0 bg-transparent"
                    >
                      <span className="fs-6">{faq.q}</span>
                      <span>{openFaq[idx] ? <FiMinus className="text-danger" /> : <FiPlus className="text-danger" />}</span>
                    </button>
                    {openFaq[idx] && (
                      <div className="text-white-50 small mt-3 pt-3 border-top border-secondary border-opacity-20 transition-all">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER DISCLAIMER */}
      <section className="py-4 text-center border-top border-secondary border-opacity-25 mt-5">
        <div className="container">
          <p className="text-white-50 small mx-auto" style={{ maxWidth: '850px', fontSize: '0.8rem' }}>
            This site is not a part of the Facebook™ website or Facebook™ Inc. Additionally, This site is NOT endorsed by Facebook™ in any way. FACEBOOK™ is a trademark of FACEBOOK™, Inc. As stipulated by law, we can not and do not make any guarantees about your ability to get results or earn any money with our ideas, information, tools, or strategies. We just want to help you by giving great content, direction, and strategies. I hope this bundle brings you a lot of value & results.
          </p>
        </div>
      </section>

      {/* STICKY BOTTOM BUY BAR */}
      {showStickyBar && (
        <div className="sticky-bottom-bar py-3 px-2 d-md-block z-5">
          <div className="container">
            <div className="row align-items-center justify-content-between g-2">
              <div className="col-12 col-sm-6 text-center text-sm-start d-none d-sm-block">
                <h5 className="text-white fw-black mb-0 font-sans truncate-text">
                  ⚡ 6000+ Viral Movie Clips Bundle
                </h5>
                <span className="text-warning small fw-bold">Limited Period Offer at just ₹{currentProduct.price}/- Only!</span>
              </div>
              <div className="col-12 col-sm-6 text-center text-sm-end">
                <button onClick={scrollToCheckout} className="btn btn-premium-red w-100 w-sm-auto px-4 py-2 small fw-bold">
                  BUY NOW AT JUST ₹{currentProduct.price}/- ⏱️
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
