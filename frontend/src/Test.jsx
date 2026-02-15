import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wallet, Shield, Zap, Globe, Lock, Search, Gavel, Award } from 'lucide-react';

const LandingPage = () => {
  const THEME = {
    bg: '#050505',
    text: '#F5F1E8',
    accent: '#7C3AED',
    accentDark: '#5B21B6',
    border: 'rgba(255, 255, 255, 0.05)',
    cardBg: '#0A0A0A'
  };

  const IMAGES = [
  "https://i.pinimg.com/736x/32/93/ef/3293ef3b1276fcd8edbd532bfbc0ab4f.jpg", 
  "https://i.pinimg.com/236x/ef/8b/84/ef8b8447820f62d610233480660b6d70.jpg", 
  "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fin.pinterest.com%2Fpin%2Ffree-download-anime-landscape-wallpaper--418482990387268842%2F&ved=0CBYQjRxqFwoTCMiBrpWX1pIDFQAAAAAdAAAAABAu&opi=89978449", 
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-LRWoizLf1BtS98fullMWsvH-T7JoFE6TkA&s", 
  "https://i.pinimg.com/736x/af/06/85/af0685752abaadbe6c6524d3e9c92175.jpg", 
  "https://i.pinimg.com/736x/af/06/85/af0685752abaadbe6c6524d3e9c92175.jpg", 
  "https://i.pinimg.com/736x/32/93/ef/3293ef3b1276fcd8edbd532bfbc0ab4f.jpg", 
  "https://skyryedesign.com/wp-content/uploads/2023/10/557461260140497646-pin-image.jpg", 
  "https://doncorgi.com/wp-content/uploads/2023/07/03_Digital-Painting-Wave-by-Loish.jpg", 
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6kdXzZhV57lAPkoKoojaiFZ3kgMVA9rl0ww&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM5ZUxBaU1rwHzMXkq7js0YY5teBa0Ln5S5A&s", 
  "https://i.pinimg.com/originals/17/6e/c1/176ec1b46fbfd3bd8d2a947738563119.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS0bQkZT1ozx3rAXu9xOfjVyVqQxnv4_7L2g&s", 
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ525g5Yd_nBKnw6T3gC_nsBpvO-nqUXyVtvw&s", 
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHIyRsdWSZwWDR-50zMoI46yg6dm5uLJ8gaw&s", 
  "https://i.pinimg.com/736x/f2/e2/b3/f2e2b3d79a42989939bdc1cc97c24566.jpg", 
  "https://images.wallpapersden.com/image/download/dream-landscape-hd-ai-art_bmVsbWeUmZqaraWkpJRmbmpnrWZmZ2U.jpg", 
  "https://www.xtrafondos.com/wallpapers/amanecer-anime-chica-silueta-paisaje-3721.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS0bQkZT1ozx3rAXu9xOfjVyVqQxnv4_7L2g&s"  
];
  const FEATURES_DATA = [
    { id: 1, title: "Immutable Provenance", desc: "Ownership history is permanently recorded on the blockchain. Verifiable, tamper-proof, and forever yours.", icon: Shield },
    { id: 2, title: "Instant Liquidity", desc: "No waiting periods. Smart contracts handle settlements instantly, transferring assets and funds in seconds.", icon: Zap },
    { id: 3, title: "Global Access", desc: "A borderless marketplace connecting artists and collectors from every corner of the world.", icon: Globe },
    { id: 4, title: "Non-Custodial", desc: "You maintain 100% control. We never hold your private keys or your assets.", icon: Lock }
  ];

  const HOW_IT_WORKS = [
    { id: 1, title: "Connect Wallet", desc: "Link your MetaMask or Phantom wallet to authenticate securely.", icon: Wallet },
    { id: 2, title: "Discover Assets", desc: "Browse our curated collection of verified digital masterpieces.", icon: Search },
    { id: 3, title: "Place Your Bid", desc: "Participate in real-time auctions or buy instantly via smart contracts.", icon: Gavel },
    { id: 4, title: "Claim Ownership", desc: "Assets are transferred to your wallet immediately upon payment.", icon: Award }
  ];

  const collagePositions = [
    { top: '0%', left: '0%', width: '40%', height: '40%', z: 1 },
    { top: '5%', right: '0%', width: '35%', height: '35%', z: 1 },
    { bottom: '0%', left: '5%', width: '40%', height: '35%', z: 1 },
    { bottom: '10%', right: '0%', width: '30%', height: '40%', z: 1 },
    { top: '20%', left: '25%', width: '25%', height: '25%', z: 2 },
    { top: '35%', left: '0%', width: '20%', height: '30%', z: 2 },
    { top: '40%', right: '15%', width: '25%', height: '30%', z: 2 },
    { bottom: '0%', left: '40%', width: '25%', height: '25%', z: 2 },
    { top: '42%', left: '38%', width: '18%', height: '18%', z: 3 }, 
    { top: '25%', left: '55%', width: '22%', height: '28%', z: 3 }, 
    { top: '10%', left: '45%', width: '15%', height: '15%', z: 3 },
    { bottom: '5%', left: '48%', width: '16%', height: '16%', z: 3 },
    { top: '55%', right: '5%', width: '14%', height: '14%', z: 3 },
  ];

  const FilmStrip = ({ images, direction = "left", speed = 20 }) => {
    return (
      <div style={{ display: 'flex', overflow: 'hidden', width: '100%', gap: '20px', marginBottom: '20px', position: 'relative' }}>
        <motion.div
          initial={{ x: direction === "left" ? "0%" : "-50%" }}
          animate={{ x: direction === "left" ? "-50%" : "0%" }}
          transition={{ duration: speed, ease: "linear", repeat: Infinity }}
          style={{ display: 'flex', gap: '20px', flexShrink: 0 }}
        >
          {[...images, ...images, ...images, ...images].map((src, i) => (
            <div key={i} style={{ width: '300px', height: '40vh', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', position: 'relative', background: '#111' }}>
              <img src={src} alt="Atmosphere" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} />
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  const CollageCell = ({ img, initialDelay, style }) => {
    const [currentImg, setCurrentImg] = useState(img);

    useEffect(() => {
      let timeout;
      const cycleImage = () => {
        const randomInterval = Math.floor(Math.random() * 4000) + 6000;
        timeout = setTimeout(() => {
          const availableImages = IMAGES.filter(i => i !== currentImg);
          const nextImg = availableImages[Math.floor(Math.random() * availableImages.length)];
          setCurrentImg(nextImg);
          cycleImage();
        }, randomInterval);
      };

      const timer = setTimeout(cycleImage, initialDelay);
      return () => {
        clearTimeout(timer);
        clearTimeout(timeout);
      };
    }, [initialDelay, currentImg]);

    const depthShadow = style.zIndex === 3 
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.9)' 
      : style.zIndex === 2 
        ? '0 10px 30px -10px rgba(0, 0, 0, 0.7)' 
        : '0 4px 10px -5px rgba(0, 0, 0, 0.5)';

    const brightness = style.zIndex === 1 ? 'brightness(0.6)' : 'brightness(1)';

    return (
      <div style={{ 
        ...style, 
        overflow: 'hidden', 
        borderRadius: '4px',
        position: 'absolute', 
        background: '#1a1a1a', 
        border: style.zIndex === 3 ? `1px solid rgba(255,255,255,0.2)` : `1px solid rgba(255,255,255,0.05)`,
        boxShadow: depthShadow,
        filter: brightness,
        transition: 'all 0.5s ease', 
      }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImg}
            src={currentImg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)' }} />
      </div>
    );
  };

  const collageImages = useMemo(() => {
    return [...IMAGES].sort(() => 0.5 - Math.random()).slice(0, 13);
  }, []);

  return (
    <div style={{ backgroundColor: THEME.bg, color: THEME.text, minHeight: '100vh', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        body { margin: 0; overflow-x: hidden; background-color: ${THEME.bg}; }
        body::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <FilmStrip images={IMAGES} direction="left" speed={60} />
          <FilmStrip images={[...IMAGES].reverse()} direction="right" speed={70} />
          <FilmStrip images={IMAGES} direction="left" speed={65} />
        </div>

        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(5,5,5,0.5) 0%, rgba(5,5,5,1) 100%)', pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, textAlign: 'center', padding: '0 20px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(60px, 12vw, 180px)', lineHeight: 0.85, color: THEME.text, marginBottom: '24px', textShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>CURA.</h1>
            <p style={{ fontSize: '14px', letterSpacing: '6px', textTransform: 'uppercase', color: '#fff', marginBottom: '48px', fontWeight: 500, textShadow: '0 0 20px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.8)' }}>Decentralized Auction House</p>
            <button 
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: `1px solid ${THEME.accent}`, color: THEME.text, padding: '18px 48px', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '100px', transition: 'all 0.3s ease', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
              onMouseOver={(e) => { e.currentTarget.style.background = THEME.accent; e.currentTarget.style.color = THEME.bg; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = THEME.text; }}
            >
              Start Your Journey <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>

        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '30px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, mixBlendMode: 'difference' }}>
          <div style={{ fontWeight: 700, letterSpacing: '2px', fontSize: '14px', color: THEME.accent }}>CURA</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Wallet size={18} color={THEME.accent} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Connect Wallet</span>
          </div>
        </nav>
      </div>

      <section style={{ padding: '100px 24px', background: THEME.bg, position: 'relative', borderTop: `1px solid ${THEME.border}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <p style={{ color: THEME.accent, letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase', marginBottom: '16px' }}>Getting Started</p>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', color: THEME.text, margin: 0 }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            {HOW_IT_WORKS.map((step, index) => (
              <div key={step.id} style={{ textAlign: 'center', position: 'relative' }}>
                {index < HOW_IT_WORKS.length - 1 && (
                  <div style={{ position: 'absolute', top: '32px', left: '60%', width: '80%', height: '1px', background: 'linear-gradient(90deg, rgba(124, 58, 237, 0.5) 0%, rgba(124, 58, 237, 0) 100%)', display: window.innerWidth > 768 ? 'block' : 'none', zIndex: 0 }} />
                )}
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${THEME.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', position: 'relative', zIndex: 1, boxShadow: `0 0 20px ${THEME.accent}30` }}>
                  <step.icon size={28} color={THEME.accent} />
                </div>
                <h3 style={{ fontSize: '20px', color: THEME.text, marginBottom: '12px', fontWeight: 600 }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.6', padding: '0 10px' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '128px 24px', background: `linear-gradient(to bottom, ${THEME.bg}, #000)`, position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '60px', position: 'relative' }}>
          <div style={{ 
            flex: '1 1 500px', 
            height: '550px', 
            position: 'relative',
            perspective: '1000px'
          }}>
            {collagePositions.map((pos, index) => (
              <CollageCell 
                key={index}
                img={collageImages[index % collageImages.length]} 
                initialDelay={index * 300 + Math.random() * 1000} 
                style={{ 
                  top: pos.top, 
                  left: pos.left, 
                  right: pos.right,
                  bottom: pos.bottom,
                  width: pos.width, 
                  height: pos.height, 
                  zIndex: pos.z 
                }} 
              />
            ))}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: `radial-gradient(circle, ${THEME.accent}15 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 0 }} />
          </div>
          <div style={{ flex: '1 1 400px', position: 'relative', zIndex: 10 }}>
            <div style={{ marginBottom: '40px' }}>
              <p style={{ color: THEME.accent, letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase', marginBottom: '16px' }}>The Protocol</p>
              <h2 style={{ 
                fontFamily: '"Cormorant Garamond", serif', 
                fontSize: '56px', 
                margin: 0, 
                background: `linear-gradient(to right, #fff 20%, ${THEME.accent} 100%)`, 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                lineHeight: 1
              }}>
                Why Choose Cura
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {FEATURES_DATA.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    flexShrink: 0, width: '48px', height: '48px', borderRadius: '12px', 
                    background: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${THEME.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.accent,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  }}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', color: THEME.text, marginBottom: '8px', fontWeight: 600 }}>{item.title}</h3>
                    <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', background: THEME.bg, borderTop: `1px solid ${THEME.border}`, textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '42px', color: THEME.text, marginBottom: '24px', fontFamily: '"Cormorant Garamond", serif' }}>Ready to Begin?</h2>
          <p style={{ color: '#888', fontSize: '16px', marginBottom: '40px', lineHeight: '1.6' }}>Connect your wallet to unlock the full experience. Browse exclusive collections, bid in real-time, and manage your portfolio.</p>
          <button 
            style={{ 
              background: THEME.accent, color: '#fff', border: 'none', padding: '16px 48px', fontSize: '14px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 10px 30px ${THEME.accent}40`, display: 'inline-flex', alignItems: 'center', gap: '12px', transition: 'transform 0.2s' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Connect Wallet Now <Wallet size={18} />
          </button>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;