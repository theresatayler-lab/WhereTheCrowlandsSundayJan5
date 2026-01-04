import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { ARCHETYPES, getArchetypeById } from '../data/archetypes';
import { setCurrentArchetype, getCurrentArchetype } from '../components/OnboardingModal';
import { Feather, BookOpen, Sparkles, Heart, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

export const Guides = () => {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const currentArchetypeId = getCurrentArchetype();

  const handleSelectAsGuide = (archetypeId) => {
    setCurrentArchetype(archetypeId);
    toast.success(`${getArchetypeById(archetypeId).shortName} is now your guide`);
    setSelectedGuide(null);
  };

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Feather className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-italiana text-4xl md:text-5xl text-primary mb-4">
            Meet the Guides
          </h1>
          <p className="font-montserrat text-base text-muted-foreground max-w-2xl mx-auto mb-2">
            Four generations of women who practiced in secret, each with her own wisdom, 
            ritual style, and way of seeing the world.
          </p>
          <p className="font-crimson text-lg text-accent italic">
            &ldquo;The women who walked before you left their spells in stories, their magic in memories.&rdquo;
          </p>
        </motion.div>

        {/* Current Guide Banner */}
        {currentArchetypeId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-primary/10 border border-primary/30 rounded-sm text-center"
          >
            <p className="font-montserrat text-sm text-primary">
              <Check className="w-4 h-4 inline mr-2" />
              Your current guide: <strong>{getArchetypeById(currentArchetypeId)?.shortName}</strong>
            </p>
          </motion.div>
        )}

        {/* Guides Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ARCHETYPES.map((archetype, index) => (
            <GuideCard
              key={archetype.id}
              archetype={archetype}
              index={index}
              isCurrentGuide={currentArchetypeId === archetype.id}
              isExpanded={selectedGuide === archetype.id}
              onToggle={() => setSelectedGuide(selectedGuide === archetype.id ? null : archetype.id)}
              onSelectAsGuide={() => handleSelectAsGuide(archetype.id)}
            />
          ))}
        </div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <GlassCard hover={false}>
            <div className="flex items-start gap-4">
              <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-cinzel text-xl text-secondary mb-3">The Lineage</h3>
                <p className="font-montserrat text-sm text-foreground/80 leading-relaxed mb-3">
                  These four women span over a century of practice—from Victorian Spitalfields to contemporary 
                  London. Each carried the magic forward in her own way: through craft, through secrets, through 
                  poetry, and through truth-telling.
                </p>
                <p className="font-crimson text-base text-accent italic">
                  You don&apos;t need to choose just one. Their wisdom overlaps, contradicts, and complements. 
                  Like any family, they argue. Like any lineage, they build on what came before.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

const GuideCard = ({ archetype, index, isCurrentGuide, isExpanded, onToggle, onSelectAsGuide }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-card/50 border-2 rounded-sm overflow-hidden transition-all duration-300 ${
        isCurrentGuide ? 'border-primary shadow-lg' : 'border-border'
      }`}
    >
      {/* Image or Placeholder */}
      <div 
        className="w-full h-56 flex items-center justify-center border-b border-border overflow-hidden relative"
        style={{ backgroundColor: '#D8CBB3' }}
      >
        {archetype.image ? (
          <>
            <img 
              src={archetype.image} 
              alt={archetype.shortName}
              className="w-full h-full object-cover"
              style={{ 
                objectPosition: '50% 25%',
                mixBlendMode: 'multiply'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <span className="text-3xl drop-shadow-lg">{archetype.birdEmoji}</span>
              {isCurrentGuide && (
                <span className="text-xs font-montserrat text-primary-foreground bg-primary px-2 py-1 rounded-sm shadow-lg">
                  Your Guide
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="relative flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-28 h-28 text-primary/25">
              <ellipse cx="50" cy="35" rx="18" ry="22" fill="currentColor" />
              <path d="M32 55 Q50 85 68 55 Q50 70 32 55" fill="currentColor" />
              <circle cx="50" cy="30" r="12" fill="currentColor" opacity="0.6" />
            </svg>
            <span className="text-3xl mt-2">{archetype.birdEmoji}</span>
            {isCurrentGuide && (
              <span className="absolute top-3 right-3 text-xs font-montserrat text-primary-foreground bg-primary px-2 py-1 rounded-sm">
                Your Guide
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-italiana text-2xl text-primary">{archetype.shortName}</h2>
              {isCurrentGuide && (
                <span className="text-xs font-montserrat text-primary-foreground bg-primary px-2 py-0.5 rounded-sm">
                  Your Guide
                </span>
              )}
            </div>
            <p className="font-cinzel text-sm text-secondary">{archetype.title}</p>
            <p className="font-montserrat text-xs text-muted-foreground mt-1">{archetype.era}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl">{archetype.birdEmoji}</span>
            <p className="font-montserrat text-xs text-accent">{archetype.birdSymbol}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="font-montserrat text-sm text-foreground/80 leading-relaxed mb-4">
          {archetype.bio}
        </p>

        {/* Empowerment Message */}
        <div className="p-4 bg-primary/5 border-l-2 border-primary rounded-r-sm mb-4">
          <p className="font-crimson text-sm text-primary italic">
            {archetype.empowermentMessage}
          </p>
        </div>

        {/* Expandable Details */}
        <button
          onClick={onToggle}
          className="w-full text-left font-montserrat text-xs text-primary uppercase tracking-wider flex items-center gap-2 mb-4"
        >
          <span>{isExpanded ? 'Show Less' : 'Show Details'}</span>
          <ArrowRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 border-t border-border pt-4"
          >
            {/* Ritual Style */}
            <div>
              <h4 className="font-cinzel text-sm text-secondary mb-2">Ritual Style</h4>
              <p className="font-montserrat text-xs text-muted-foreground">{archetype.ritualStyle}</p>
            </div>

            {/* Specialties */}
            <div>
              <h4 className="font-cinzel text-sm text-secondary mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {archetype.specialties.map((specialty, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-muted/50 text-xs font-montserrat text-muted-foreground rounded-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div>
              <h4 className="font-cinzel text-sm text-secondary mb-2">Best For</h4>
              <ul className="space-y-1">
                {archetype.bestFor.map((item, i) => (
                  <li key={i} className="font-montserrat text-xs text-muted-foreground flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tenets */}
            <div>
              <h4 className="font-cinzel text-sm text-secondary mb-2">Core Tenets</h4>
              <ul className="space-y-1">
                {archetype.tenets.slice(0, 4).map((tenet, i) => (
                  <li key={i} className="font-crimson text-xs text-foreground/70 italic">
                    "{tenet}"
                  </li>
                ))}
              </ul>
            </div>

            {/* Historical Sources */}
            <div>
              <h4 className="font-cinzel text-sm text-secondary mb-2">Historical Sources</h4>
              <ul className="space-y-1">
                {archetype.historicalSources.map((source, i) => (
                  <li key={i} className="font-montserrat text-xs text-muted-foreground">
                    • {source}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        {!isCurrentGuide && (
          <button
            onClick={onSelectAsGuide}
            className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            <span>Choose as My Guide</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
