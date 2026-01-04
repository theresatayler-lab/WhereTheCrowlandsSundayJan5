import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { favoritesAPI, authAPI, subscriptionAPI } from '../utils/api';
import { User, Heart, Mail, Key, Crown } from 'lucide-react';
import { toast } from 'sonner';

export const Profile = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    newEmail: '',
    password: ''
  });
  const [updatingEmail, setUpdatingEmail] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchSubscriptionStatus();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const data = await favoritesAPI.getAll();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const status = await subscriptionAPI.getStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    
    if (!emailFormData.newEmail || !emailFormData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setUpdatingEmail(true);
    
    try {
      const updatedUser = await authAPI.updateEmail(emailFormData.newEmail, emailFormData.password);
      
      // Update localStorage with new user data
      const currentUser = JSON.parse(localStorage.getItem('user'));
      currentUser.email = updatedUser.email;
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      toast.success('Email updated successfully! Please log in again with your new email.');
      
      // Reset form
      setEmailFormData({ newEmail: '', password: '' });
      setIsChangingEmail(false);
      
      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Incorrect password');
      } else if (error.response?.status === 400) {
        toast.error('Email already in use');
      } else {
        toast.error('Failed to update email. Please try again.');
      }
      console.error('Email update error:', error);
    } finally {
      setUpdatingEmail(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard hover={false}>
          <p className="font-montserrat text-muted-foreground">Please log in to view your profile</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <User className="w-20 h-20 text-primary mx-auto mb-4" />
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-2">{user.name}</h1>
          <p className="font-montserrat text-muted-foreground">{user.email}</p>
        </motion.div>

        <GlassCard hover={false} testId="favorites-section">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-secondary" />
            <h2 className="font-cinzel text-2xl text-secondary">Your Favorites</h2>
          </div>

          {loading ? (
            <p className="font-montserrat text-muted-foreground">Loading favorites...</p>
          ) : favorites.length === 0 ? (
            <p className="font-montserrat text-muted-foreground">
              You haven't saved any favorites yet. Explore deities, figures, sites, and rituals to save your favorites.
            </p>
          ) : (
            <div className="space-y-3">
              {favorites.map((fav, idx) => (
                <div
                  key={idx}
                  data-testid={`favorite-${idx}`}
                  className="p-4 bg-card/50 border border-border rounded-sm"
                >
                  <p className="font-montserrat text-sm text-foreground">
                    <span className="text-primary uppercase tracking-wider">{fav.type}: </span>
                    {fav.id}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};