import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../styles/login.css';
import { FormControl, FormLabel, Box, Button, Input, Text, VStack, useToast, FormHelperText, HStack, Icon } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });


  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    setPasswordCriteria({
      minLength: value.length >= 6,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecialChar: /[@$!%*?&]/.test(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
    if (!allCriteriaMet) {
      alert("Password does not meet all requirements.");
      return;
    }
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
              onChange={handlePasswordChange}
              required
              className='input-field-login'
            />
          </div>
          <FormControl>
          <FormHelperText mt={2} fontSize="sm">
              <HStack wrap="wrap" spacing={6} align="center">
                <HStack align="center" >
                  <Icon
                    as={passwordCriteria.minLength ? CheckIcon : CloseIcon}
                    color={passwordCriteria.minLength ? 'green.500' : 'red.500'}
                  />
                  <Text color={passwordCriteria.minLength ? 'green.500' : 'red.500'}>
                    6+ characters
                  </Text>
                </HStack>
                <HStack align="center" spacing={2}>
                  <Icon
                    as={passwordCriteria.hasUpperCase ? CheckIcon : CloseIcon}
                    color={passwordCriteria.hasUpperCase ? 'green.500' : 'red.500'}
                  />
                  <Text color={passwordCriteria.hasUpperCase ? 'green.500' : 'red.500'}>
                    Uppercase
                  </Text>
                </HStack>
                <HStack align="center" spacing={2}>
                  <Icon
                    as={passwordCriteria.hasLowerCase ? CheckIcon : CloseIcon}
                    color={passwordCriteria.hasLowerCase ? 'green.500' : 'red.500'}
                  />
                  <Text color={passwordCriteria.hasLowerCase ? 'green.500' : 'red.500'}>
                    Lowercase
                  </Text>
                </HStack>
                <HStack align="center" spacing={2}>
                  <Icon
                    as={passwordCriteria.hasNumber ? CheckIcon : CloseIcon}
                    color={passwordCriteria.hasNumber ? 'green.500' : 'red.500'}
                  />
                  <Text color={passwordCriteria.hasNumber ? 'green.500' : 'red.500'}>
                    Number
                  </Text>
                </HStack>
                <HStack align="center" spacing={2}>
                  <Icon
                    as={passwordCriteria.hasSpecialChar ? CheckIcon : CloseIcon}
                    color={passwordCriteria.hasSpecialChar ? 'green.500' : 'red.500'}
                  />
                  <Text color={passwordCriteria.hasSpecialChar ? 'green.500' : 'red.500'}>
                    Special char
                  </Text>
                </HStack>
              </HStack>
            </FormHelperText></FormControl>
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
