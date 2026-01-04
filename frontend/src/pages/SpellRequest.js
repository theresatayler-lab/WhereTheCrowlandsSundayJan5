import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { aiAPI } from '../utils/api';
import { ARCHETYPES, getArchetypeById } from '../data/archetypes';
import { getCurrentArchetype, setCurrentArchetype } from '../components/OnboardingModal';
import { Sparkles, AlertCircle, BookOpen, Feather, ChevronDown, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const SpellRequest = ({ selectedArchetype: propArchetype }) => {
  const [problem, setProblem] = useState('');
  const [spellResponse, setSpellResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeArchetype, setActiveArchetype] = useState(propArchetype || getCurrentArchetype());
  const [showArchetypeSelector, setShowArchetypeSelector] = useState(false);

  const currentGuide = activeArchetype ? getArchetypeById(activeArchetype) : null;

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
    try {
      // Build the prompt based on whether there's an archetype
      let prompt;
      if (currentGuide) {
        prompt = `A practitioner comes to you seeking guidance:

"${problem}"

Respond AS ${currentGuide.name}, in your characteristic voice and style. Create a spell or ritual using YOUR specific tradition and approach.

Include:
1. An opening in your characteristic voice
2. A practical spell formula from your tradition
3. Materials you would recommend
4. Step-by-step ritual instructions in your style
5. Historical or personal precedent for this approach
6. Why you chose this particular approach

Stay completely in character. This is how YOU would handle this need.`;
      } else {
        prompt = `As a guide in the Crowlands tradition, help create a spell/ritual for this need: "${problem}"

Provide:
1. A practical spell formula
2. Required materials (historically attested where possible)
3. The ritual steps
4. Historical precedent - cite specific practices from figures like Gardner, Fortune, Crowley, or traditional folk magic
5. Sources/references for the historical elements

Be clear about what is documented historical practice vs. modern adaptation. Keep it practical and honest.`;
      }

      const response = await aiAPI.chat(prompt, null, activeArchetype);
      setSpellResponse({
        text: response.response,
        guide: currentGuide
      });
      toast.success('Spell formula generated!');
    } catch (error) {
      toast.error('Failed to generate spell. Please try again.');
      console.error('Spell generation error:', error);
    } finally {
      setLoading(false);
    }
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
                    className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-sm shadow-xl z-20"
                  >
                    <button
                      onClick={() => handleArchetypeChange(null)}
                      className={`w-full text-left px-4 py-3 font-montserrat text-sm hover:bg-primary/5 transition-all border-b border-border ${!activeArchetype ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                    >
                      <span className="font-medium">No Guide</span>
                      <p className="text-xs text-muted-foreground">Neutral guidance</p>
                    </button>
                    {ARCHETYPES.map((archetype) => (
                      <button
                        key={archetype.id}
                        onClick={() => handleArchetypeChange(archetype.id)}
                        className={`w-full text-left px-4 py-3 font-montserrat text-sm hover:bg-primary/5 transition-all border-b border-border last:border-b-0 ${activeArchetype === archetype.id ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                      >
                        <span className="font-medium">{archetype.birdEmoji} {archetype.shortName}</span>
                        <p className="text-xs text-muted-foreground">{archetype.title}</p>
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
                  Describe your situation
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

          {/* Response Section */}
          <div className="lg:col-span-3">
            <GlassCard hover={false} testId="spell-response-card">
              <h3 className="font-cinzel text-xl text-secondary mb-4">
                {spellResponse?.guide ? `Spell by ${spellResponse.guide.shortName}` : 'Your Custom Spell'}
              </h3>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-center">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                  <p className="font-montserrat text-muted-foreground mb-2">
                    {currentGuide 
                      ? `${currentGuide.shortName} is crafting your ritual...`
                      : 'Crafting your spell...'}
                  </p>
                  <p className="font-crimson text-sm text-accent italic">
                    {currentGuide?.tenets?.[0] || 'Magic is a science of intention, repetition, and symbolic frameworks.'}
                  </p>
                </div>
              ) : spellResponse ? (
                <div className="space-y-4">
                  {spellResponse.guide && (
                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-sm">
                      <span className="text-2xl">{spellResponse.guide.birdEmoji}</span>
                      <div>
                        <p className="font-cinzel text-sm text-primary">{spellResponse.guide.shortName}</p>
                        <p className="font-montserrat text-xs text-muted-foreground">{spellResponse.guide.title}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-card/50 border border-primary/20 rounded-sm">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <p className="font-montserrat text-sm text-accent leading-relaxed">
                        {spellResponse.guide 
                          ? `This spell is crafted in ${spellResponse.guide.shortName}'s tradition. Adapt it to your own practice.`
                          : 'This spell combines documented historical practices with practical adaptation. Always verify sources and use your judgment.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <div className="font-montserrat text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {spellResponse.text}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(spellResponse.text);
                        toast.success('Spell copied to clipboard!');
                      }}
                      data-testid="copy-spell-button"
                      className="px-4 py-2 bg-transparent text-primary border border-primary/30 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/10 transition-all duration-300"
                    >
                      Copy Spell
                    </button>
                    <button
                      onClick={() => {
                        setProblem('');
                        setSpellResponse(null);
                      }}
                      data-testid="new-spell-button"
                      className="px-4 py-2 bg-transparent text-primary border border-primary/30 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/10 transition-all duration-300"
                    >
                      Request Another
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center">
                  <BookOpen className="w-16 h-16 text-primary/30 mb-4" />
                  <p className="font-montserrat text-muted-foreground mb-2">
                    Your customized spell will appear here
                  </p>
                  <p className="font-montserrat text-sm text-muted-foreground/70 max-w-md">
                    {currentGuide 
                      ? `${currentGuide.shortName} will create a ritual in her unique tradition, drawing from ${currentGuide.historicalSources?.[0] || 'ancestral wisdom'}.`
                      : 'Each formula is generated based on documented practices from the 1910-1945 occult revival, with clear citations to historical sources.'}
                  </p>
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
                  These formulas aren't mystical secrets—they're patterns that people like Gardner, Fortune, and Crowley 
                  tested and documented. They work through focused intention, repetition, and symbolic frameworks. 
                  Like any science, you don't have to believe in it. You just practice it and see what happens.
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
