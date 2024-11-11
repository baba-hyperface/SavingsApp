import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Greeting } from './Greeting';
import { ChildDashBoard } from './ChildDashBoard';
import { SavingPlansProvider } from './Context';
import api from './api';
import '../styles/DashBoard.css'; 

export const DashBoard = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userIdFromLocalStorage = localStorage.getItem("userid");

    useEffect(() => {
        const fetchUserdata = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/user/${userIdFromLocalStorage}`);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                console.log(error);
                setLoading(false);
            }
        };
        fetchUserdata();
    }, []);

    return (
        <div>
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <SavingPlansProvider>
                    <ChildDashBoard data={user} setUser={setUser} />
                </SavingPlansProvider>
            )}
        </div>
    );
};
