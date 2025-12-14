import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, BookOpen, Users, MapPin, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1643324896137-f0928e76202a?crop=entropy&cs=srgb&fm=jpg&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-italiana text-5xl md:text-7xl text-primary mb-6 tracking-tight leading-none">
              Where The Crow Lands
            </h1>
            <p className="font-cinzel text-xl md:text-2xl text-accent mb-4">
              Got a problem? We've got a ritual for that.
            </p>
            <p className="font-montserrat text-base md:text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-8">
              Your DIY guide to authentic occult practice. From the documented witchcraft of 1910-1945
              to modern spellwork—activate the magick with historically-rooted formulas.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/spell-request"
                data-testid="hero-spell-request"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all duration-300 border border-primary/50 glow-effect flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Request a Spell</span>
              </Link>
              <Link
                to="/rituals"
                data-testid="hero-browse-rituals"
                className="px-8 py-3 bg-transparent text-primary border border-primary/30 rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/10 transition-all duration-300"
              >
                Browse Rituals
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-italiana text-3xl md:text-5xl text-center text-foreground mb-16 tracking-wide"
        >
          Explore the Archive
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/spell-request" data-testid="section-spell-request">
            <GlassCard testId="card-spell-request">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Spell Request</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                Describe your need, get a custom spell rooted in historical practice
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/deities" data-testid="section-deities">
            <GlassCard testId="card-deities">
              <Moon className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Deities</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                Hecate, The Morrigan, Cerridwen—goddesses of the revival period
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/figures" data-testid="section-figures">
            <GlassCard testId="card-figures">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Historical Figures</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                Gardner, Fortune, Crowley—pioneers of modern practice
              </p>
            </GlassCard>
          </Link>
          
          <Link to="/sites" data-testid="section-sites">
            <GlassCard testId="card-sites">
              <MapPin className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Sacred Sites</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                Stonehenge, Glastonbury—power places across Europe
              </p>
            </GlassCard>
          </Link>
        </div>
      </div>
      
      {/* About Section */}
      <div className="bg-card/30 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-italiana text-3xl md:text-5xl text-foreground mb-8">The DIY Etsy Witch Toolkit</h2>
          <p className="font-montserrat text-base md:text-lg text-foreground/80 leading-relaxed mb-6">
            Between the World Wars (1910-1945), a documented occult revival emerged. Figures like Gerald Gardner,
            Dion Fortune, and Aleister Crowley synthesized ceremonial magic, folk practices, and ancient traditions
            into systems that would shape modern witchcraft.
          </p>
          <p className="font-montserrat text-base md:text-lg text-foreground/80 leading-relaxed mb-6">
            This archive preserves that period's documented practices while helping you craft spells for modern needs.
            Each formula connects back to historical examples and verified sources—no made-up "ancient wisdom,"
            just honest research and practical magick.
          </p>
          <p className="font-montserrat text-sm text-accent italic">
            Historical note: While we document the claims and practices of this era, scholarly consensus treats
            many "ancient lineage" claims skeptically. We focus on what's documented and verifiable.
          </p>
        </div>
      </div>
    </div>
  );
};