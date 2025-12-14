import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { aiAPI } from '../utils/api';
import { Image as ImageIcon, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

export const AIImage = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.generateImage(prompt);
      setGeneratedImage(response.image_base64);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image');
      console.error('Image generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    'Hecate at a moonlit crossroads',
    'The Morrigan in crow form',
    'Stonehenge under a full moon',
    'Dion Fortune performing ritual',
    'Ancient grimoire with mystical symbols',
  ];

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-italiana text-4xl md:text-6xl text-primary mb-4">AI Image Generator</h1>
          <p className="font-montserrat text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate period-appropriate imagery inspired by the occult revival
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard hover={false} testId="image-generator-card">
            <h3 className="font-cinzel text-xl text-bloomsbury-rose mb-4">Create Your Vision</h3>
            
            <div className="mb-6">
              <label className="block font-montserrat text-sm text-muted-foreground uppercase tracking-wider mb-2">
                Image Prompt
              </label>
              <textarea
                data-testid="image-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                rows={4}
                className="w-full bg-input/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-sm px-4 py-3 text-foreground font-montserrat"
              />
            </div>

            <button
              onClick={handleGenerate}
              data-testid="generate-image-button"
              disabled={loading || !prompt.trim()}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Generating...'
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Image</span>
                </>
              )}
            </button>

            <div className="mt-6">
              <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-3">
                Example Prompts
              </p>
              <div className="space-y-2">
                {examplePrompts.map((example, idx) => (
                  <button
                    key={idx}
                    data-testid={`example-prompt-${idx}`}
                    onClick={() => setPrompt(example)}
                    className="w-full text-left px-3 py-2 bg-card/50 border border-border rounded-sm font-montserrat text-sm text-foreground hover:border-primary/30 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={false} testId="image-display-card">
            <h3 className="font-cinzel text-xl text-bloomsbury-rose mb-4">Generated Image</h3>
            
            {generatedImage ? (
              <div className="space-y-4">
                <img
                  src={`data:image/png;base64,${generatedImage}`}
                  alt="Generated artwork"
                  data-testid="generated-image"
                  className="w-full rounded-sm border border-primary/30"
                />
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `data:image/png;base64,${generatedImage}`;
                    link.download = 'mystic-image.png';
                    link.click();
                  }}
                  data-testid="download-image-button"
                  className="w-full px-6 py-2 bg-transparent text-primary border border-primary/30 rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/10 transition-all duration-300"
                >
                  Download Image
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <ImageIcon className="w-16 h-16 text-primary/30 mb-4" />
                <p className="font-montserrat text-muted-foreground">
                  Your generated image will appear here
                </p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};