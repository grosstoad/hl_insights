import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const LoanChart = ({ loanAmount, loanTerm, interestRate, monthlyPayment, extraPayment }) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [scenarioData, setScenarioData] = useState([]);
    const [error, setError] = useState(null);

    const monthsToYears = (months) => Math.floor(months / 12);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.post('http://127.0.0.1:5000/schedule', {
                    balance: loanAmount,
                    interest_rate: interestRate,
                    monthly_payment: monthlyPayment,
                    term: loanTerm
                });
                setScheduleData(result.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch data from server');
            }
        };
        fetchData();
    }, [loanAmount, loanTerm, interestRate, monthlyPayment]);

    useEffect(() => {
        const fetchUpdatedData = async () => {
            try {
                const result = await axios.post('http://127.0.0.1:5000/savings', {
                    balance: loanAmount,
                    interest_rate: interestRate,
                    monthly_payment: monthlyPayment,
                    extra_payment: parseFloat(extraPayment),
                    term: loanTerm
                });
                setScenarioData(result.data.schedule);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch data from server');
            }
        };

        if (extraPayment > 0) {
            fetchUpdatedData();
        } else {
            setScenarioData([]);
        }
    }, [extraPayment, loanAmount, loanTerm, interestRate, monthlyPayment]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const formatTooltip = (value) => `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    const formatYAxis = (value) => `$${(value / 1000).toFixed(0)}k`;

    const combinedData = scheduleData.map((item, index) => {
        const scenarioItem = scenarioData[index];
        return {
            month: item.month,
            scheduled_balance: item.balance,
            scenario_balance: scenarioItem ? scenarioItem.balance : null,
            principal: item.principal,
            interest: item.interest,
        };
    });

    const filteredData = combinedData.filter(item => item.scheduled_balance !== null);

    return (
        <LineChart width={800} height={400} data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="month"
                tickFormatter={monthsToYears}
                interval={11}
                label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
                domain={[0, 'dataMax']}
            />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip formatter={formatTooltip} />
            <Legend />
            <Line type="monotone" dataKey="scheduled_balance" name="Scheduled Balance" stroke="#8884d8" />
            <Line type="monotone" dataKey="scenario_balance" name="Scenario Balance" stroke="#82ca9d" />
        </LineChart>
    );
};

export default LoanChart;