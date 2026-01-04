import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Feather, Moon, BookOpen, Sparkles } from 'lucide-react';
import { ARCHETYPES } from '../data/archetypes';

const ONBOARDING_KEY = 'crowlands_onboarding_complete';
const ARCHETYPE_KEY = 'crowlands_selected_archetype';

export const OnboardingModal = ({ onComplete, onSelectArchetype }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: welcome, 1: select archetype
  const [selectedArchetype, setSelectedArchetype] = useState(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasCompletedOnboarding) {
      setIsOpen(true);
    } else {
      // Load saved archetype
      const savedArchetype = localStorage.getItem(ARCHETYPE_KEY);
      if (savedArchetype && onSelectArchetype) {
        onSelectArchetype(savedArchetype);
      }
    }
  }, [onSelectArchetype]);

  const handleComplete = (archetypeId) => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    if (archetypeId) {
      localStorage.setItem(ARCHETYPE_KEY, archetypeId);
    }
    setIsOpen(false);
    if (onComplete) onComplete();
    if (onSelectArchetype) onSelectArchetype(archetypeId);
  };

  const handleSkip = () => {
    handleComplete(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-black/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && handleSkip()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-parchment border-2 border-primary/30 rounded-sm shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-primary transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 0 ? (
            <WelcomeStep onContinue={() => setStep(1)} onSkip={handleSkip} />
          ) : (
            <ArchetypeSelectionStep
              selectedArchetype={selectedArchetype}
              onSelect={setSelectedArchetype}
              onComplete={() => handleComplete(selectedArchetype)}
              onSkip={handleSkip}
              onBack={() => setStep(0)}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const WelcomeStep = ({ onContinue, onSkip }) => (
  <div className="p-8 md:p-12 text-center">
    {/* Decorative header */}
    <div className="flex justify-center mb-6">
      <div className="relative">
        <Feather className="w-16 h-16 text-primary" />
        <Sparkles className="w-6 h-6 text-accent absolute -top-1 -right-1" />
      </div>
    </div>

    <h1 className="font-italiana text-3xl md:text-4xl text-primary mb-4">
      Welcome to Where the Crowlands
    </h1>

    <div className="max-w-2xl mx-auto space-y-4 mb-8">
      <p className="font-crimson text-lg text-foreground leading-relaxed">
        A place where the wisdom of your foremothers, the songs of birds, and the science of ritual meet.
      </p>
      <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
        Here, magic is not a mystery to be sold, but a practice to be reclaimed. Choose a guide from 
        the women who walked before you, or simply ask the wind for what you need.
      </p>
      <p className="font-crimson text-base text-accent italic">
        Every question is a spell, every answer a step towards your own power.
      </p>
    </div>

    {/* Features */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <FeatureCard
        icon={Moon}
        title="Ancestral Wisdom"
        description="Learn from four generations of women who practiced in secret"
      />
      <FeatureCard
        icon={BookOpen}
        title="Practical Rituals"
        description="Get tested formulas you can adapt to your own needs"
      />
      <FeatureCard
        icon={Sparkles}
        title="Your Power"
        description="No gatekeepers. No intermediaries. Just you and the work."
      />
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={onContinue}
        className="px-8 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
      >
        <span>Choose a Guide</span>
        <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={onSkip}
        className="px-8 py-3 bg-transparent text-muted-foreground border border-border rounded-sm font-montserrat tracking-widest uppercase text-sm hover:border-primary/30 hover:text-primary transition-all"
      >
        Continue Without a Guide
      </button>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-4 bg-card/50 border border-border rounded-sm">
    <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
    <h3 className="font-cinzel text-sm text-secondary mb-1">{title}</h3>
    <p className="font-montserrat text-xs text-muted-foreground">{description}</p>
  </div>
);

const ArchetypeSelectionStep = ({ selectedArchetype, onSelect, onComplete, onSkip, onBack }) => (
  <div className="p-6 md:p-8">
    <div className="text-center mb-6">
      <h2 className="font-italiana text-2xl md:text-3xl text-primary mb-2">
        Choose Your Guide
      </h2>
      <p className="font-montserrat text-sm text-muted-foreground max-w-xl mx-auto">
        Each woman brings her own wisdom, ritual style, and era of practice. 
        Select one to personalize your experience, or continue without a guide.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {ARCHETYPES.map((archetype) => (
        <ArchetypeCard
          key={archetype.id}
          archetype={archetype}
          isSelected={selectedArchetype === archetype.id}
          onSelect={() => onSelect(archetype.id)}
        />
      ))}
    </div>

    <div className="flex flex-col sm:flex-row gap-3 justify-center border-t border-border pt-6">
      <button
        onClick={onBack}
        className="px-6 py-2 bg-transparent text-muted-foreground border border-border rounded-sm font-montserrat tracking-widest uppercase text-xs hover:border-primary/30 transition-all"
      >
        Back
      </button>
      <button
        onClick={onComplete}
        disabled={!selectedArchetype}
        className="px-8 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span>{selectedArchetype ? 'Begin with Guide' : 'Select a Guide'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={onSkip}
        className="px-6 py-2 bg-transparent text-muted-foreground border border-border rounded-sm font-montserrat tracking-widest uppercase text-xs hover:border-primary/30 transition-all"
      >
        Skip for Now
      </button>
    </div>
  </div>
);

const ArchetypeCard = ({ archetype, isSelected, onSelect }) => {
  // Placeholder silhouette SVGs for vintage woodcut aesthetic
  const PlaceholderSilhouette = () => (
    <div className="w-full h-32 bg-gradient-to-b from-card to-muted/30 flex items-center justify-center rounded-t-sm border-b border-border">
      <div className="relative">
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary/20">
          <ellipse cx="50" cy="35" rx="20" ry="25" fill="currentColor" />
          <path d="M30 60 Q50 90 70 60 Q50 75 30 60" fill="currentColor" />
          <circle cx="50" cy="30" r="15" fill="currentColor" opacity="0.5" />
        </svg>
        <span className="absolute bottom-0 right-0 text-2xl">{archetype.birdEmoji}</span>
      </div>
    </div>
  );

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`text-left bg-card/50 border-2 rounded-sm overflow-hidden transition-all duration-300 ${
        isSelected
          ? 'border-primary shadow-lg shadow-primary/20'
          : 'border-border hover:border-primary/30'
      }`}
    >
      <PlaceholderSilhouette />
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-cinzel text-base text-secondary">{archetype.shortName}</h3>
            <p className="font-montserrat text-xs text-primary">{archetype.title}</p>
          </div>
          <span className="text-xs font-montserrat text-muted-foreground bg-muted/50 px-2 py-1 rounded-sm">
            {archetype.era}
          </span>
        </div>
        
        <p className="font-montserrat text-xs text-muted-foreground mb-3 line-clamp-2">
          {archetype.bio.substring(0, 120)}...
        </p>
        
        <div className="flex items-center gap-2 text-xs font-montserrat text-accent">
          <span>{archetype.birdEmoji}</span>
          <span>{archetype.birdSymbol}</span>
        </div>
        
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 pt-3 border-t border-primary/20"
          >
            <p className="font-crimson text-xs text-primary italic line-clamp-2">
              {archetype.empowermentMessage.substring(0, 100)}...
            </p>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

// Utility to reset onboarding (for testing)
export const resetOnboarding = () => {
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(ARCHETYPE_KEY);
  window.location.reload();
};

// Utility to get current archetype
export const getCurrentArchetype = () => {
  return localStorage.getItem(ARCHETYPE_KEY);
};

// Utility to set archetype
export const setCurrentArchetype = (archetypeId) => {
  if (archetypeId) {
    localStorage.setItem(ARCHETYPE_KEY, archetypeId);
  } else {
    localStorage.removeItem(ARCHETYPE_KEY);
  }
};
