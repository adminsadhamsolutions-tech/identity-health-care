import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!credentials.username || !credentials.password) {
      setStatus({ type: 'error', message: 'Enter both username and password.' });
      return;
    }

    try {
      const response = await login(credentials);
      localStorage.setItem('identity-token', response.data.token);
      navigate('/admin/dashboard');
    } catch (error) {
      setStatus({ type: 'error', message: 'Login failed. Check your credentials.' });
    }
  };

  return (
    <div className="admin-shell">
      <div className="login-card">
        <h2>Admin Login</h2>
        <p>Access the Identity Health Care management dashboard.</p>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input name="username" value={credentials.username} onChange={handleChange} placeholder="admin" />
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Admin@123"
          />
          <div className="login-actions">
            <button className="cta-button" type="submit">
              Sign In
            </button>
          </div>
        </form>
        {status && <div className={status.type === 'success' ? 'alert-success' : 'alert-error'}>{status.message}</div>}
      </div>
    </div>
  );
}
