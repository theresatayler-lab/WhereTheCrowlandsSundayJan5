import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, BookOpen, Users, MapPin, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

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
        
        <div className="relative z-10 text-center max-w-5xl px-6 flex flex-col items-center">
          {/* Large Central Logo */}
          <img 
            src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/li34ks3x_Where%20the%20Crowlands%20Logos.png"
            alt="Where The Crowlands"
            className="w-64 h-64 mb-8"
          />
          
          <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-italiana text-5xl md:text-7xl text-primary mb-6 tracking-tight leading-none">
              Where The Crowlands
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
      </div>

      {/* Decorative Divider - Larger */}
      <div className="flex justify-center py-16 -mt-12">
        <img 
          src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/flkqjy53_Now_can_we_create_a_full_brand_from_this_with_graphic_downloa_0fd417a5-4e03-4cd2-a771-053079e14c28_0.png"
          alt="Decorative crow"
          className="h-32 opacity-80"
          style={{ mixBlendMode: 'multiply' }}
        />
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
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/flkqjy53_Now_can_we_create_a_full_brand_from_this_with_graphic_downloa_0fd417a5-4e03-4cd2-a771-053079e14c28_0.png"
                alt="Spell Request"
                className="w-24 h-24 mx-auto mb-4 opacity-70"
                style={{ mixBlendMode: 'multiply' }}
              />
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Spell Request</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Describe your need, get a custom spell rooted in historical practice
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
                Hecate, The Morrigan, Cerridwen—goddesses of the revival period
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
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Historical Figures</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Gardner, Fortune, Crowley—pioneers of modern practice
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
              <h3 className="font-cinzel text-xl font-bold text-secondary mb-2">Sacred Sites</h3>
              <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                Stonehenge, Glastonbury—power places across Europe
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
      <div className="relative bg-card/30 py-24 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 bg-engraving-coral bg-cover bg-center"
          style={{ mixBlendMode: 'multiply' }}
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
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