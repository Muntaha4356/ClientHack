import React from 'react';
import { useNavigate } from 'react-router';
import { Shield, TrendingUp, Bell, Sparkles, DollarSign, PieChart, AlertTriangle, Target } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">FinGuard AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">AI-Powered Financial Assistant</span>
          </div>
          
          <h1 className="text-6xl font-bold leading-tight">
            Take Control of Your Money{' '}
            <span className="text-primary">Before It Controls You</span>
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            Smart budgeting, fraud detection, and AI-powered financial advice designed specifically for university students. Make every dollar count.
          </p>
          
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/signup')} className="text-lg px-8 py-4">
              Get Started Free
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard')} className="text-lg px-8 py-4">
              See Demo
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-primary">10K+</p>
              <p className="text-sm text-muted-foreground">Students Protected</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">$2M+</p>
              <p className="text-sm text-muted-foreground">Fraud Prevented</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">98%</p>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl"></div>
          <Card className="relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Financial Overview</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-2xl font-bold text-primary">$2,450</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Saved</p>
                  <p className="text-2xl font-bold text-green-400">$890</p>
                </div>
              </div>

              <div className="h-32 bg-muted/30 rounded-xl flex items-end gap-2 p-4">
                {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary rounded-t transition-all duration-300"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400">Suspicious Activity Detected</p>
                  <p className="text-xs text-muted-foreground mt-1">Unusual transaction from unknown vendor</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Sound Familiar?</h2>
          <p className="text-xl text-muted-foreground">We understand the challenges students face</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card hover className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Running out of money?</h3>
            <p className="text-muted-foreground">
              Living paycheck to paycheck? Our smart budget tracker helps you stay on top of your spending and never run out before month-end.
            </p>
          </Card>

          <Card hover className="text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <PieChart className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">No idea where your money goes?</h3>
            <p className="text-muted-foreground">
              Track every transaction automatically with beautiful visualizations. See exactly where your money is going and make smarter choices.
            </p>
          </Card>

          <Card hover className="text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Worried about online scams?</h3>
            <p className="text-muted-foreground">
              AI-powered fraud detection monitors your transactions 24/7 and alerts you instantly about suspicious activity.
            </p>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground">Powerful features designed for students</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Smart Budget Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Visualize your income, expenses, and savings in one beautiful dashboard.
            </p>
          </Card>

          <Card hover>
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-bold mb-2">AI Financial Advisor</h3>
            <p className="text-sm text-muted-foreground">
              Chat with our AI assistant for personalized financial advice 24/7.
            </p>
          </Card>

          <Card hover>
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="font-bold mb-2">Fraud Detection Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Get instant notifications about suspicious transactions and potential fraud.
            </p>
          </Card>

          <Card hover>
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-bold mb-2">Future Savings Simulator</h3>
            <p className="text-sm text-muted-foreground">
              See how small savings today can grow into big goals tomorrow.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <Card className="text-center bg-gradient-to-br from-primary/20 to-purple-500/20 border-primary/30">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold">Start Managing Smarter</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of students who are taking control of their financial future
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button onClick={() => navigate('/signup')} className="text-lg px-8 py-4">
                Get Started Free
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 FinGuard AI. Empowering students to make smarter financial decisions.</p>
        </div>
      </footer>
    </div>
  );
}

// Missing import
import { LayoutDashboard } from 'lucide-react';
