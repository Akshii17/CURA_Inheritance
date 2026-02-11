import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView, animate } from 'framer-motion';
import { Clock, TrendingUp, User, Hexagon, ArrowRight, Menu, X } from 'lucide-react';

const HomePage = () => {
  const FEATURED_COLLECTION = [
    { id: 101, title: 'Ethereal Dimensions', artist: 'Isabella Romano', currentBid: '8.5 ETH', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200' },
    { id: 102, title: 'Neon Genesis', artist: 'CyberPunk_J', currentBid: '4.2 ETH', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200' },
    { id: 103, title: 'Europeana', artist: 'Marcus Rivera', currentBid: '6.9 ETH', image: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=748&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 104, title: 'Golden Hour', artist: 'Elena K.', currentBid: '10.5 ETH', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200' },
    { id: 105, title: 'Abstract Reality', artist: 'David P.', currentBid: '5.2 ETH', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200' }
  ];

  const LIVE_DATA = [
    { id: 5, title: 'Urban Exp', artist: 'Alex R.', currentBid: '5.6 ETH', bids: 23, image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600', timeLeft: '2h 15m' },
    { id: 6, title: 'Color Study', artist: 'Nina K.', currentBid: '2.1 ETH', bids: 12, image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600', timeLeft: '4h 20m' },
    { id: 7, title: 'Function', artist: 'David P.', currentBid: '3.3 ETH', bids: 18, image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600', timeLeft: '1h 05m' },
    { id: 8, title: 'Refraction', artist: 'Emma T.', currentBid: '1.8 ETH', bids: 9, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600', timeLeft: '6h 30m' }
  ];

  const STATS_DATA = [
    { label: 'Total Volume', value: 245, suffix: 'K', unit: 'ETH' },
    { label: 'Artworks Sold', value: 12.4, suffix: 'K', unit: '+' },
    { label: 'Active Artists', value: 8.5, suffix: 'K', unit: '+' },
    { label: 'Community', value: 156, suffix: 'K', unit: '+' }
  ];

  const ART_IMAGES = [
    "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_alTprnk0UQiLsWsrH_TRsj1Um1clgkH7mw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuOZw7O50XynSd3dc1IMhUeP_NBqJ7_IpxNQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqsgnKDZ5Ar6MSTvcHgjLh-JX7tsr8OrHIhA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy48aYtD2F1und2g31KjGLn7RbYWKLG6Tbow&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy48aYtD2F1und2g31KjGLn7RbYWKLG6Tbow&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2FNPsaIiMkXzhvmDCuMQHf6GuurECOp0gUg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3ZvFjJZOID7WGiKOSS2VFYQ9YP6ZGwx6Vaw&s",
    "https://i.ytimg.com/vi/KgsyDjarT8Q/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD6271ELWGU4pMUVKlraElKKw-Adg"
  ];
  const AnimatedCounter = ({ from = 0, to, duration = 2 }) => {
    const nodeRef = useRef();
    const inView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
      if (!inView) return;
      const node = nodeRef.current;  
      const controls = animate(from, to, {
        duration: duration,
        ease: "easeOut",
        onUpdate(value) {
          const hasDecimal = to % 1 !== 0;
          node.textContent = hasDecimal ? value.toFixed(1) : Math.round(value);
        }
      });
      return () => controls.stop();
    }, [from, to, inView, duration]);
    return <span ref={nodeRef} />;
  };

  const StickyCard = ({ item, index, total, scrollYProgress }) => {
    const step = 1 / (total - 1);
    const centerPoint = index * step; 
    const buffer = 0.15;

    const scale = useTransform(scrollYProgress, [centerPoint - buffer, centerPoint, centerPoint + buffer], [0.85, 1.15, 0.85]);
    const opacity = useTransform(scrollYProgress, [centerPoint - buffer, centerPoint, centerPoint + buffer], [0.3, 1, 0.3]);
    const blur = useTransform(scrollYProgress, [centerPoint - buffer, centerPoint, centerPoint + buffer], ["blur(4px)", "blur(0px)", "blur(4px)"]);
    const zIndex = useTransform(scrollYProgress, [centerPoint - buffer, centerPoint, centerPoint + buffer], [1, 10, 1]); 

    return (
      <motion.div
        style={{
          scale,
          opacity,
          filter: blur,
          zIndex,
          width: '600px',
          height: '500px',
          flexShrink: 0,
          position: 'relative',
          marginRight: '60px' 
        }}
      >
        <div className="card-hover" style={{ width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden', background: '#111', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '65%', width: '100%', overflow: 'hidden' }}>
            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: 28, margin: '0 0 8px 0', fontFamily: 'var(--font-serif)', color: 'white' }}>{item.title}</h3>
            <p style={{ color: '#888', margin: 0 }}>by {item.artist}</p>
            <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#aaa', fontSize: 12 }}>CURRENT BID</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>{item.currentBid}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const StickyFeaturedSection = () => {
    const targetRef = useRef(null);
    
    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
    const x = useTransform(smoothProgress, [0, 1], ["35%", "-75%"]);

    return (
      <section ref={targetRef} style={{ height: "400vh", position: "relative", background: '#050505' }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 50, zIndex: 20 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, color: '#7c3AED', marginBottom: 10 }}>CURATED SELECTION</div>
            <h2 style={{ fontSize: 48, fontFamily: 'var(--font-serif)', margin: 0, color: '#f2f0f5ff' }}>Featured Auctions</h2>
          </div>

          <motion.div style={{ x, display: "flex", alignItems: 'center', width: 'max-content', paddingLeft: '0' }}>
            {FEATURED_COLLECTION.map((item, index) => (
              <StickyCard 
                key={item.id} 
                item={item} 
                index={index} 
                total={FEATURED_COLLECTION.length} 
                scrollYProgress={smoothProgress} 
              />
            ))}
          </motion.div>

          <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', color: '#444', fontSize: 12 }}>
          </div>
        </div>
      </section>
    );
  };

  const ArtCard = ({ artwork, isLive }) => (
    <div className="card-hover" style={{ background: 'linear-gradient(135deg, rgba(20,20,20,0.4) 0%, rgba(10,10,10,0.4) 100%)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', height: 340, overflow: 'hidden' }}>
        <div className="image-zoom" style={{ backgroundImage: `url(${artwork.image})`, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        {isLive && (
          <div style={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
            <TrendingUp size={12} /> LIVE
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
      </div>
      <div style={{ padding: 28 }}>
        <h3 style={{ fontSize: 24, fontWeight: 400, margin: '0 0 8px 0', fontFamily: 'var(--font-serif)' }}>{artwork.title}</h3>
        <p style={{ fontSize: 14, color: '#6b6b6b', margin: '0 0 24px 0' }}>by {artwork.artist}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: '#6b6b6b', marginBottom: 6 }}>CURRENT BID</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{artwork.currentBid}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#6b6b6b', marginBottom: 6 }}>ENDS IN</div>
            <div style={{ fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={14} /> {artwork.timeLeft}
            </div>
          </div>
        </div>
        {isLive && <button className="primary-btn" style={{ width: '100%', padding: 12, borderRadius: 10, fontSize: 14 }}>Place Bid</button>}
      </div>
    </div>
  );

  const GridCell = ({ cell }) => (
    <div style={{ gridColumn: `span ${cell.colSpan}`, gridRow: `span ${cell.rowSpan}`, position: 'relative', overflow: 'hidden', margin: 1, backgroundColor: '#050505' }}>
      <img src={cell.img} alt="bg" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.5)', opacity: 0.6, transform: 'scale(1.2)', animation: `blink 4s infinite alternate ${cell.delay}` }} />
    </div>
  );

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeNav, setActiveNav] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const heroBlur = useTransform(scrollYProgress, [0, 0.2], ["blur(0px)", "blur(10px)"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);

  const gridCells = useMemo(() => Array.from({ length: 120 }).map((_, i) => {
    const rand = Math.random();
    let colSpan = rand > 0.6 ? 2 : 1;
    let rowSpan = rand > 0.75 ? 2 : 1;
    if (rand > 0.9) { colSpan = 2; rowSpan = 2; }
    const imgIndex = Math.floor(Math.random() * ART_IMAGES.length);
    const delay = Math.floor(Math.random() * 5) + 's';
    return { id: i, colSpan, rowSpan, img: ART_IMAGES[imgIndex], delay };
  }), []);

  const handleNavClick = (item) => {
    setActiveNav(item);
    setIsMobileMenuOpen(false);
    if (item === 'Home') navigate('/home');
    else if (item === 'Analytics') navigate('/analytics');
    else if (item === 'Explore') navigate('/explore');
    else if (item === 'Studio') navigate('/studio');
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#e0e0e0', position: 'relative' }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        :root { --font-serif: 'Playfair Display', serif; --font-sans: 'Manrope', sans-serif; }
        
        body { font-family: var(--font-sans); margin: 0; overflow-x: hidden; background-color: #050505; }
        
        .noise-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: url("https://grainy-gradients.vercel.app/noise.svg"); opacity: 0.05; pointer-events: none; z-index: 50; mix-blend-mode: overlay; }
        .spotlight { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(800px circle at var(--x) var(--y), rgba(255, 255, 255, 0.06), transparent 40%); pointer-events: none; z-index: 1; }
        .primary-btn { background-color: #ffffff; color: #000000; border: none; transition: transform 0.2s, box-shadow 0.2s; white-space: nowrap; cursor: pointer; }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15); }
        .secondary-btn { background-color: transparent; color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.3s; white-space: nowrap; cursor: pointer; }
        .secondary-btn:hover { background-color: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.3); }
        .card-hover { transition: all 0.4s ease; border: 1px solid rgba(255, 255, 255, 0.06); }
        .card-hover:hover { border-color: rgba(255, 255, 255, 0.15); transform: translateY(-8px); box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6); }
        .image-zoom { transition: transform 0.6s ease; width: 100%; height: 100%; background-size: cover; background-position: center; }
        .card-hover:hover .image-zoom { transform: scale(1.08); }
        .marquee-content { display: inline-block; animation: marquee 30s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes blink { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        
        @media (max-width: 1024px) {
           .responsive-padding { padding-left: 30px !important; padding-right: 30px !important; }
           .hero-title { fontSize: 56px !important; }
        }
        @media (max-width: 768px) {
           .desktop-nav { display: none !important; }
           .mobile-btn { display: block !important; }
           .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 30px !important; }
           .stat-box { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px !important; }
           .art-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
           .section-header { flex-direction: column; align-items: flex-start !important; gap: 20px; }
           .hide-mobile { display: none !important; }
        }
      `}</style>

      <div className="noise-overlay" />
      <div className="spotlight" style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` }} />

      {/*header, pls change it..*/}
      <header className="responsive-padding" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)', zIndex: 1000 }}>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-serif)', color: '#fff' }}>
          <Hexagon size={28} strokeWidth={1.5} /> CURA
        </div>
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <nav style={{ display: 'flex', gap: 40 }}>
            {['Home', 'Explore', 'Studio', 'Analytics'].map((item) => (
              <button key={item} onClick={() => handleNavClick(item)} style={{ background: 'none', border: 'none', color: activeNav === item ? '#ffffff' : '#6b6b6b', cursor: 'pointer', fontSize: 13, padding: 0, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', position: 'relative' }}>
                {item}
                {activeNav === item && <div style={{ position: 'absolute', bottom: -8, left: 0, right: 0, height: 2, backgroundColor: '#ffffff' }} />}
              </button>
            ))}
          </nav>
          <Link to="/profile">
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
              <User size={20} color="#ffffff" />
            </div>
          </Link>
        </div>
        <button className="mobile-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {isMobileMenuOpen && (
          <div style={{ position: 'fixed', top: 80, left: 0, right: 0, bottom: 0, backgroundColor: '#050505', zIndex: 999, padding: 40, display: 'flex', flexDirection: 'column', gap: 30, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
             {['Home', 'Explore', 'Studio', 'Analytics'].map((item) => (
              <button key={item} onClick={() => handleNavClick(item)} style={{ background: 'none', border: 'none', color: activeNav === item ? '#ffffff' : '#6b6b6b', cursor: 'pointer', fontSize: 20, padding: 0, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'left' }}>{item}</button>
            ))}
             <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ marginTop: 20, color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}><User size={20} /> My Profile</Link>
          </div>
        )}
      </header>

      <main style={{ position: 'relative', zIndex: 2 }}>
        
        {/*hero*/}
        <section className="responsive-padding" style={{ padding: '40px 60px 20px', position: 'relative', overflow: 'hidden', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', cursor: 'default' }}>
          <motion.div 
            style={{ 
              position: 'absolute', top: '-10%', left: '-10%', right: '-10%', bottom: '-10%', 
              display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 80, gridAutoFlow: 'dense', gap: 0, 
              transform: 'rotate(-2deg) scale(1.05)', pointerEvents: 'none', zIndex: 0,
              filter: heroBlur, opacity: heroOpacity
            }}
          >
            {gridCells.map((cell) => (
              <GridCell key={cell.id} cell={cell} />
            ))}
          </motion.div>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, background: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, transparent 10%, rgba(5,5,5,0.85) 100%)` }} />
          <div style={{ maxWidth: 1400, width: '100%', margin: '0 auto', position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '6px 20px', backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)', borderRadius: 30, fontSize: 10, letterSpacing: 2, marginBottom: 24, fontWeight: 600, textTransform: 'uppercase', color: '#7c3AED' }}>Decentralized Marketplace</div>
            <h1 className="hero-title" style={{ fontSize: 72, fontWeight: 400, margin: '0 0 20px 0', letterSpacing: -2, lineHeight: 1.1, fontFamily: 'var(--font-serif)', color: '#fff', textShadow: '0 10px 30px rgba(0,0,0,0.9)' }}>Where Art Meets <br /><span style={{ fontStyle: 'italic', color: '#7c3AED' }}>Blockchain</span></h1>
            <p style={{ fontSize: 18, color: '#e0e0e0', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6, fontWeight: 300, textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>Discover extraordinary digital masterpieces. Bid, collect, and own pieces of art history.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40 }}>
              <button onClick={() => navigate('/how-it-works')} className="primary-btn" style={{ padding: '14px 32px', borderRadius: 12, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 30px rgba(147, 61, 179, 0.6)' }}>How it works <ArrowRight size={16} /></button>
            </div>
          </div>
        </section>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 0', background: 'rgba(255,255,255,0.005)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div className="marquee-content">
            {Array(10).fill("LIVE AUCTIONS • DIRECT SALES").map((text, i) => (
              <span key={i} style={{ fontSize: 12, margin: '0 20px', letterSpacing: 3, color: '#444', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{text}</span>
            ))}
          </div>
        </div>

        <section className="responsive-padding" style={{ padding: '40px 60px', position: 'relative' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center' }}>
              {STATS_DATA.map((stat, index) => (
                <div key={index} className={`stat-box ${index === 3 ? 'no-border' : ''}`} style={{ padding: 10, textAlign: 'center', borderRight: index === 3 ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="stat-item" style={{ cursor: 'default' }}>
                    <div style={{ fontSize: 48, fontWeight: 400, marginBottom: 4, fontFamily: 'var(--font-serif)', color: '#ffffff', lineHeight: 1 }}>
                      {/* INTEGRATED ANIMATED COUNTER HERE */}
                      <AnimatedCounter to={stat.value} />
                      {stat.suffix}<span style={{ fontSize: 20, color: '#6b6b6b', marginLeft: 4, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>{stat.unit}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#8a8a8a', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <StickyFeaturedSection />
        <section className="responsive-padding" style={{ padding: '0 60px 20px', background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 100%)', position: 'relative' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', paddingTop: 80 }}>
            <div className="section-header" style={{ marginBottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div><div style={{ fontSize: 13, color: '#7c3AED', letterSpacing: 2, marginBottom: 16, fontWeight: 500 }}>HAPPENING NOW</div><h2 style={{ fontSize: 48, fontWeight: 400, margin: '0 0 12px 0', letterSpacing: -1, fontFamily: 'var(--font-serif)' }}>Live Auctions</h2></div>
              <div className="filter-buttons" style={{ display: 'flex', gap: 12 }}>{['Trending', 'Recent', 'Ending Soon'].map((f, i) => <button key={f} className={i === 0 ? "primary-btn" : "secondary-btn"} style={{ padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>{f}</button>)}</div>
            </div>
            <div className="art-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {LIVE_DATA.map((art) => (
                <ArtCard key={art.id} artwork={art} isLive={true} />
              ))}
            </div>
          </div>
        </section>

        <section className="responsive-padding" style={{ padding: '40px 60px 120px', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.02) 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <div style={{ display: 'inline-block', padding: '8px 20px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 30, fontSize: 12, letterSpacing: 1.5, marginBottom: 32, fontWeight: 500 }}>JOIN THE COMMUNITY</div>
            <h2 className="hero-title" style={{ fontSize: 64, fontWeight: 400, margin: '0 0 24px 0', letterSpacing: -2, lineHeight: 1.1, fontFamily: 'var(--font-serif)' }}>Begin Your Art<br />Collection Journey</h2>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/explore')} className="primary-btn" style={{ padding: '18px 40px', borderRadius: 12, fontSize: 16, display: 'flex', alignItems: 'center', gap: 10 }}>Explore Marketplace <ArrowRight size={18} /></button>
              <button onClick={() => navigate('/profile')} className="secondary-btn" style={{ padding: '18px 40px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Create as Artist</button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default HomePage;