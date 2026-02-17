import React from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const isDev = import.meta.env.VITE_IS_DEV === 'true';

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-info">
                    <p>&copy; {new Date().getFullYear()} IFOB School. All rights reserved.</p>
                </div>
                {isDev && (
                    <div className="footer-links">
                        <Button variant="outlined" onClick={() => navigate('/admin')}>
                            Admin
                        </Button>
                    </div>
                )}
            </div>
        </footer>
    );
};

export default Footer;
