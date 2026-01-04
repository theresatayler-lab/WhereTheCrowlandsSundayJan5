import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { GrimoirePage } from '../components/GrimoirePage';
import { aiAPI } from '../utils/api';
import { ARCHETYPES, getArchetypeById } from '../data/archetypes';
import { getCurrentArchetype, setCurrentArchetype } from '../components/OnboardingModal';
import { Sparkles, BookOpen, Feather, ChevronDown, Loader2, User, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const SpellRequest = ({ selectedArchetype: propArchetype }) => {
  const [problem, setProblem] = useState('');
  const [spellResult, setSpellResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeArchetype, setActiveArchetype] = useState(propArchetype || getCurrentArchetype());
  const [showArchetypeSelector, setShowArchetypeSelector] = useState(false);
  const [generateImage, setGenerateImage] = useState(true);

  const currentGuide = activeArchetype ? getArchetypeById(activeArchetype) : null;
  
  // Debug: Log archetypes
  console.log('ARCHETYPES in SpellRequest:', ARCHETYPES);
  console.log('Number of archetypes:', ARCHETYPES?.length);

  const handleArchetypeChange = (archetypeId) => {
    setActiveArchetype(archetypeId);
    setCurrentArchetype(archetypeId);
    setShowArchetypeSelector(false);
    if (archetypeId) {
      const guide = getArchetypeById(archetypeId);
      toast.success(`${guide.shortName} is now your guide`);
    } else {
      toast.info('Continuing without a guide');
    }
  };

  const handleGenerateSpell = async () => {
    if (!problem.trim()) {
      toast.error('Please describe what you need help with');
      return;
    }

    setLoading(true);
    setSpellResult(null);
    
    try {
      const response = await aiAPI.generateSpell(problem, activeArchetype, generateImage);
      setSpellResult(response);
      toast.success('Your spell has been crafted!');
    } catch (error) {
      toast.error('Failed to generate spell. Please try again.');
      console.error('Spell generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSpell = () => {
    setProblem('');
    setSpellResult(null);
  };

  // Get example problems based on current guide
  const getExampleProblems = () => {
    if (currentGuide) {
      return currentGuide.samplePrompts;
    }
    return [
      'Need protection during a difficult conversation',
      'Looking to attract new opportunities in my career',
      'Want to break a pattern of negative thinking',
      'Seeking clarity about a major life decision',
      'Need courage to pursue a creative project',
    ];
  };

  // If we have a spell result, show the grimoire page
  if (spellResult && spellResult.spell) {
    return (
      <div className="min-h-screen py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <GrimoirePage 
            spell={spellResult.spell}
            archetype={spellResult.archetype}
            imageBase64={spellResult.image_base64}
            onNewSpell={handleNewSpell}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-4">Build Your Ritual</h1>
          <p className="font-montserrat text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentGuide 
              ? `Guided by ${currentGuide.shortName}, ${currentGuide.title.toLowerCase()}`
              : 'Describe your need. Get a practical formula based on tested patterns. Adapt it as you go.'}
          </p>
        </motion.div>

        {/* Guide Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard hover={false}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {currentGuide ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl">{currentGuide.birdEmoji}</span>
                    </div>
                    <div>
                      <p className="font-cinzel text-sm text-secondary">Your Guide</p>
                      <p className="font-italiana text-xl text-primary">{currentGuide.shortName}</p>
                      <p className="font-montserrat text-xs text-muted-foreground">{currentGuide.title}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-cinzel text-sm text-secondary">No Guide Selected</p>
                      <p className="font-montserrat text-xs text-muted-foreground">Using neutral Crowlands guidance</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowArchetypeSelector(!showArchetypeSelector)}
                  className="px-4 py-2 bg-card border border-border rounded-sm font-montserrat text-xs tracking-wider text-muted-foreground hover:border-primary/30 transition-all flex items-center gap-2"
                >
                  <span>Change Guide</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showArchetypeSelector ? 'rotate-180' : ''}`} />
                </button>
                
                {showArchetypeSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-sm shadow-xl z-50 overflow-y-auto"
                    style={{ maxHeight: '500px' }}
                  >
                    <button
                      onClick={() => handleArchetypeChange(null)}
                      className={`w-full text-left px-4 py-3 font-montserrat text-sm hover:bg-primary/5 transition-all border-b border-border flex items-center gap-3 ${!activeArchetype ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="font-medium">No Guide</span>
                        <p className="text-xs text-muted-foreground">Neutral Crowlands guidance</p>
                      </div>
                    </button>
                    {ARCHETYPES.map((archetype) => (
                      <button
                        key={archetype.id}
                        onClick={() => handleArchetypeChange(archetype.id)}
                        className={`w-full text-left px-4 py-3 font-montserrat text-sm hover:bg-primary/5 transition-all border-b border-border last:border-b-0 flex items-center gap-3 ${activeArchetype === archetype.id ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                      >
                        <div 
                          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border"
                          style={{ backgroundColor: '#D8CBB3' }}
                        >
                          {archetype.image ? (
                            <img 
                              src={archetype.image} 
                              alt={archetype.shortName}
                              className="w-full h-full object-cover"
                              style={{ mixBlendMode: 'multiply', objectPosition: '50% 20%' }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              {archetype.birdEmoji}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium flex items-center gap-1">
                            {archetype.shortName}
                            <span className="text-sm">{archetype.birdEmoji}</span>
                          </span>
                          <p className="text-xs text-muted-foreground truncate">{archetype.title}</p>
                        </div>
                      </button>
                    ))}
                    <Link
                      to="/guides"
                      className="block w-full text-center px-4 py-2 font-montserrat text-xs text-primary hover:bg-primary/5 transition-all border-t border-border"
                    >
                      Meet All Guides →
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
            
            {currentGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-border"
              >
                <p className="font-crimson text-sm text-primary/80 italic">
                  {currentGuide.empowermentMessage}
                </p>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <GlassCard hover={false} testId="spell-request-input-card">
              <h3 className="font-cinzel text-xl text-secondary mb-4">
                {currentGuide ? `Ask ${currentGuide.shortName}` : 'What do you need?'}
              </h3>
              
              <div className="mb-6">
                <label className="block font-montserrat text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Describe your intention
                </label>
                <textarea
                  data-testid="spell-problem-input"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder={currentGuide 
                    ? `Tell ${currentGuide.shortName} what you need help with...`
                    : "I need help with..."}
                  rows={6}
                  className="w-full bg-input/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-sm px-4 py-3 text-foreground font-montserrat"
                />
              </div>

              {/* Image Generation Toggle */}
              <div className="mb-6 flex items-center justify-between p-3 bg-muted/20 rounded-sm">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <span className="font-montserrat text-sm text-foreground">Generate spell image</span>
                </div>
                <button
                  onClick={() => setGenerateImage(!generateImage)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    generateImage ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      generateImage ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={handleGenerateSpell}
                data-testid="generate-spell-button"
                disabled={loading || !problem.trim()}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{currentGuide ? `${currentGuide.shortName} is crafting...` : 'Crafting your spell...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Spell</span>
                  </>
                )}
              </button>

              <div className="mt-6">
                <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  {currentGuide ? `${currentGuide.shortName}'s Specialties` : 'Example Needs'}
                </p>
                <div className="space-y-2">
                  {getExampleProblems().map((example, idx) => (
                    <button
                      key={idx}
                      data-testid={`example-problem-${idx}`}
                      onClick={() => setProblem(example)}
                      className="w-full text-left px-3 py-2 bg-card/50 border border-border rounded-sm font-montserrat text-sm text-foreground hover:border-primary/30 transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-3">
            <GlassCard hover={false} testId="spell-response-card">
              <h3 className="font-cinzel text-xl text-secondary mb-4">
                {currentGuide ? `Spell by ${currentGuide.shortName}` : 'Your Custom Spell'}
              </h3>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-center">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                  <p className="font-montserrat text-muted-foreground mb-2">
                    {currentGuide 
                      ? `${currentGuide.shortName} is crafting your ritual...`
                      : 'Crafting your spell...'}
                  </p>
                  <p className="font-montserrat text-sm text-muted-foreground/70 mb-4">
                    This may take a moment as we research historical sources and craft your personalized ritual.
                  </p>
                  {generateImage && (
                    <p className="font-crimson text-sm text-accent italic">
                      ✦ Generating a custom image for your spell...
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center">
                  <BookOpen className="w-16 h-16 text-primary/30 mb-4" />
                  <p className="font-montserrat text-muted-foreground mb-2">
                    Your grimoire page will appear here
                  </p>
                  <p className="font-montserrat text-sm text-muted-foreground/70 max-w-md mb-4">
                    {currentGuide 
                      ? `${currentGuide.shortName} will create a complete ritual with materials, steps, historical context, and beautiful imagery.`
                      : 'Each spell includes materials, step-by-step instructions, historical sources, and optional custom imagery.'}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat text-muted-foreground">Materials list</span>
                    <span className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat text-muted-foreground">Ritual steps</span>
                    <span className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat text-muted-foreground">Spoken words</span>
                    <span className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat text-muted-foreground">Historical sources</span>
                    <span className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat text-muted-foreground">Custom image</span>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* Historical Context */}
        <div className="mt-12">
          <GlassCard hover={false}>
            <div className="flex items-start gap-4">
              <Feather className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-cinzel text-lg text-secondary mb-2">Magic as Science</h4>
                <p className="font-montserrat text-sm text-foreground/80 leading-relaxed mb-3">
                  These formulas aren&apos;t mystical secrets—they&apos;re patterns that people like Gardner, Fortune, and Crowley 
                  tested and documented. They work through focused intention, repetition, and symbolic frameworks. 
                  Like any science, you don&apos;t have to believe in it. You just practice it and see what happens.
                </p>
                <p className="font-montserrat text-sm text-accent italic">
                  You have the power. These are just formulas others used. Adapt them. Break them. Build your own.
                  No gatekeepers necessary.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
