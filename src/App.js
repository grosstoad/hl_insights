import React from 'react';
import LoanChart from './components/LoanChart';
import SavingsCalculator from './components/SavingsCalculator';
import { Container, Typography } from '@mui/material';

const App = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Home Loan Paydown Visualizer
            </Typography>
            <LoanChart />
            <SavingsCalculator />
        </Container>
    );
};

export default App;