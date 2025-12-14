import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { aiAPI } from '../utils/api';
import { Sparkles, AlertCircle, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export const SpellRequest = () => {
  const [problem, setProblem] = useState('');
  const [spellResponse, setSpellResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateSpell = async () => {
    if (!problem.trim()) {
      toast.error('Please describe what you need help with');
      return;
    }

    setLoading(true);
    try {
      const prompt = `As a historian of 1910-1945 occult practices, help create a spell/ritual for this need: "${problem}"

Provide:
1. A practical spell formula
2. Required materials (historically attested where possible)
3. The ritual steps
4. Historical precedent - cite specific practices from figures like Gardner, Fortune, Crowley, or traditional folk magic
5. Sources/references for the historical elements

Be clear about what is documented historical practice vs. modern adaptation. Keep it practical and honest.`;

      const response = await aiAPI.chat(prompt);
      setSpellResponse(response.response);
      toast.success('Spell formula generated!');
    } catch (error) {
      toast.error('Failed to generate spell. Please try again.');
      console.error('Spell generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exampleProblems = [
    'Need protection during a difficult conversation',
    'Looking to attract new opportunities in my career',
    'Want to break a pattern of negative thinking',
    'Seeking clarity about a major life decision',
    'Need courage to pursue a creative project',
  ];

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
            Describe your need. Get a practical formula based on tested patterns. Adapt it as you go.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <GlassCard hover={false} testId="spell-request-input-card">
              <h3 className="font-cinzel text-xl text-secondary mb-4">What do you need?</h3>
              
              <div className="mb-6">
                <label className="block font-montserrat text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Describe your situation
                </label>
                <textarea
                  data-testid="spell-problem-input"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="I need help with..."
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
                  'Crafting your spell...'
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Spell</span>
                  </>
                )}
              </button>

              <div className="mt-6">
                <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Example Needs
                </p>
                <div className="space-y-2">
                  {exampleProblems.map((example, idx) => (
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
              <h3 className="font-cinzel text-xl text-secondary mb-4">Your Custom Spell</h3>
              
              {spellResponse ? (
                <div className="space-y-4">
                  <div className="p-4 bg-card/50 border border-primary/20 rounded-sm">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <p className="font-montserrat text-sm text-accent leading-relaxed">
                        This spell combines documented historical practices with practical adaptation.
                        Always verify sources and use your judgment.
                      </p>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <div className="font-montserrat text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {spellResponse}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(spellResponse);
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
                    Each formula is generated based on documented practices from the 1910-1945 occult revival,
                    with clear citations to historical sources.
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
              <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-cinzel text-lg text-secondary mb-2">About Our Approach</h4>
                <p className="font-montserrat text-sm text-foreground/80 leading-relaxed mb-3">
                  Every spell generated here draws from documented historical practices of the 1910-1945 period.
                  We cite specific practitioners (Gardner, Fortune, Crowley, folk traditions) and clearly distinguish
                  between verified historical practice and modern adaptation.
                </p>
                <p className="font-montserrat text-sm text-accent italic">
                  Historical accuracy note: Many claims from this era about "ancient lineages" are disputed by scholars.
                  We focus on what's documented and cite our sources honestly.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};