import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, BookOpen, Users, MapPin, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { DecorativeDivider } from '../components/DecorativeDivider';

export const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-12">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: '0.35',
            mixBlendMode: 'multiply',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>
        
        <div className="relative z-10 text-center max-w-5xl px-4 sm:px-6 flex flex-col items-center">
          {/* Large Central Logo - lighten blend makes black transparent */}
          <img 
            src="https://customer-assets.emergentagent.com/job_diywizardry/artifacts/9hb654f4_image.png"
            alt="Where The Crowlands"
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-4 sm:mb-6 object-contain"
            style={{ mixBlendMode: 'lighten' }}
          />
          
          <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-italiana text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary mb-4 sm:mb-6 tracking-tight leading-none">
              Where The Crowlands
            </h1>
            <p className="font-cinzel text-lg sm:text-xl md:text-2xl text-accent mb-3 sm:mb-4">
              Got a problem? We've got a ritual for that.
            </p>
            <p className="font-montserrat text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              You don't need an Etsy witch or tarot reader to access your power. Build your own practice with formulas, 
              sacred geometry, and intentional effort. Magic is science—patterns and shapes we put into practice.
            </p>
            
            {/* Art Deco accent line */}
            <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-deep-blue/40"></div>
              <span className="text-deep-blue/60 text-sm">✦</span>
              <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-deep-blue/40"></div>
            </div>
            
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap px-2">
              <Link
                to="/spell-request"
                data-testid="hero-spell-request"
                className="relative px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-xs sm:text-sm hover:bg-primary/90 transition-all duration-300 border-2 border-deep-blue/20 glow-effect flex items-center gap-2 min-h-[48px] overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-deep-blue/0 via-deep-blue/10 to-deep-blue/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                <span className="relative z-10">Request a Spell</span>
              </Link>
              <Link
                to="/rituals"
                data-testid="hero-create-ritual"
                className="px-6 sm:px-8 py-3 bg-transparent text-deep-blue border-2 border-deep-blue/40 rounded-sm font-montserrat tracking-widest uppercase text-xs sm:text-sm hover:bg-deep-blue/10 transition-all duration-300 min-h-[48px]"
              >
                Create Ritual
              </Link>
            </div>
          </motion.div>
          </div>
        </div>
      </div>

      {/* Art Deco Decorative Divider */}
      <DecorativeDivider symbol="🌙" />

      {/* Featured Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-deep-blue/40"></div>
            <span className="text-deep-blue/60 text-lg">✦</span>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-deep-blue/40"></div>
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-deep-blue mb-3 tracking-wide font-bold border-4 border-deep-blue/30 py-4 px-6 rounded-sm bg-deep-blue/5">
            Explore the Archive
          </h2>
          <p className="font-crimson text-sm sm:text-base text-deep-blue/70 italic">
            Four centuries of tested formulas at your fingertips
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link to="/spell-request" data-testid="section-spell-request">
            <GlassCard testId="card-spell-request">
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/flkqjy53_Now_can_we_create_a_full_brand_from_this_with_graphic_downloa_0fd417a5-4e03-4cd2-a771-053079e14c28_0.png"
                alt="Spell Request"
                className="w-24 h-24 mx-auto mb-4 opacity-70"
                style={{ mixBlendMode: 'multiply' }}
              />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Build Your Spell</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Describe your need, get a practical formula based on tested patterns
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/deities" data-testid="section-deities">
            <GlassCard testId="card-deities">
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/1sqgo2ps_Now_can_we_create_a_full_brand_from_this_with_graphic_downloa_0fd417a5-4e03-4cd2-a771-053079e14c28_3.png"
                alt="Deities"
                className="w-24 h-24 mx-auto mb-4 opacity-70"
                style={{ mixBlendMode: 'multiply' }}
              />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Deities</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Archetypes and energies to work with—Hecate, Morrigan, Cerridwen
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/figures" data-testid="section-figures">
            <GlassCard testId="card-figures">
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/nngy4wmz_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_3.png"
                alt="Historical Figures"
                className="w-24 h-24 mx-auto mb-4 opacity-70"
                style={{ mixBlendMode: 'multiply' }}
              />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">The Experimenters</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Gardner, Fortune, Crowley—they tested formulas so you can adapt them
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/sites" data-testid="section-sites">
            <GlassCard testId="card-sites">
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/u9u50jrz_Now_can_we_create_a_full_brand_from_this_with_graphic_downloa_0fd417a5-4e03-4cd2-a771-053079e14c28_2.png"
                alt="Sacred Sites"
                className="w-24 h-24 mx-auto mb-4 opacity-70"
                style={{ mixBlendMode: 'multiply' }}
              />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Power Places</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Sacred geometry in the land—Stonehenge, Glastonbury, and beyond
              </p>
            </GlassCard>
          </Link>
        </div>
      </div>
      
      {/* Decorative Divider - Larger Sacred Geometry */}
      <div className="flex justify-center py-16">
        <img 
          src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/u9u50jrz_Now_can_we_create_a_full_brand_from_this_with_graphic_downloa_0fd417a5-4e03-4cd2-a771-053079e14c28_2.png"
          alt="Decorative crow in triangle"
          className="h-40 opacity-70"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* About Section */}
      <div className="relative bg-card/30 py-12 sm:py-16 md:py-24 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 bg-engraving-coral bg-cover bg-center"
          style={{ mixBlendMode: 'multiply' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-italiana text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 sm:mb-8">Your Power Doesn't Need Permission</h2>
          <p className="font-montserrat text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed mb-4 sm:mb-6">
            Magic isn't mystical—it's intentional effort combined with patterns, formulas, and sacred geometry. 
            Like alchemy before it became chemistry, these are frameworks for focusing will and creating change.
            You don't have to believe in magic for it to work. You just have to practice it.
          </p>
          <p className="font-montserrat text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed mb-4 sm:mb-6">
            This toolkit draws from documented practices (1910-1945) not because they're "ancient secrets," but because 
            they're tested formulas. Gardner, Fortune, and Crowley weren't mystics—they were experimenters synthesizing 
            patterns that produced results. Now you can do the same, without gatekeepers or expensive services.
          </p>
          <p className="font-montserrat text-xs sm:text-sm text-accent italic">
            You don't need to buy empowerment. You already have your intuition, your will, and your ability to create ritual.
            This archive just shows you the formulas others have used—adapt them, break them, build your own.
          </p>
        </div>
      </div>
    </div>
  );
};