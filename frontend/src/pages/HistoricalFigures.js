import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { figuresAPI } from '../utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Users } from 'lucide-react';

export const HistoricalFigures = () => {
  const [figures, setFigures] = useState([]);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFigures();
  }, []);

  const fetchFigures = async () => {
    try {
      const data = await figuresAPI.getAll();
      setFigures(data);
    } catch (error) {
      console.error('Failed to fetch figures:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Users className="w-12 h-12 text-primary animate-pulse" />
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
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-4">Pioneers of the Craft</h1>
          <p className="font-montserrat text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            The visionaries who shaped modern occultism between the wars
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {figures.map((figure, index) => (
            <motion.div
              key={figure.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                testId={`figure-card-${figure.id}`}
                onClick={() => setSelectedFigure(figure)}
              >
                <div
                  className="h-48 -m-8 mb-6 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${figure.image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-bloomsbury-rose mb-2">
                  {figure.name}
                </h3>
                <p className="font-montserrat text-xs uppercase tracking-widest text-primary mb-3">
                  {figure.birth_death}
                </p>
                <p className="font-montserrat text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {figure.bio}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedFigure} onOpenChange={() => setSelectedFigure(null)}>
        <DialogContent className="max-w-3xl bg-card border-border" data-testid="figure-detail-modal">
          {selectedFigure && (
            <>
              <DialogHeader>
                <DialogTitle className="font-cinzel text-3xl text-primary">
                  {selectedFigure.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div
                  className="h-64 bg-cover bg-center rounded-sm"
                  style={{ backgroundImage: `url(${selectedFigure.image_url})` }}
                />
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Life
                  </h4>
                  <p className="font-montserrat text-base text-foreground">{selectedFigure.birth_death}</p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Biography
                  </h4>
                  <p className="font-montserrat text-base text-foreground leading-relaxed">
                    {selectedFigure.bio}
                  </p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Contributions
                  </h4>
                  <p className="font-montserrat text-base text-foreground leading-relaxed">
                    {selectedFigure.contributions}
                  </p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Notable Works
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedFigure.associated_works.map((work, idx) => (
                      <li key={idx} className="font-montserrat text-base text-foreground">
                        {work}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};