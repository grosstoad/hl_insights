import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import LoanChart from './LoanChart';

const SavingsCalculator = () => {
    const [loanAmount, setLoanAmount] = useState(300000);
    const [loanTerm, setLoanTerm] = useState(360);
    const [interestRate, setInterestRate] = useState(3.5);
    const [monthlyPayment, setMonthlyPayment] = useState(1500);
    const [extraPayment, setExtraPayment] = useState(0);
    const [savings, setSavings] = useState(null);
    const [error, setError] = useState(null);

    const calculateSavings = async () => {
        try {
            const result = await axios.post('http://127.0.0.1:5000/savings', {
                balance: loanAmount,
                interest_rate: interestRate,
                monthly_payment: monthlyPayment,
                extra_payment: parseFloat(extraPayment),
                term: loanTerm
            });
            setSavings(result.data);
        } catch (err) {
            console.error(err);
            setError('Failed to calculate savings');
        }
    };

    return (
        <div>
            <LoanChart
                loanAmount={loanAmount}
                loanTerm={loanTerm}
                interestRate={interestRate}
                monthlyPayment={monthlyPayment}
                extraPayment={extraPayment}
            />
            <div style={{ marginTop: '20px' }}>
                <TextField
                    label="Loan Amount"
                    variant="outlined"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Loan Term (months)"
                    variant="outlined"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Interest Rate (%)"
                    variant="outlined"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Extra Monthly Payment"
                    variant="outlined"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(e.target.value)}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={calculateSavings} fullWidth>
                    Calculate Savings
                </Button>
            </div>
            {error && (
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
            )}
            {savings && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h6">Savings in Interest: ${savings.savings_interest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Typography>
                    <Typography variant="h6">Savings in Time: {Math.floor(savings.savings_time_months / 12)} years and {savings.savings_time_months % 12} months</Typography>
                </div>
            )}
        </div>
    );
};

export default SavingsCalculator;