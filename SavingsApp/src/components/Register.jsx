import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../styles/login.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/account', { state: { email, name, password } });
  };

  return (
    <div className='login-page-container'>
      <div className='login-main-container'>
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className='label-for-input-login'>Name</label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='input-field-login'
            />
          </div>
          <div>
            <label htmlFor="email" className='label-for-input-login'>Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='input-field-login'
            />
          </div>
          <div>
            <label htmlFor="password" className='label-for-input-login'>Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='input-field-login'
            />
          </div>
          <button type="submit">
            Add Account
          </button>
        </form>
        <br />
        <p>
          <Link to="/login" className='signup-text'>
            Login
          </Link>
        </p>
      </div>
      <div className='login-image-container'>
        <img src="https://static.vecteezy.com/system/resources/thumbnails/001/829/844/small_2x/saving-into-a-piggy-bank-depicts-people-putting-money-into-banking-to-copy-save-and-bank-interest-for-return-on-investment-roi-character-concept-illustration-for-web-landing-page-mobile-apps-free-vector.jpg" alt="" />
      </div>
    </div>
  );
};

export default Register;
