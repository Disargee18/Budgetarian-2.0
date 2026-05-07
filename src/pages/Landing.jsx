import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Apple, TrendingDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BudgetarianLogo } from '../components/BudgetarianLogo';

const Landing = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      type: 'peso',
      gradient: 'from-clay-green to-clay-emerald',
      title: 'Budget-Based',
      description: 'Set your weekly food budget. Our AI creates meal plans that never exceed your financial limit.',
    },
    {
      type: 'icon',
      icon: Apple,
      gradient: 'from-clay-amber to-orange-500',
      title: 'Nutrition-Optimized',
      description: 'Get balanced meals with proper macros and nutrients - without breaking the bank.',
    },
    {
      type: 'icon',
      icon: TrendingDown,
      gradient: 'from-clay-sky to-clay-accent',
      title: 'Smart Savings',
      description: 'Auto-generated plans with price estimates and money-saving ingredient alternatives.',
    },
  ];

  return (
    <div className="min-h-screen bg-clay-canvas text-clay-foreground">
      <Navbar 
        onSignIn={() => navigate('/login')} 
        onGetStarted={() => navigate('/signup')} 
      />

      {/* Hero Section */}
      <section className="px-6 sm:px-8 pt-16 sm:pt-20 pb-24 sm:pb-32 relative overflow-hidden bg-gradient-to-b from-white to-clay-canvas">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full filter blur-3xl opacity-10 animate-clay-float bg-clay-green" />
        <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full filter blur-3xl opacity-10 animate-clay-float-delayed bg-clay-accent" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 bg-clay-green/10 text-clay-green border border-clay-green/10">
              <TrendingDown className="w-3.5 h-3.5" />
              Save money, eat healthy
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-8 transition-colors tracking-tight text-clay-foreground" style={{ lineHeight: '1.1' }}>
              Healthy meals on
              <br />
              <span className="bg-gradient-to-r from-clay-green to-clay-emerald bg-clip-text text-transparent">
                your budget
              </span>
            </h1>

            <p className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto font-medium text-clay-muted" style={{ lineHeight: '1.6' }}>
              AI-powered meal planning that maximizes nutrition while staying within your spending limit.
              Perfect for students, families, and budget-conscious eaters.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto px-10 py-4 bg-clay-green text-white font-black uppercase tracking-widest rounded-full hover:shadow-clayButton hover:scale-105 transition-all shadow-clayButton flex items-center justify-center gap-3 text-sm"
              >
                Start Planning
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto px-10 py-4 font-black uppercase tracking-widest rounded-full border-2 transition-all text-sm bg-white text-clay-muted border-clay-border hover:bg-clay-canvas"
              >
                See How It Works
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            {featureCards.map((card, idx) => (
              <div
                key={idx}
                className="rounded-[32px] p-8 border transition-all duration-300 hover:-translate-y-2 bg-white shadow-clayCard border-clay-border"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-clayButton bg-gradient-to-br ${card.gradient}`}>
                  {card.type === 'peso' ? (
                    <span className="text-2xl font-black text-white">₱</span>
                  ) : (
                    <card.icon className="w-7 h-7 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-extrabold mb-4 text-clay-foreground">
                  {card.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-clay-muted">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 sm:px-8 py-24 relative overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-clay-foreground">
              How it works
            </h2>
            <p className="text-lg font-medium text-clay-muted">
              Three simple steps to healthier, budget-friendly eating
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                number: '1',
                bgColor: 'bg-clay-green/10',
                textColor: 'text-clay-green',
                title: 'Set Your Budget',
                description: 'Tell us your weekly food budget. Set preferences for diet type and health goals.',
              },
              {
                number: '2',
                bgColor: 'bg-clay-amber/10',
                textColor: 'text-clay-amber',
                title: 'AI Plans Your Meals',
                description: 'Our AI creates a complete meal plan optimized for nutrition and cost based on local prices.',
              },
              {
                number: '3',
                bgColor: 'bg-clay-sky/10',
                textColor: 'text-clay-sky',
                title: 'Shop & Cook',
                description: 'Get your grocery list with estimated costs. Follow simple recipes matched to your skill level.',
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center group">
                <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto mb-8 transition-all duration-500 group-hover:scale-110 shadow-clayCard ${step.bgColor}`}>
                  <span className="text-4xl font-black {step.textColor}">{step.number}</span>
                </div>
                <h3 className="text-xl font-extrabold mb-4 text-clay-foreground">
                  {step.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-clay-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 sm:px-8 py-20 relative overflow-hidden bg-gradient-to-br from-clay-green to-clay-emerald">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center text-white">
            {[
              { stat: '40%', label: 'Average savings' },
              { stat: '100%', label: 'Nutritionally balanced' },
              { stat: '15min', label: 'Average prep time' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="text-5xl sm:text-6xl font-black mb-2">
                  {item.stat}
                </div>
                <div className="text-sm font-black uppercase tracking-widest text-white/80">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 sm:px-8 py-24 relative overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-6xl font-extrabold mb-8 tracking-tight text-clay-foreground" style={{ lineHeight: '1.1' }}>
            Ready to eat healthy
            <br />
            without overspending?
          </h2>
          <p className="text-xl mb-12 font-medium text-clay-muted">
            Join thousands using Budgetarian to save money and improve their nutrition.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-12 py-5 bg-clay-green text-white font-black uppercase tracking-widest rounded-full hover:shadow-clayButton hover:scale-105 transition-all shadow-clayButton inline-flex items-center gap-3 text-lg"
          >
            Start Your Free Plan
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs mt-8 font-black uppercase tracking-widest text-clay-muted">
            No credit card required • Free forever
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
