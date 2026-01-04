import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, BookOpen, Download, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Upgrade = () => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to upgrade');
      return;
    }

    setLoading(true);
    
    try {
      const originUrl = window.location.origin;
      const response = await axios.post(
        `${BACKEND_URL}/api/stripe/create-checkout`,
        { origin_url: originUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-4">
            Unlock the Full Grimoire
          </h1>
          <p className="font-montserrat text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to spell generation, save your rituals forever, and unlock premium features
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/50 border-2 border-border rounded-sm p-8">
            <div className="mb-6">
              <h3 className="font-cinzel text-2xl text-secondary mb-2">Free</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-italiana text-4xl text-primary">$0</span>
                <span className="font-montserrat text-sm text-muted-foreground">forever</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="font-montserrat text-sm text-foreground">Generate up to 3 spells per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="font-montserrat text-sm text-foreground">All 4 guides available</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="font-montserrat text-sm text-foreground">View spells with full details</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="font-montserrat text-sm text-muted-foreground">Cannot save to grimoire</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="font-montserrat text-sm text-muted-foreground">Cannot download PDFs</span>
              </li>
            </ul>

            <Link
              to="/spell-request"
              className="block w-full text-center px-6 py-3 bg-muted text-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-muted/80 transition-all">
              Current Plan
            </Link>
          </motion.div>

          {/* Paid Tier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/10 border-2 border-primary rounded-sm p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-sm">
              <span className="font-montserrat text-xs tracking-widest uppercase">Best Value</span>
            </div>

            <div className="mb-6">
              <h3 className="font-cinzel text-2xl text-secondary mb-2">Pro</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-italiana text-4xl text-primary">$19</span>
                <span className="font-montserrat text-sm text-muted-foreground">per year</span>
              </div>
              <p className="font-montserrat text-xs text-accent mt-1">Less than $2/month!</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-montserrat text-sm text-foreground font-medium">Unlimited spell generation</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-montserrat text-sm text-foreground font-medium">Save unlimited spells to grimoire</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-montserrat text-sm text-foreground font-medium">Download PDFs of your spells</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-montserrat text-sm text-foreground font-medium">Access to all guides</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-montserrat text-sm text-foreground font-medium">Priority support</span>
              </li>
            </ul>

            <button
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              disabled>
              <Sparkles className="w-5 h-5" />
              Coming Soon - Stripe Integration
            </button>
            <p className="text-center font-montserrat text-xs text-muted-foreground mt-3">
              Payment processing will be available soon!
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6">
          <div className="bg-card/50 border border-border rounded-sm p-6 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h4 className="font-cinzel text-lg text-secondary mb-2">Unlimited Spells</h4>
            <p className="font-montserrat text-sm text-muted-foreground">
              Generate as many rituals as you need, whenever inspiration strikes
            </p>
          </div>

          <div className="bg-card/50 border border-border rounded-sm p-6 text-center">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h4 className="font-cinzel text-lg text-secondary mb-2">Your Grimoire</h4>
            <p className="font-montserrat text-sm text-muted-foreground">
              Save and organize your spells in your personal grimoire forever
            </p>
          </div>

          <div className="bg-card/50 border border-border rounded-sm p-6 text-center">
            <Download className="w-12 h-12 text-primary mx-auto mb-4" />
            <h4 className="font-cinzel text-lg text-secondary mb-2">PDF Export</h4>
            <p className="font-montserrat text-sm text-muted-foreground">
              Download beautiful PDFs of your spells for offline use
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};