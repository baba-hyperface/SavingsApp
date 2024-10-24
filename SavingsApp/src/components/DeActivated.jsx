import React from 'react'
import '../styles/buttonStyles.css';
import { Navigate, useNavigate } from 'react-router-dom';

export const DeActivated = () => {
      const navigate=useNavigate();

const handleButtonClick = () => {
      navigate('/deactivated')
}


  return (
    <div>
      <button className='action-buttons' onClick={handleButtonClick}>
      <i class="fa-solid fa-face-frown"></i><span className='button-text'>Deactivated Plan</span>
      </button>
      <p className='send-text'>Deactivated</p>
    </div>
  )
}
