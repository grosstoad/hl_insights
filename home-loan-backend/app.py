from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def calculate_amortization_schedule(balance, interest_rate, monthly_payment, term):
    schedule = []
    monthly_rate = interest_rate / 12 / 100
    for month in range(1, term + 1):
        interest = balance * monthly_rate
        principal = monthly_payment - interest
        balance -= principal
        schedule.append({
            "month": month,
            "principal": principal,
            "interest": interest,
            "balance": max(balance, 0)
        })
        if balance <= 0:
            break
    return schedule

def calculate_savings(initial_balance, interest_rate, monthly_payment, extra_payment, term):
    base_schedule = calculate_amortization_schedule(initial_balance, interest_rate, monthly_payment, term)
    base_total_interest = sum([p['interest'] for p in base_schedule])
    base_months = len(base_schedule)

    total_payment = monthly_payment + extra_payment
    extra_schedule = calculate_amortization_schedule(initial_balance, interest_rate, total_payment, term)
    extra_total_interest = sum([p['interest'] for p in extra_schedule])
    extra_months = len(extra_schedule)

    savings_interest = base_total_interest - extra_total_interest
    savings_time = base_months - extra_months

    return {
        "savings_interest": savings_interest,
        "savings_time_months": savings_time,
        "schedule": extra_schedule
    }

@app.route('/schedule', methods=['POST'])
def get_schedule():
    data = request.json
    balance = data['balance']
    interest_rate = data['interest_rate']
    monthly_payment = data['monthly_payment']
    term = data['term']
    schedule = calculate_amortization_schedule(balance, interest_rate, monthly_payment, term)
    return jsonify(schedule)

@app.route('/savings', methods=['POST'])
def get_savings():
    data = request.json
    balance = data['balance']
    interest_rate = data['interest_rate']
    monthly_payment = data['monthly_payment']
    extra_payment = data['extra_payment']
    term = data['term']
    savings = calculate_savings(balance, interest_rate, monthly_payment, extra_payment, term)
    return jsonify(savings)

if __name__ == '__main__':
    app.run(debug=True)