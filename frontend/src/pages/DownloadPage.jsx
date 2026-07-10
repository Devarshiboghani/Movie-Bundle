import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiDownload, FiCheckCircle, FiFileText, FiAlertTriangle } from 'react-icons/fi';

const DownloadPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await api.get(`/downloads/validate/${token}`);
        if (response.data.success) {
          setOrderInfo(response.data.order);
          setProductInfo(response.data.product);
        } else {
          setErrorMsg(response.data.message || 'Invalid or expired download link.');
        }
      } catch (err) {
        console.error('Validate token error:', err);
        setErrorMsg(err.response?.data?.message || 'Download validation server error.');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleDownloadClick = () => {
    setDownloading(true);
    // Point window to the direct API streaming link
    const downloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/downloads/file/${token}`;
    window.location.href = downloadUrl;

    // Reset status after a few seconds
    setTimeout(() => {
      setDownloading(false);
    }, 3000);
  };

  if (loading) {
    return <LoadingSpinner message="Verifying secure access token..." />;
  }

  if (errorMsg) {
    return (
      <div className="container py-5 my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="glass-card-no-hover p-5 border-danger border-opacity-20 shadow-lg">
              <div className="text-danger mb-4">
                <FiAlertTriangle size={72} />
              </div>
              <h2 className="h4 text-white mb-3">Access Denied</h2>
              <p className="text-white-50 mb-4">{errorMsg}</p>
              <p className="small text-white-50 mb-4">
                If this link was shared, it may have been flagged. Please check your purchase records or contact support if you believe this is in error.
              </p>
              <Link to="/" className="btn btn-premium-primary px-4 py-2">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 my-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="glass-card-no-hover p-4 p-md-5 border-primary border-opacity-20 shadow-lg">
            <div className="text-center mb-5">
              <span className="badge-premium mb-3 d-inline-block">🔒 SECURE DELIVERY PORTAL</span>
              <h1 className="h2 text-white mb-2">Your Download is Ready</h1>
              <p className="text-white-50">Thank you for your purchase, {orderInfo?.customerName}!</p>
            </div>

            <div className="bg-dark bg-opacity-50 p-4 rounded-4 border border-secondary mb-5">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded">
                  <FiFileText size={36} />
                </div>
                <div>
                  <h4 className="h5 text-white mb-1">{productInfo?.name}</h4>
                  <p className="text-white-50 small mb-0">{productInfo?.description}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleDownloadClick}
                disabled={downloading}
                className="btn btn-premium-primary btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-4"
              >
                <FiDownload /> {downloading ? 'Downloading...' : 'Download eBook PDF File'}
              </button>
              
              <div className="d-flex align-items-center justify-content-center gap-2 text-white-50 small">
                <FiCheckCircle className="text-success" />
                <span>Secure PDF document transfer • High-Speed stream</span>
              </div>
            </div>

            <hr className="my-5 border-secondary" />

            <div className="small text-white-50">
              <h5>Security Notice:</h5>
              <p className="mb-0">
                This digital asset is cryptographically licensed to <strong>{orderInfo?.customerEmail}</strong>. 
                Unauthorized sharing, distributions, or file leaks are actively logged. Access from multiple locations may suspend the download token.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
