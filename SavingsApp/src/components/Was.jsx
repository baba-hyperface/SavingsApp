import React, { useEffect, useState } from 'react'
import '../styles/buttonStyles.css';
import api from './api';
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';

export const Was = () => {
  const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userIdFromLocalStorage = localStorage.getItem("userid");
      const { isOpen, onOpen, onClose } = useDisclosure()
      const finalRef = React.useRef(null)
    
    useEffect(() => {
        const fetchUserdata = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/user/${userIdFromLocalStorage}`)
                setUser(res.data);
                console.log(res.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                console.log(error);
            }
        }
        fetchUserdata();
    }, []);
    // <button onClick={onOpen} className='action-buttons'><i class="fa-solid fa-vault"></i>Wealth Accumulation Scheme amount: {user.helthcareamount} </button>


  return (
    <>
    <div>
    <button onClick={onOpen} className='action-buttons'><i class="fa-solid fa-vault"></i>Wealth Accumulation Scheme amount: {user.helthcareamount} </button>

    </div>
    </>
  )
}
