import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiCheckCircle, FiMail, FiDownload, FiAlertCircle } from 'react-icons/fi';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const sessionId = searchParams.get('session_id');
  const isSandbox = searchParams.get('sandbox');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setErrorMsg('Invalid checkout session reference.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/checkout/verify-session?session_id=${sessionId}&sandbox=${isSandbox || 'false'}`);
        if (response.data.success) {
          setSuccess(true);
          setOrderDetails(response.data.order);
          if (response.data.previewUrl) {
            setEmailPreviewUrl(response.data.previewUrl);
          }
        } else {
          setErrorMsg(response.data.message || 'Payment verification failed.');
        }
      } catch (err) {
        console.error('Verify checkout error:', err);
        setErrorMsg(err.response?.data?.message || 'Server error verifying checkout session.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, isSandbox]);

  if (loading) {
    return <LoadingSpinner message="Verifying payment details and generating delivery keys..." />;
  }

  return (
    <div className="container py-5 my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 text-center">
          {success ? (
            <div className="glass-card-no-hover p-5 border-success border-opacity-20 shadow-lg">
              <div className="text-success mb-4">
                <FiCheckCircle size={72} className="animate-pulse" />
              </div>
              <h1 className="display-6 text-white mb-2">Order Confirmed!</h1>
              <p className="text-gradient-primary fw-semibold fs-5 mb-4">Payment Processed Successfully</p>
              
              <div className="bg-dark bg-opacity-40 p-4 rounded border border-secondary mb-4 text-start">
                <p className="mb-2 text-white-50 small">ORDER NUMBER:</p>
                <p className="fw-mono text-white mb-3" style={{ fontSize: '0.9rem' }}>{orderDetails?.paymentId}</p>
                
                <p className="mb-1 text-white-50 small">DELIVERED TO:</p>
                <p className="text-white fw-bold mb-0">{orderDetails?.customerEmail}</p>
              </div>

              <div className="d-flex align-items-center gap-3 justify-content-center bg-primary bg-opacity-10 p-3 rounded border border-primary border-opacity-20 mb-4">
                <FiMail className="text-primary flex-shrink-0" size={24} />
                <p className="text-white-85 small text-start mb-0">
                  We've sent a secure eBook download link to your email. Please check your inbox (and spam folder).
                </p>
              </div>

              {/* Developer Ethereal Email Sandbox link */}
              {emailPreviewUrl && (
                <div className="alert alert-info border border-info border-opacity-35 text-start mb-4" role="alert">
                  <h6 className="d-flex align-items-center gap-2 text-info">
                    <FiAlertCircle /> Developer Sandbox Alert
                  </h6>
                  <p className="small mb-2 text-white-85">
                    Since the app is running in Sandbox mode with Ethereal.email, you can view the sent download confirmation email directly in your browser:
                  </p>
                  <a
                    href={emailPreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-info btn-sm text-dark fw-bold w-100"
                  >
                    View Ethereal Email Inbox 📬
                  </a>
                </div>
              )}

              <div className="d-flex flex-column gap-2 mt-4">
                {orderDetails?.downloadToken && (
                  <Link
                    to={`/download/${orderDetails.downloadToken}`}
                    className="btn btn-premium-primary py-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    <FiDownload /> Go to Download Portal
                  </Link>
                )}
                <Link to="/" className="btn btn-premium-secondary py-2">
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card-no-hover p-5 border-danger border-opacity-20 shadow-lg">
              <div className="text-danger mb-4">
                <FiAlertCircle size={72} />
              </div>
              <h1 className="h3 text-white mb-3">Verification Failed</h1>
              <p className="text-white-50 mb-4">
                {errorMsg || 'We were unable to verify your checkout status. If you believe this is an error, please check with support.'}
              </p>
              <Link to="/" className="btn btn-premium-primary px-4 py-2">
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
