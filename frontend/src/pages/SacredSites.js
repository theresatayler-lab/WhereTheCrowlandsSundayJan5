import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { sitesAPI } from '../utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { MapPin } from 'lucide-react';

export const SacredSites = () => {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const data = await sitesAPI.getAll();
      setSites(data);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MapPin className="w-12 h-12 text-primary animate-pulse" />
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
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-4">Sacred Sites</h1>
          <p className="font-montserrat text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Power places across the UK and Europe that anchored occult practice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sites.map((site, index) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                testId={`site-card-${site.id}`}
                onClick={() => setSelectedSite(site)}
              >
                <div
                  className="h-48 -m-8 mb-6 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${site.image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-bloomsbury-rose mb-2">
                  {site.name}
                </h3>
                <p className="font-montserrat text-xs uppercase tracking-widest text-primary mb-3">
                  {site.location}, {site.country}
                </p>
                <p className="font-montserrat text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {site.historical_significance}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedSite} onOpenChange={() => setSelectedSite(null)}>
        <DialogContent className="max-w-3xl bg-card border-border" data-testid="site-detail-modal">
          {selectedSite && (
            <>
              <DialogHeader>
                <DialogTitle className="font-cinzel text-3xl text-primary">
                  {selectedSite.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div
                  className="h-64 bg-cover bg-center rounded-sm"
                  style={{ backgroundImage: `url(${selectedSite.image_url})` }}
                />
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Location
                  </h4>
                  <p className="font-montserrat text-base text-foreground">
                    {selectedSite.location}, {selectedSite.country}
                  </p>
                  <p className="font-montserrat text-sm text-muted-foreground mt-1">
                    Coordinates: {selectedSite.coordinates.lat}, {selectedSite.coordinates.lng}
                  </p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Historical Significance (1910-1945)
                  </h4>
                  <p className="font-montserrat text-base text-foreground leading-relaxed">
                    {selectedSite.historical_significance}
                  </p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-primary mb-2">
                    Period of Activity
                  </h4>
                  <p className="font-montserrat text-base text-foreground">{selectedSite.time_period}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};