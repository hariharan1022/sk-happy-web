import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function OpeningLoader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the splash screen has already been shown in this session
    const splashShown = sessionStorage.getItem('splash-shown');
    if (!splashShown) {
      setIsVisible(true);
      // Mark as shown so it doesn't run on subsequent navigation
      sessionStorage.setItem('splash-shown', 'true');
      
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -100, 
            transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.9] } 
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #FFF0F3 0%, #F5ECFF 50%, #E8F8FF 100%)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-heading)',
            textAlign: 'center',
            padding: '20px'
          }}
        >
          {/* Glowing Animated Logo Wrapper */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.05, 1], 
              opacity: 1, 
              transition: { duration: 0.8, ease: 'easeOut' } 
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px'
            }}
          >
            {/* Sparkly Mascot Icon */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: 'easeInOut' 
              }}
              className="loader-mascot"
              style={{
                filter: 'drop-shadow(0 8px 16px rgba(255, 117, 143, 0.2))'
              }}
            >
              ✨🌸✨
            </motion.div>

            {/* Typography */}
            <h1 className="loader-title" style={{
              fontWeight: '900',
              margin: '10px 0 5px 0',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(255, 117, 143, 0.1)'
            }}>
              SK Happy Little Things
            </h1>

            <p className="loader-subtitle" style={{
              color: 'var(--text-secondary)',
              fontWeight: '600',
              margin: '0 0 25px 0',
              opacity: 0.85
            }}>
              Where cute crafts find happy homes...
            </p>

            {/* Loading Bar */}
            <div style={{
              width: '180px',
              height: '6px',
              background: 'rgba(255, 117, 143, 0.15)',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  ease: 'easeInOut' 
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '50%',
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  borderRadius: '10px'
                }}
              />
            </div>
          </motion.div>

          {/* Sparkly Details */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={14} className="logo-sparkle" /> Handcrafted Premium Store
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            .loader-mascot {
              font-size: 4.5rem;
            }
            .loader-title {
              font-size: 2.8rem;
            }
            .loader-subtitle {
              font-size: 1.1rem;
            }
            @media (max-width: 768px) {
              .loader-mascot {
                font-size: 3.2rem;
              }
              .loader-title {
                font-size: 1.8rem;
              }
              .loader-subtitle {
                font-size: 0.95rem;
              }
            }
          `}} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
