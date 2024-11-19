import { Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import api from './api';
import '../styles/login.css';

const BankDetails = () => {
  const [accountNumber, setAccountNumber] = useState('');

  const [expDate, setExpDate] = useState('');
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { email, name, password } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/register', { name, email, password, accountNumber, expDate });
      console.log('API response:', response);

      if (response.status === 400 && response.data.message === 'User already exists, try to login') {
        alert('User already exists. Please try to login.');
      } else {
        alert('Registration successful.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page-container'>
        <div className='login-main-container'>
      <h2>Add Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='accountNumber' className='label-for-input-login'>Account Number</label>
          <input
            type='number'
            id='accountNumber'
            placeholder='Enter Account Number'
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            className='input-field-login'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='expDate' className='label-for-input-login'>Expire Date</label>
          <input
            type='date'
            id='expDate'
            placeholder='Enter Expiry Date'
            value={expDate}
            onChange={(e) => setExpDate(e.target.value)}
            required
            className='input-field-login'
          />
        </div>
        <button type='submit' className='submit-button'>{loading ? "loading..." : "Register"}</button>
      </form>
      <br />
      <p><Link to='/register' className='link'>Back</Link></p>
      <p><Link to='/login' className='link'>Login</Link></p>
    </div>
    <div className='login-image-container'>
    <img src="https://static.vecteezy.com/system/resources/thumbnails/001/829/844/small_2x/saving-into-a-piggy-bank-depicts-people-putting-money-into-banking-to-copy-save-and-bank-interest-for-return-on-investment-roi-character-concept-illustration-for-web-landing-page-mobile-apps-free-vector.jpg" alt="" />
    </div>
    </div>
  );
};

export default BankDetails;
