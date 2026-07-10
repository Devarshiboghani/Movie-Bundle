import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';

const AdminLogin = () => {
  const { admin, login } = useContext(AdminContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already logged in, skip page
    if (admin) {
      navigate('/admin');
    }
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !password) {
      setErrorMsg('Both username and password are required.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(username, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="container py-5 my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="glass-card-no-hover p-4 p-md-5 border-secondary border-opacity-25 shadow-lg">
            <div className="text-center mb-4">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-block mb-3">
                <FiLock size={32} />
              </div>
              <h2 className="h3 text-white">Administrator Access</h2>
              <p className="text-white-50 small">Sign in to manage inventory, payments, and orders.</p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert">
                <FiAlertCircle className="flex-shrink-0" />
                <span className="small">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-white-50">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-white-50"><FiUser /></span>
                  <input
                    type="text"
                    className="form-control form-glass"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small text-white-50">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-white-50"><FiLock /></span>
                  <input
                    type="password"
                    className="form-control form-glass"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-premium-primary w-100 py-3 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
