import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { deitiesAPI } from '../utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Moon } from 'lucide-react';

export const Deities = () => {
  const [deities, setDeities] = useState([]);
  const [selectedDeity, setSelectedDeity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeities();
  }, []);

  const fetchDeities = async () => {
    try {
      const data = await deitiesAPI.getAll();
      setDeities(data);
    } catch (error) {
      console.error('Failed to fetch deities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Moon className="w-12 h-12 text-primary animate-pulse" />
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
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-4">Divine Pantheon</h1>
          <p className="font-montserrat text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            The goddesses who guided the occult revival of 1910-1945
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deities.map((deity, index) => (
            <motion.div
              key={deity.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                testId={`deity-card-${deity.id}`}
                onClick={() => setSelectedDeity(deity)}
              >
                <div
                  className="h-48 -m-8 mb-6 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${deity.image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-bloomsbury-rose mb-2">
                  {deity.name}
                </h3>
                <p className="font-montserrat text-xs uppercase tracking-widest text-primary mb-3">
                  {deity.origin}
                </p>
                <p className="font-montserrat text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {deity.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedDeity} onOpenChange={() => setSelectedDeity(null)}>
        <DialogContent className="max-w-3xl bg-card border-border" data-testid="deity-detail-modal">
          {selectedDeity && (
            <>
              <DialogHeader>
                <DialogTitle className="font-cinzel text-3xl text-primary">
                  {selectedDeity.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div
                  className="h-64 bg-cover bg-center rounded-sm"
                  style={{ backgroundImage: `url(${selectedDeity.image_url})` }}
                />
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Origin
                  </h4>
                  <p className="font-montserrat text-base text-foreground">{selectedDeity.origin}</p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Description
                  </h4>
                  <p className="font-montserrat text-base text-foreground leading-relaxed">
                    {selectedDeity.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Historical Context (1910-1945)
                  </h4>
                  <p className="font-montserrat text-base text-foreground leading-relaxed">
                    {selectedDeity.history}
                  </p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Associated Practices
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDeity.associated_practices.map((practice, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-sm font-montserrat text-xs text-primary"
                      >
                        {practice}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};