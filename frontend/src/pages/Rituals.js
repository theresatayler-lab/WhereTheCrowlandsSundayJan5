import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { ritualsAPI } from '../utils/api';
import { Scroll } from 'lucide-react';

export const Rituals = () => {
  const [rituals, setRituals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['Invocation', 'Protection', 'Offering', 'Fertility', 'Transformation'];

  useEffect(() => {
    fetchRituals();
  }, [selectedCategory]);

  const fetchRituals = async () => {
    try {
      const data = await ritualsAPI.getAll(selectedCategory);
      setRituals(data);
    } catch (error) {
      console.error('Failed to fetch rituals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Scroll className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-4">Documented Rituals</h1>
          <p className="font-montserrat text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Ceremonial practices preserved from the occult revival era
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              data-testid="category-all"
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-sm font-montserrat text-sm tracking-wider transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-primary border border-primary/30 hover:bg-primary/10'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                data-testid={`category-${category.toLowerCase()}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-sm font-montserrat text-sm tracking-wider transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-transparent text-primary border border-primary/30 hover:bg-primary/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rituals.map((ritual, index) => (
            <motion.div
              key={ritual.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover={false} testId={`ritual-card-${ritual.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-cinzel text-xl font-bold text-bloomsbury-rose flex-1">
                    {ritual.name}
                  </h3>
                  <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-sm font-montserrat text-xs text-primary">
                    {ritual.category}
                  </span>
                </div>
                <p className="font-montserrat text-sm text-foreground leading-relaxed mb-4">
                  {ritual.description}
                </p>
                {ritual.deity_association && (
                  <div className="mb-3">
                    <span className="font-montserrat text-xs uppercase tracking-widest text-primary">Associated: </span>
                    <span className="font-montserrat text-sm text-accent">{ritual.deity_association}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-xs font-montserrat text-muted-foreground">
                  <div>
                    <span className="uppercase tracking-wider">Period: </span>
                    <span>{ritual.time_period}</span>
                  </div>
                  <div>
                    <span className="uppercase tracking-wider">Source: </span>
                    <span>{ritual.source}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};