import React from 'react';
import { useNavigate } from 'react-router';
import { Shield, TrendingUp, Bell, Sparkles, DollarSign, PieChart, AlertTriangle, Target, LayoutDashboard, Wallet } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { motion } from 'motion/react';

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
            <span className="text-xl font-bold">CashMate</span>
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
          </div>

          
        </div>

        {/* Animated Finance Illustration */}
        <div className="relative h-[600px] flex items-center justify-center">
          {/* Glowing Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-green-500/20 blur-3xl animate-pulse"></div>
          
          {/* Central Shield with Pulse */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/50 z-10"
          >
            <Shield className="w-16 h-16 text-white" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-primary rounded-3xl"
            ></motion.div>
          </motion.div>

          {/* Floating Coins - Top Left */}
          <motion.div
            animate={{ 
              y: [-20, 20, -20],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-xl flex items-center justify-center"
          >
            <DollarSign className="w-10 h-10 text-yellow-900" />
          </motion.div>

          {/* Floating Coins - Top Right */}
          <motion.div
            animate={{ 
              y: [20, -20, 20],
              rotate: [360, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-xl flex items-center justify-center"
          >
            <DollarSign className="w-8 h-8 text-yellow-900" />
          </motion.div>

          {/* Credit Card - Left Side */}
          <motion.div
            animate={{ 
              x: [-10, 10, -10],
              rotate: [-5, 5, -5]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute left-10 top-1/2 -translate-y-1/2 w-48 h-32 bg-gradient-to-br from-primary via-blue-600 to-purple-600 rounded-2xl shadow-2xl p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-8 bg-yellow-400 rounded opacity-80"></div>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex gap-1 mb-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white/40 rounded-full"></div>
                ))}
              </div>
              <div className="text-white text-xs font-mono">**** 4532</div>
            </div>
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"
            ></motion.div>
          </motion.div>

          {/* Wallet - Right Side */}
          <motion.div
            animate={{ 
              x: [10, -10, 10],
              rotate: [5, -5, 5]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute right-10 top-1/2 -translate-y-1/2 w-40 h-28 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl flex items-center justify-center"
          >
            <Wallet className="w-12 h-12 text-white" />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-green-400 rounded-2xl"
            ></motion.div>
          </motion.div>

          {/* Rising Chart Bars - Bottom Left */}
          <motion.div
            className="absolute bottom-20 left-24 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[40, 60, 80, 100].map((height, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: [`${height * 0.5}px`, `${height}px`, `${height * 0.5}px`]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-8 bg-gradient-to-t from-primary to-blue-400 rounded-t-lg shadow-lg"
                style={{ height: `${height}px` }}
              ></motion.div>
            ))}
          </motion.div>

          {/* Trending Up Arrow - Bottom Right */}
          <motion.div
            animate={{ 
              y: [-5, 5, -5],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-24 right-24 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-xl flex items-center justify-center"
          >
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>

          {/* Floating Dollar Signs */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                delay: i * 1.3,
                ease: "easeInOut"
              }}
              className="absolute text-primary opacity-0"
              style={{
                top: `${50 + i * 10}%`,
                left: `${40 + i * 15}%`
              }}
            >
              <DollarSign className="w-8 h-8" />
            </motion.div>
          ))}

          {/* Sparkle Effects */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut"
              }}
              className="absolute text-yellow-400"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`
              }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          ))}
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
          <p>© 2026 CashMate. Empowering students to make smarter financial decisions.</p>
        </div>
      </footer>
    </div>
  );
}