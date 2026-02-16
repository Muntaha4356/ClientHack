import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AIChat } from '../components/AIChat';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function Simulator() {
  const [monthlySaving, setMonthlySaving] = useState('');
  const [years, setYears] = useState('');
  const [interestRate, setInterestRate] = useState('3');
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);

  const handleCalculate = () => {
    const monthly = parseFloat(monthlySaving);
    const duration = parseFloat(years);
    const rate = parseFloat(interestRate) / 100;

    if (!monthly || !duration) return;

    const months = duration * 12;
    const data = [];
    let balance = 0;

    for (let month = 0; month <= months; month++) {
      if (month > 0) {
        balance = balance * (1 + rate / 12) + monthly;
      }
      
      if (month % 6 === 0) {
        data.push({
          month: month,
          year: (month / 12).toFixed(1),
          savings: Math.round(balance)
        });
      }
    }

    setChartData(data);
    setTotalSavings(Math.round(balance));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <Header userName="Alex" />
        
        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Future Savings Projection</h1>
            <p className="text-muted-foreground mt-1">Visualize how your savings will grow over time</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <Card>
              <h3 className="text-xl font-bold mb-6">Calculate Your Savings</h3>
              
              <div className="space-y-6">
                <Input
                  label="Monthly Saving Amount"
                  type="number"
                  placeholder="200"
                  value={monthlySaving}
                  onChange={(e) => setMonthlySaving(e.target.value)}
                />

                <Input
                  label="Years"
                  type="number"
                  placeholder="5"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />

                <Input
                  label="Interest Rate (% per year)"
                  type="number"
                  step="0.1"
                  placeholder="3"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />

                <Button onClick={handleCalculate} className="w-full">
                  Calculate
                </Button>
              </div>

              {totalSavings > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Total Savings After {years} Years</p>
                  <p className="text-4xl font-bold text-primary">${totalSavings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    Including interest: ${(totalSavings - parseFloat(monthlySaving) * parseFloat(years) * 12).toLocaleString()}
                  </p>
                </div>
              )}
            </Card>

            {/* Chart */}
            <Card className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6">Savings Growth Over Time</h3>
              
              {chartData.length > 0 ? (
                <div>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                      <XAxis 
                        dataKey="year" 
                        stroke="#94A3B8"
                        label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#94A3B8' }}
                      />
                      <YAxis 
                        stroke="#94A3B8"
                        label={{ value: 'Savings ($)', angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          borderRadius: '12px'
                        }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Savings']}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="mt-8 grid md:grid-cols-3 gap-4">
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">Total Contributed</p>
                      <p className="text-2xl font-bold text-primary">
                        ${(parseFloat(monthlySaving) * parseFloat(years) * 12).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">Interest Earned</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${(totalSavings - parseFloat(monthlySaving) * parseFloat(years) * 12).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">Final Balance</p>
                      <p className="text-2xl font-bold text-purple-400">
                        ${totalSavings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-center">
                  <div>
                    <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Enter your savings details and click Calculate to see your projection</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Motivational Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl font-bold">Small Habits Build Big Futures 🚀</h2>
              <p className="text-muted-foreground">
                Every dollar you save today is an investment in your future. With consistent saving and compound interest, 
                you can achieve your financial goals faster than you think.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 pt-6">
                <div className="bg-background/50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-primary mb-2">$50</p>
                  <p className="text-sm text-muted-foreground">per month for 5 years = $3,194</p>
                </div>
                <div className="bg-background/50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-primary mb-2">$100</p>
                  <p className="text-sm text-muted-foreground">per month for 5 years = $6,387</p>
                </div>
                <div className="bg-background/50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-primary mb-2">$200</p>
                  <p className="text-sm text-muted-foreground">per month for 5 years = $12,775</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground pt-4">* Based on 3% annual interest rate</p>
            </div>
          </Card>
        </main>
      </div>

      <AIChat />
    </div>
  );
}