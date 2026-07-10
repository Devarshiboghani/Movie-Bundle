import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiSettings, 
  FiFileText, 
  FiShoppingBag, 
  FiUsers, 
  FiDownload, 
  FiTrendingUp, 
  FiPlus, 
  FiTrash2, 
  FiMail, 
  FiCheckCircle, 
  FiXCircle,
  FiSearch,
  FiFilePlus
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { admin, loading: authLoading } = useContext(AdminContext);
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Resource States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [downloadHistory, setDownloadHistory] = useState([]);
  
  const [loadingResources, setLoadingResources] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  
  // Search & Filter
  const [orderQuery, setOrderQuery] = useState('');
  
  // Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [productThumbnail, setProductThumbnail] = useState('');
  const [productFile, setProductFile] = useState(null);
  
  // Alert Status
  const [alertInfo, setAlertInfo] = useState({ show: false, msg: '', type: 'success', previewUrl: '' });

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, authLoading, navigate]);

  const loadAllResources = async () => {
    try {
      setLoadingResources(true);
      const [prodRes, ordRes, custRes, dlRes] = await Promise.all([
        api.get('/products?all=true'),
        api.get('/orders'),
        api.get('/orders/customers'),
        api.get('/downloads/history')
      ]);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
      setCustomers(custRes.data);
      setDownloadHistory(dlRes.data);
    } catch (err) {
      console.error('Failed to load dashboard resources:', err);
      triggerAlert('Failed to load database resources. Admin session may have expired.', 'danger');
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    if (admin) {
      loadAllResources();
    }
  }, [admin]);

  const triggerAlert = (msg, type = 'success', previewUrl = '') => {
    setAlertInfo({ show: true, msg, type, previewUrl });
    setTimeout(() => {
      // Don't auto-close immediately if there's a preview URL to click
      if (!previewUrl) {
        setAlertInfo(prev => ({ ...prev, show: false }));
      }
    }, 8000);
  };

  // Create Product Submit
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo({ show: false, msg: '', type: 'success', previewUrl: '' });

    if (!productName || !productDesc || !productPrice || !productFile) {
      triggerAlert('All fields, including the eBook PDF file, are required.', 'danger');
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', productDesc);
    formData.append('price', productPrice);
    formData.append('thumbnail', productThumbnail);
    formData.append('pdf', productFile); // multer expects 'pdf'
    
    if (productFeatures) {
      const featureArray = productFeatures.split(',').map(f => f.trim()).filter(Boolean);
      formData.append('features', JSON.stringify(featureArray));
    }

    setFormLoading(true);
    try {
      const response = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      triggerAlert(response.data.message || 'Product created successfully!');
      
      // Reset Form fields
      setProductName('');
      setProductDesc('');
      setProductPrice('');
      setProductFeatures('');
      setProductThumbnail('');
      setProductFile(null);
      setShowAddForm(false);
      
      // Reload products list
      loadAllResources();
    } catch (err) {
      console.error('Create product API error:', err);
      triggerAlert(err.response?.data?.message || 'Error uploading product asset.', 'danger');
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle Product Active Status
  const handleToggleProductActive = async (product) => {
    try {
      const updatedStatus = !product.active;
      await api.put(`/products/${product._id}`, { active: updatedStatus });
      triggerAlert(`Product status updated to ${updatedStatus ? 'Active' : 'Draft'}.`);
      loadAllResources();
    } catch (err) {
      console.error('Toggle status error:', err);
      triggerAlert('Failed to update product state.', 'danger');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product and its hosted PDF file?')) {
      return;
    }

    try {
      const response = await api.delete(`/products/${id}`);
      triggerAlert(response.data.message || 'Product deleted.');
      loadAllResources();
    } catch (err) {
      console.error('Delete product error:', err);
      triggerAlert('Failed to delete product.', 'danger');
    }
  };

  // Resend Order Link Email
  const handleResendEmail = async (orderId) => {
    try {
      triggerAlert('Sending email, please wait...', 'info');
      const response = await api.post('/orders/resend-email', { orderId });
      if (response.data.success) {
        triggerAlert(
          response.data.message || 'Link resent successfully!',
          'success',
          response.data.previewUrl // Ethereal link for developer verification
        );
        loadAllResources();
      } else {
        triggerAlert(response.data.message || 'Failed to resend email.', 'danger');
      }
    } catch (err) {
      console.error('Resend email error:', err);
      triggerAlert(err.response?.data?.message || 'Failed to resend download email.', 'danger');
    }
  };

  // Calculate Metrics
  const paidOrders = orders.filter(o => o.status === 'Paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalDownloads = downloadHistory.length;

  // Filter Orders
  const filteredOrders = orders.filter(o => 
    o.customerEmail.toLowerCase().includes(orderQuery.toLowerCase()) || 
    o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) || 
    o.paymentId?.toLowerCase().includes(orderQuery.toLowerCase())
  );

  if (authLoading || (admin && loadingResources)) {
    return <LoadingSpinner message="Decrypting administration databases..." />;
  }

  return (
    <div className="container py-4 my-4">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 border-bottom border-secondary pb-3">
        <div>
          <h1 className="h2 text-gradient-primary d-flex align-items-center gap-2">
            <FiSettings /> Control Hub
          </h1>
          <p className="text-white-50 mb-0">Authorized Administrator: {admin?.username}</p>
        </div>
        <div>
          <button className="btn btn-premium-secondary btn-sm" onClick={loadAllResources}>
            🔄 Synchronize Databases
          </button>
        </div>
      </div>

      {/* ADMIN NOTIFICATION BANNER */}
      {alertInfo.show && (
        <div className={`alert alert-${alertInfo.type} alert-dismissible fade show border border-opacity-35 mb-4 p-3`} role="alert">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
            <div>
              <strong>System status:</strong> {alertInfo.msg}
            </div>
            {alertInfo.previewUrl && (
              <a
                href={alertInfo.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-dark btn-sm text-info fw-bold"
              >
                Open Sandbox Email 📬
              </a>
            )}
          </div>
          <button type="button" className="btn-close btn-close-white" onClick={() => setAlertInfo({ ...alertInfo, show: false })} aria-label="Close"></button>
        </div>
      )}

      {/* METRIC PORT CARDS */}
      <div className="row g-3 mb-5">
        <div className="col-sm-6 col-lg-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(17,24,39,0.7) 100%)' }}>
            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <small className="text-white-50 d-block">GROSS REVENUE</small>
              <span className="fs-4 fw-bold text-white">${totalRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="bg-success bg-opacity-10 text-success p-3 rounded">
              <FiShoppingBag size={24} />
            </div>
            <div>
              <small className="text-white-50 d-block">TOTAL SALES</small>
              <span className="fs-4 fw-bold text-white">{paidOrders.length} Orders</span>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="bg-purple bg-opacity-10 text-purple p-3 rounded" style={{ color: 'var(--color-secondary)' }}>
              <FiUsers size={24} />
            </div>
            <div>
              <small className="text-white-50 d-block">BUYERS DIRECTORY</small>
              <span className="fs-4 fw-bold text-white">{customers.length} Customers</span>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded">
              <FiDownload size={24} />
            </div>
            <div>
              <small className="text-white-50 d-block">SECURE DOWNLOADS</small>
              <span className="fs-4 fw-bold text-white">{totalDownloads} Hits</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE NAVIGATION TAB PANEL */}
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="glass-card-no-hover p-3 d-flex flex-column gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`btn text-start p-3 rounded d-flex align-items-center gap-2 ${activeTab === 'overview' ? 'btn-premium-primary' : 'text-white-50 hover-bg-glass'}`}
            >
              📊 Core Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`btn text-start p-3 rounded d-flex align-items-center gap-2 ${activeTab === 'products' ? 'btn-premium-primary' : 'text-white-50 hover-bg-glass'}`}
            >
              <FiFilePlus /> Product Catalog
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`btn text-start p-3 rounded d-flex align-items-center gap-2 ${activeTab === 'orders' ? 'btn-premium-primary' : 'text-white-50 hover-bg-glass'}`}
            >
              <FiShoppingBag /> Transaction Log
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`btn text-start p-3 rounded d-flex align-items-center gap-2 ${activeTab === 'customers' ? 'btn-premium-primary' : 'text-white-50 hover-bg-glass'}`}
            >
              <FiUsers /> Customer Registry
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`btn text-start p-3 rounded d-flex align-items-center gap-2 ${activeTab === 'downloads' ? 'btn-premium-primary' : 'text-white-50 hover-bg-glass'}`}
            >
              <FiDownload /> Delivery Audit
            </button>
          </div>
        </div>

        <div className="col-lg-9">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="d-flex flex-column gap-4">
              {/* Recent Orders Overview */}
              <div className="glass-card-no-hover p-4">
                <h3 className="h5 text-white mb-4">Recent Sales</h3>
                {orders.length === 0 ? (
                  <p className="text-white-50 small mb-0">No purchases recorded yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Buyer</th>
                          <th>Product</th>
                          <th>Paid</th>
                          <th>Delivery Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order._id}>
                            <td>
                              <div className="fw-bold">{order.customerName}</div>
                              <small className="text-white-50">{order.customerEmail}</small>
                            </td>
                            <td>{order.product?.name || 'Deleted Product'}</td>
                            <td>${order.amount.toFixed(2)}</td>
                            <td>
                              {order.emailSent ? (
                                <span className="badge bg-success d-inline-flex align-items-center gap-1"><FiCheckCircle /> Sent</span>
                              ) : (
                                <span className="badge bg-danger d-inline-flex align-items-center gap-1"><FiXCircle /> Failed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Download Hits */}
              <div className="glass-card-no-hover p-4">
                <h3 className="h5 text-white mb-4">Recent Secure Downloads</h3>
                {downloadHistory.length === 0 ? (
                  <p className="text-white-50 small mb-0">No download logs registered yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>User</th>
                          <th>Product</th>
                          <th>IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {downloadHistory.slice(0, 5).map((log) => (
                          <tr key={log._id}>
                            <td>{new Date(log.downloadedAt).toLocaleTimeString()}</td>
                            <td>{log.order?.customerEmail}</td>
                            <td>{log.order?.product?.name || 'File Asset'}</td>
                            <td><span className="badge bg-secondary fw-mono">{log.ipAddress}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="d-flex flex-column gap-4">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="h5 text-white mb-0">Products Catalog</h3>
                <button
                  className="btn btn-premium-primary btn-sm d-flex align-items-center gap-2"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <FiPlus /> Add eBook Product
                </button>
              </div>

              {/* ADD PRODUCT FORM */}
              {showAddForm && (
                <div className="glass-card-no-hover p-4 border-primary border-opacity-20">
                  <h4 className="h6 text-gradient-primary mb-4">Upload New digital Bundle Asset</h4>
                  <form onSubmit={handleAddProductSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small text-white-50">eBook Title</label>
                        <input
                          type="text"
                          className="form-control form-glass"
                          placeholder="e.g. Master React System Architecture"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          required
                          disabled={formLoading}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-white-50">Price ($ USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control form-glass"
                          placeholder="e.g. 19.99"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          required
                          disabled={formLoading}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-white-50">Description</label>
                        <textarea
                          className="form-control form-glass"
                          rows="3"
                          placeholder="Provide a detailed sales pitch / highlights..."
                          value={productDesc}
                          onChange={(e) => setProductDesc(e.target.value)}
                          required
                          disabled={formLoading}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-white-50">Thumbnail Image URL (Optional)</label>
                        <input
                          type="text"
                          className="form-control form-glass"
                          placeholder="https://example.com/cover.jpg"
                          value={productThumbnail}
                          onChange={(e) => setProductThumbnail(e.target.value)}
                          disabled={formLoading}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-white-50">Features (Comma-separated list)</label>
                        <input
                          type="text"
                          className="form-control form-glass"
                          placeholder="eBook (PDF), 12 templates, Discord access"
                          value={productFeatures}
                          onChange={(e) => setProductFeatures(e.target.value)}
                          disabled={formLoading}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-white-50">eBook PDF Document Upload</label>
                        <input
                          type="file"
                          className="form-control form-glass"
                          accept=".pdf"
                          onChange={(e) => setProductFile(e.target.files[0])}
                          required
                          disabled={formLoading}
                        />
                        <div className="form-text text-white-50 small mt-1">
                          Only PDF documents up to 50MB. Files are secured on-disk and streamed only via purchase tokens.
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-premium-secondary btn-sm"
                        onClick={() => setShowAddForm(false)}
                        disabled={formLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-premium-primary btn-sm"
                        disabled={formLoading}
                      >
                        {formLoading ? 'Uploading Asset...' : 'Save Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* PRODUCTS LIST */}
              <div className="glass-card-no-hover p-4">
                {products.length === 0 ? (
                  <p className="text-white-50 mb-0">No digital bundles uploaded. Click Add Product to start.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p._id}>
                            <td>
                              <div className="fw-bold">{p.name}</div>
                              <small className="text-white-50 d-block text-truncate" style={{ maxWidth: '300px' }}>{p.description}</small>
                            </td>
                            <td>${p.price.toFixed(2)}</td>
                            <td>
                              <button
                                className={`btn btn-sm ${p.active ? 'btn-success' : 'btn-secondary'}`}
                                onClick={() => handleToggleProductActive(p)}
                              >
                                {p.active ? 'Active' : 'Draft'}
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteProduct(p._id)}
                              >
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="d-flex flex-column gap-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <h3 className="h5 text-white mb-0">Transaction & Delivery Log</h3>
                
                {/* Search orders */}
                <div className="input-group" style={{ maxWidth: '300px' }}>
                  <span className="input-group-text bg-dark border-secondary text-white-50"><FiSearch /></span>
                  <input
                    type="text"
                    className="form-control form-glass py-1"
                    placeholder="Search by buyer email..."
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="glass-card-no-hover p-4">
                {filteredOrders.length === 0 ? (
                  <p className="text-white-50 mb-0">No matching orders found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0" style={{ fontSize: '0.9rem' }}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Buyer</th>
                          <th>Product</th>
                          <th>Gross</th>
                          <th>Status</th>
                          <th>Dispatch</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order._id}>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div className="fw-bold">{order.customerName}</div>
                              <small className="text-white-50">{order.customerEmail}</small>
                            </td>
                            <td>{order.product?.name || 'Deleted Product'}</td>
                            <td>${order.amount.toFixed(2)}</td>
                            <td>
                              <span className={`badge ${order.status === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              {order.emailSent ? (
                                <span className="text-success"><FiCheckCircle /> Delivered</span>
                              ) : (
                                <span className="text-danger"><FiXCircle /> Failed</span>
                              )}
                            </td>
                            <td>
                              {order.status === 'Paid' && (
                                <button
                                  className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
                                  onClick={() => handleResendEmail(order._id)}
                                  title="Resend download confirmation link email"
                                >
                                  <FiMail /> Resend Link
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="d-flex flex-column gap-4">
              <h3 className="h5 text-white">Registered Buyers Directory</h3>
              <div className="glass-card-no-hover p-4">
                {customers.length === 0 ? (
                  <p className="text-white-50 mb-0">No customers registered yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email Address</th>
                          <th>Purchases</th>
                          <th>Total Paid</th>
                          <th>Last Purchase</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((cust) => (
                          <tr key={cust._id}>
                            <td className="fw-bold">{cust.name}</td>
                            <td>{cust._id}</td>
                            <td>{cust.ordersCount} items</td>
                            <td>${cust.totalSpent.toFixed(2)}</td>
                            <td>{new Date(cust.lastPurchase).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DOWNLOAD AUDIT LOGS */}
          {activeTab === 'downloads' && (
            <div className="d-flex flex-column gap-4">
              <h3 className="h5 text-white">Secure Delivery Access Audit Logs</h3>
              <div className="glass-card-no-hover p-4">
                {downloadHistory.length === 0 ? (
                  <p className="text-white-50 mb-0">No download sessions registered.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Customer</th>
                          <th>eBook Asset</th>
                          <th>IP Address</th>
                          <th>User Agent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {downloadHistory.map((log) => (
                          <tr key={log._id}>
                            <td>{new Date(log.downloadedAt).toLocaleString()}</td>
                            <td>{log.order?.customerEmail}</td>
                            <td>{log.order?.product?.name || 'File Asset'}</td>
                            <td><span className="badge bg-secondary fw-mono">{log.ipAddress}</span></td>
                            <td className="text-white-50 text-truncate" style={{ maxWidth: '200px' }} title={log.userAgent}>
                              {log.userAgent}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
