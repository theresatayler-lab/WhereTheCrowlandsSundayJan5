import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { timelineAPI } from '../utils/api';
import { Clock } from 'lucide-react';

export const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const data = await timelineAPI.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Clock className="w-12 h-12 text-primary animate-pulse" />
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
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-4">Timeline: 1910-1945</h1>
          <p className="font-montserrat text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Key moments in the occult revival between the World Wars
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30" />

          <div className="space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20"
              >
                {/* Year marker */}
                <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center">
                  <span className="font-italiana text-sm text-primary font-bold">{event.year}</span>
                </div>

                <GlassCard hover={false} testId={`timeline-event-${event.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-cinzel text-lg font-bold text-bloomsbury-rose flex-1">
                      {event.title}
                    </h3>
                    <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-sm font-montserrat text-xs text-primary">
                      {event.category}
                    </span>
                  </div>
                  <p className="font-montserrat text-sm text-foreground leading-relaxed">
                    {event.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};