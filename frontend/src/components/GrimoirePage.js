import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, Clock, Moon, Sun, Calendar, 
  BookOpen, Feather, Copy, Download, CheckCircle2, Circle,
  Flame, Droplets, Wind, Sparkles, Star, Eye, Heart,
  AlertTriangle, Quote, History, Users
} from 'lucide-react';
import { toast } from 'sonner';

// Icon mapping for materials
const MATERIAL_ICONS = {
  candle: Flame,
  herb: Feather,
  crystal: Star,
  feather: Feather,
  water: Droplets,
  fire: Flame,
  moon: Moon,
  sun: Sun,
  book: BookOpen,
  pen: Feather,
  mirror: Eye,
  salt: Sparkles,
  oil: Droplets,
  incense: Wind,
  bell: Sparkles,
  cord: Heart,
  photo: Eye,
  bowl: Circle,
};

// Archetype-specific styling
const ARCHETYPE_STYLES = {
  shiggy: {
    borderColor: 'border-primary',
    accentColor: 'text-primary',
    bgAccent: 'bg-primary/5',
    headerGradient: 'from-primary/20 to-transparent',
  },
  kathleen: {
    borderColor: 'border-secondary',
    accentColor: 'text-secondary',
    bgAccent: 'bg-secondary/5',
    headerGradient: 'from-secondary/20 to-transparent',
  },
  catherine: {
    borderColor: 'border-accent',
    accentColor: 'text-accent',
    bgAccent: 'bg-accent/5',
    headerGradient: 'from-accent/20 to-transparent',
  },
  theresa: {
    borderColor: 'border-primary',
    accentColor: 'text-primary',
    bgAccent: 'bg-primary/5',
    headerGradient: 'from-primary/10 via-secondary/10 to-transparent',
  },
  neutral: {
    borderColor: 'border-border',
    accentColor: 'text-primary',
    bgAccent: 'bg-muted/30',
    headerGradient: 'from-muted/30 to-transparent',
  },
};

export const GrimoirePage = ({ spell, archetype, imageBase64, onNewSpell }) => {
  const [showHistoricalContext, setShowHistoricalContext] = useState(false);
  const [checklistMode, setChecklistMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const style = ARCHETYPE_STYLES[archetype?.id] || ARCHETYPE_STYLES.neutral;
  
  const toggleStep = (stepNumber) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const copySpellToClipboard = () => {
    const text = `${spell.title}\n\n${spell.introduction}\n\nMaterials:\n${spell.materials?.map(m => `- ${m.name}`).join('\n')}\n\nSteps:\n${spell.steps?.map(s => `${s.number}. ${s.title}: ${s.instruction}`).join('\n')}\n\nSpoken Words:\n${spell.spoken_words?.invocation}\n${spell.spoken_words?.main_incantation}\n${spell.spoken_words?.closing}`;
    navigator.clipboard.writeText(text);
    toast.success('Spell copied to clipboard!');
  };

  if (spell.parse_error) {
    return (
      <div className="bg-card/50 border border-border rounded-sm p-6">
        <h3 className="font-cinzel text-xl text-secondary mb-4">Your Spell</h3>
        <div className="font-montserrat text-sm text-foreground whitespace-pre-wrap">
          {spell.raw_response}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card/80 border-2 ${style.borderColor} rounded-sm overflow-hidden shadow-xl`}
    >
      {/* Header Image */}
      {imageBase64 && (
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img 
            src={`data:image/png;base64,${imageBase64}`}
            alt={spell.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${style.headerGradient}`} />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-card to-transparent">
            <h1 className="font-italiana text-3xl md:text-4xl text-primary drop-shadow-lg">
              {spell.title}
            </h1>
            {spell.subtitle && (
              <p className="font-montserrat text-sm text-foreground/80 mt-1">{spell.subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* No image header */}
      {!imageBase64 && (
        <div className={`p-6 ${style.bgAccent} border-b border-border`}>
          <h1 className="font-italiana text-3xl md:text-4xl text-primary">{spell.title}</h1>
          {spell.subtitle && (
            <p className="font-montserrat text-sm text-muted-foreground mt-1">{spell.subtitle}</p>
          )}
        </div>
      )}

      <div className="p-6 md:p-8 space-y-8">
        {/* Archetype Attribution */}
        {archetype && (
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <span className="text-2xl">{archetype.id === 'shiggy' ? '🪶' : archetype.id === 'kathleen' ? '🦉' : archetype.id === 'catherine' ? '🐦' : '🪽'}</span>
            <div>
              <p className="font-cinzel text-sm text-secondary">Crafted by {archetype.name}</p>
              <p className="font-montserrat text-xs text-muted-foreground">{archetype.title}</p>
            </div>
          </div>
        )}

        {/* Introduction */}
        {spell.introduction && (
          <div className={`p-4 ${style.bgAccent} border-l-4 ${style.borderColor} rounded-r-sm`}>
            <p className="font-crimson text-base md:text-lg text-foreground italic leading-relaxed">
              {spell.introduction}
            </p>
          </div>
        )}

        {/* Timing */}
        {spell.timing && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TimingCard icon={Moon} label="Moon Phase" value={spell.timing.moon_phase} />
            <TimingCard icon={Sun} label="Time" value={spell.timing.time_of_day} />
            <TimingCard icon={Calendar} label="Day" value={spell.timing.day} />
            <TimingCard icon={Clock} label="Note" value={spell.timing.note} small />
          </div>
        )}

        {/* Materials */}
        {spell.materials && spell.materials.length > 0 && (
          <section>
            <h2 className="font-cinzel text-xl text-secondary mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Materials Needed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {spell.materials.map((material, idx) => {
                const IconComponent = MATERIAL_ICONS[material.icon] || Circle;
                return (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-muted/20 border border-border rounded-sm"
                  >
                    <div className={`p-2 ${style.bgAccent} rounded-sm`}>
                      <IconComponent className={`w-5 h-5 ${style.accentColor}`} />
                    </div>
                    <div>
                      <p className="font-montserrat text-sm font-medium text-foreground">{material.name}</p>
                      {material.note && (
                        <p className="font-montserrat text-xs text-muted-foreground mt-0.5">{material.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Ritual Steps */}
        {spell.steps && spell.steps.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-cinzel text-xl text-secondary flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                The Ritual
              </h2>
              <button
                onClick={() => setChecklistMode(!checklistMode)}
                className={`px-3 py-1 rounded-sm text-xs font-montserrat tracking-wider transition-all ${
                  checklistMode 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                {checklistMode ? 'Checklist On' : 'Track Progress'}
              </button>
            </div>
            
            <div className="space-y-4">
              {spell.steps.map((step) => (
                <motion.div 
                  key={step.number}
                  className={`relative pl-12 pb-4 ${step.number < spell.steps.length ? 'border-l-2 border-border ml-4' : 'ml-4'}`}
                >
                  {/* Step number circle */}
                  <div 
                    className={`absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-cinzel cursor-pointer transition-all ${
                      completedSteps.has(step.number)
                        ? 'bg-accent text-accent-foreground'
                        : `${style.bgAccent} ${style.accentColor} border-2 ${style.borderColor}`
                    }`}
                    onClick={() => checklistMode && toggleStep(step.number)}
                  >
                    {checklistMode && completedSteps.has(step.number) ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  
                  <div className={`transition-opacity ${checklistMode && completedSteps.has(step.number) ? 'opacity-50' : ''}`}>
                    <h3 className="font-cinzel text-base text-secondary mb-1">{step.title}</h3>
                    <p className="font-montserrat text-sm text-foreground leading-relaxed">{step.instruction}</p>
                    {step.duration && (
                      <p className="font-montserrat text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {step.duration}
                      </p>
                    )}
                    {step.note && (
                      <p className="font-crimson text-xs text-accent italic mt-1">✦ {step.note}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Spoken Words */}
        {spell.spoken_words && (
          <section className={`p-6 ${style.bgAccent} border ${style.borderColor} rounded-sm`}>
            <h2 className="font-cinzel text-xl text-secondary mb-4 flex items-center gap-2">
              <Quote className="w-5 h-5" />
              Words of Power
            </h2>
            
            <div className="space-y-4">
              {spell.spoken_words.invocation && (
                <div>
                  <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-1">Opening Invocation</p>
                  <p className="font-crimson text-base text-foreground italic">&ldquo;{spell.spoken_words.invocation}&rdquo;</p>
                </div>
              )}
              
              {spell.spoken_words.main_incantation && (
                <div className="py-4 border-y border-border/50">
                  <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-2">Main Incantation</p>
                  <p className="font-crimson text-lg text-primary text-center leading-relaxed">
                    &ldquo;{spell.spoken_words.main_incantation}&rdquo;
                  </p>
                </div>
              )}
              
              {spell.spoken_words.closing && (
                <div>
                  <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-1">Closing Words</p>
                  <p className="font-crimson text-base text-foreground italic">&ldquo;{spell.spoken_words.closing}&rdquo;</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Historical Context (Collapsible) */}
        {spell.historical_context && (
          <section className="border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setShowHistoricalContext(!showHistoricalContext)}
              className="w-full p-4 flex items-center justify-between bg-muted/20 hover:bg-muted/30 transition-all"
            >
              <span className="font-cinzel text-base text-secondary flex items-center gap-2">
                <History className="w-5 h-5" />
                Historical Context & Sources
              </span>
              {showHistoricalContext ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {showHistoricalContext && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4 border-t border-border">
                    {spell.historical_context.tradition && (
                      <div>
                        <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider">Tradition</p>
                        <p className="font-montserrat text-sm text-foreground">{spell.historical_context.tradition}</p>
                      </div>
                    )}
                    
                    {spell.historical_context.time_period && (
                      <div>
                        <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider">Time Period</p>
                        <p className="font-montserrat text-sm text-foreground">{spell.historical_context.time_period}</p>
                      </div>
                    )}
                    
                    {spell.historical_context.practitioners && spell.historical_context.practitioners.length > 0 && (
                      <div>
                        <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Users className="w-3 h-3" /> Historical Practitioners
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {spell.historical_context.practitioners.map((name, idx) => (
                            <span key={idx} className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {spell.historical_context.sources && spell.historical_context.sources.length > 0 && (
                      <div>
                        <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-2">Sources & References</p>
                        <div className="space-y-2">
                          {spell.historical_context.sources.map((source, idx) => (
                            <div key={idx} className="p-3 bg-muted/20 rounded-sm">
                              <p className="font-montserrat text-sm text-foreground">
                                <strong>{source.author}</strong>, <em>{source.work}</em> ({source.year})
                              </p>
                              {source.relevance && (
                                <p className="font-montserrat text-xs text-muted-foreground mt-1">{source.relevance}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {spell.historical_context.cultural_notes && (
                      <div className="p-3 bg-accent/10 border-l-2 border-accent rounded-r-sm">
                        <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-1">Cultural Notes</p>
                        <p className="font-crimson text-sm text-foreground italic">{spell.historical_context.cultural_notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Variations */}
        {spell.variations && spell.variations.length > 0 && (
          <section>
            <h2 className="font-cinzel text-lg text-secondary mb-3">Variations & Adaptations</h2>
            <div className="space-y-2">
              {spell.variations.map((variation, idx) => (
                <div key={idx} className="p-3 bg-muted/20 rounded-sm">
                  <p className="font-montserrat text-sm font-medium text-foreground">{variation.name}</p>
                  <p className="font-montserrat text-xs text-muted-foreground">{variation.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Warnings */}
        {spell.warnings && spell.warnings.length > 0 && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-sm">
            <p className="font-montserrat text-xs text-destructive uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Important Considerations
            </p>
            <ul className="space-y-1">
              {spell.warnings.map((warning, idx) => (
                <li key={idx} className="font-montserrat text-sm text-foreground">• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Closing Message */}
        {spell.closing_message && (
          <div className={`p-4 ${style.bgAccent} border-l-4 ${style.borderColor} rounded-r-sm`}>
            <p className="font-crimson text-base text-foreground italic">{spell.closing_message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <button
            onClick={copySpellToClipboard}
            className="px-4 py-2 bg-transparent text-primary border border-primary/30 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/10 transition-all flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Spell
          </button>
          <button
            onClick={() => toast.info('PDF export coming soon!')}
            className="px-4 py-2 bg-transparent text-primary border border-primary/30 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/10 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Save as PDF
          </button>
          <button
            onClick={onNewSpell}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/90 transition-all"
          >
            New Spell
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TimingCard = ({ icon: Icon, label, value, small = false }) => (
  <div className="p-3 bg-muted/20 border border-border rounded-sm text-center">
    <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
    <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className={`font-cinzel ${small ? 'text-xs' : 'text-sm'} text-foreground`}>{value || 'Any'}</p>
  </div>
);
