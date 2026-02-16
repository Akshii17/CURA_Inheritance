import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQueryContext } from '../context/QueryContext';

const AuctionBidPlaced = () => {

  const {artworks} = useQueryContext();
  const { id } = useParams();

  const artObject = artworks?.find(
    (item) => String(item.artworkID) === id
  );
  console.log(artworks);
  console.log(artObject);

  const navigate = useNavigate();
  const location = useLocation();
  const [showTick, setShowTick] = useState(false);

  // States for pure inline CSS hover effects
  const [hoverProfile, setHoverProfile] = useState(false);
  const [hoverExplore, setHoverExplore] = useState(false);

  



  useEffect(() => {
    const timer = setTimeout(() => setShowTick(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: '"Inter", sans-serif', boxSizing: 'border-box' }}>
      
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', backgroundColor: '#7C3AED', opacity: 0.08, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}
      >
        {/* Artwork Image */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }} 
          style={{ position: 'relative', marginBottom: '15px' }}
        >
          <img
                          src={`https://gateway.pinata.cloud/ipfs/${artObject?.ipfsHash}`}
                          alt={artObject?.artworkTitle} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 15px 40px rgba(124,58,237,0.25)' }} />
        </motion.div>

        {/* Animated Tick */}
        <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
          <AnimatePresence>
            {showTick && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ type: "spring", stiffness: 200, damping: 20 }} 
                style={{ position: 'relative', width: '65px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: [0.8, 1.5, 1.8], opacity: [0, 0.4, 0] }} 
                  transition={{ duration: 1.5, ease: "easeOut", repeat: Infinity, repeatDelay: 0.5 }} 
                  style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: 'rgba(124,58,237,0.2)', zIndex: 0 }} 
                />
                <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%', color: '#7C3AED', zIndex: 10, filter: 'drop-shadow(0 0 8px rgba(124,58,237,0.8))' }}>
                  <motion.circle cx="25" cy="25" r="22" fill="none" strokeWidth="2" stroke="rgba(124, 58, 237, 0.15)" />
                  <motion.circle cx="25" cy="25" r="22" fill="none" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: "easeInOut" }} />
                  <motion.path fill="none" strokeWidth="3.5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, ease: "backOut", delay: 0.4 }} d="M15 25 l 7 7 l 14 -14" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 1.2 }} 
          style={{ textAlign: 'center', marginBottom: '30px' }}
        >
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontFamily: '"Cormorant Garamond", serif', color: '#F3E5AB', fontWeight: 600 }}>Bid Placed Successfully</h1>
          <p style={{ margin: 0, color: '#999', fontSize: '13px', lineHeight: '1.6' }}>
            You’re in the race for 
            <span style={{ color: '#fff', fontWeight: 500 }}>{" "}"{artObject?.artworkTitle}"</span> <br/>
            Keep an eye on active bids and jump back in to stay ahead
          </p>
        </motion.div>

        {/* Buttons (Pure Inline CSS interaction) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 1.4 }} 
          style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}
        >
          
          <button 
            onMouseEnter={() => setHoverExplore(true)}
            onMouseLeave={() => setHoverExplore(false)}
            onClick={() => navigate('/explore')}
            style={{ 
              width: '100%', 
              padding: '14px 20px', 
              background: hoverExplore ? 'rgba(255,255,255,0.05)' : 'transparent', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: hoverExplore ? '#ffffff' : '#aaa', 
              borderRadius: '12px', 
              fontSize: '11px', 
              fontWeight: 700, 
              letterSpacing: '1.5px', 
              textTransform: 'uppercase', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              transform: hoverExplore ? 'scale(1.03)' : 'scale(1)',
              transition: 'all 0.2s ease'
            }}
          >
            Continue Exploring
            <ArrowRight size={16} />
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default AuctionBidPlaced;