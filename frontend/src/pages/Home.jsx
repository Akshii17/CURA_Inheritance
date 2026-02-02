import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Sparkles, TrendingUp, User, Hexagon, ArrowRight, Award, Users } from 'lucide-react';

// const data 
const ART_IMAGES = [
  "https://i.etsystatic.com/25851025/r/il/cfc101/2685214585/il_570xN.2685214585_jp5m.jpg",
  "https://numeralpaint.com/wp-content/uploads/2024/05/Stranger-Things-Eleven-Art-diamond-paintings.jpg",
  "https://i.pinimg.com/736x/91/96/fd/9196fdf732dd778e027bc964570c3be8.jpg",
  "https://cdnb.artstation.com/p/assets/images/images/050/124/883/large/tatyana-k-art-max-artstation.jpg?1654107436",
  "https://cdna.artstation.com/p/assets/images/images/050/247/574/large/david-kent-untitled-artwork-1.jpg?1654421465",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPpK7P2QnKZSmxWRtMXh4Wp2ZIyfgdVYgDRA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0e3wE11qKDEJlfRiMja5oEg5LfHw-c8CPcg&s",
  "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&q=80",
  "https://images.unsplash.com/photo-1565660467558-2cc40ad3066b?w=400&q=80",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&q=80",
  "https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=400&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80",
  "https://images.unsplash.com/photo-1569172131633-cf8562471e21?w=400&q=80",
  "https://images.unsplash.com/photo-1545989253-02cc26577f88?w=400&q=80",
  "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&q=80",
  "https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=400&q=80"
];

//ArtCard
function ArtCard({ artwork, isLive }) {
  return (
    <div className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#141414]/40 to-[#0a0a0a]/40 border border-white/5 transition-all duration-400 hover:border-white/15 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)] cursor-pointer">
      <div className="relative w-full h-[340px] overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-600 group-hover:scale-105"
          style={{ backgroundImage: `url(${artwork.image})` }} 
        />
        
        

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      
      <div className="p-7">
        <h3 className="text-24 font-normal mb-2 -tracking-[0.3px] font-serif">{artwork.title}</h3>
        <p className="text-sm text-[#6b6b6b] mb-6">by {artwork.artist}</p>
        
        <div className="flex justify-between items-center p-5 bg-white/5 rounded-xl border border-white/5 mb-4">
          <div>
            <div className="text-[11px] text-[#6b6b6b] mb-1.5 tracking-[0.5px]">CURRENT BID</div>
            <div className="text-xl font-bold">{artwork.currentBid}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#6b6b6b] mb-1.5 tracking-[0.5px]">ENDS IN</div>
            <div className="text-[15px] font-semibold flex items-center gap-1.5">
              <Clock size={14} /> {artwork.timeLeft}
            </div>
          </div>
        </div>
        {isLive && (
          <>
            <button className="w-full bg-white text-black border-none py-3 rounded-[10px] text-sm transition-transform duration-200 shadow-none hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)]">Place Bid</button>
            <div className="mt-3.5 text-xs text-[#6b6b6b] text-center">{artwork.bids} bids placed</div>
          </>
        )}
      </div>
    </div>
  );
}

//featured auction
function FeaturedAuction({ auction }) {
  return (
    <section className="py-[100px] px-[60px]">
      <div className="max-w-[1400px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#141414]/80 to-[#0a0a0a]/80 backdrop-blur-[20px] border border-white/5 transition-all duration-400 hover:border-white/15 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)] group">
          <div className="grid grid-cols-[1.2fr_1fr] gap-0">
            <div className="relative h-[600px] overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-600 group-hover:scale-105"
                style={{ backgroundImage: `url(${auction.image})` }}
              />
              <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-[10px] px-4 py-2 rounded-lg text-xs font-bold tracking-[1px] border border-white/20 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                FEATURED
              </div>
            </div>
           
            <div className="p-[60px] flex flex-col justify-center">
              <div className="mb-8">
                <div className="text-[13px] text-[#6b6b6b] mb-3 tracking-[1px] font-medium">FEATURED AUCTION</div>
                <h2 className="text-5xl font-normal mb-3 -tracking-[0.5px] font-serif">{auction.title}</h2>
                <p className="text-base text-[#8a8a8a] m-0">by {auction.artist}</p>
              </div>
             
              <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <div className="text-xs text-[#6b6b6b] mb-2 tracking-[0.5px]">CURRENT BID</div>
                  <div className="text-[28px] font-bold">{auction.currentBid}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6b6b6b] mb-2 tracking-[0.5px]">TIME LEFT</div>
                  <div className="text-xl font-semibold flex items-center gap-1.5">
                    <Clock size={20} />{auction.timeLeft}
                  </div>
                </div>
              </div>           
              <div className="flex gap-5 mb-8">
                <div className="flex items-center gap-1.5 text-sm text-[#8a8a8a]">
                  <TrendingUp size={16} /> {auction.bids} bids
                </div>
              </div>       
              <button className="bg-white text-black border-none py-4 px-8 rounded-xl text-[15px] transition-transform duration-200 shadow-none hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)]">
                Place Bid Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

//footer
function Footer() {
  return (
    <footer className="border-t border-white/5 pt-20 px-[60px] pb-10 bg-black/50">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-[60px] mb-20">
          <div>
            <div className="text-[22px] font-semibold mb-5 tracking-[2px] flex items-center gap-3 font-serif"><Hexagon size={28} strokeWidth={1.5} /> CURA</div>
            <p className="text-[15px] text-[#6b6b6b] leading-[1.7] mb-6">The premier decentralized marketplace for discovering, collecting, and auctioning extraordinary digital art on the blockchain.</p>
            <div className="flex gap-3">
              {['Twitter', 'Discord', 'Instagram'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-[10px] text-white no-underline text-[11px] font-semibold">{social[0]}</a>
              ))}
            </div>
          </div>
          {['MARKETPLACE', 'RESOURCES', 'COMPANY'].map((section, i) => (
            <div key={i}>
              <div className="text-[13px] font-bold mb-5 text-white tracking-[1px]">{section}</div>
              <div className="flex flex-col gap-3.5">
                {['Item 1', 'Item 2', 'Item 3'].map((item) => <a key={item} href="#" className="text-[#6b6b6b] no-underline text-sm transition-colors duration-300 hover:text-white">{item}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-10 border-t border-white/5 flex justify-between items-center">
          <div className="text-sm text-[#6b6b6b]">© 2026 CURA. All rights reserved.</div>
          <div className="text-[13px] text-[#6b6b6b]">Built on Ethereum • Secured by Web3</div>
        </div>
      </div>
    </footer>
  );
}



//hero, helpers
const GridCell = ({ colSpan, rowSpan }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(
    Math.floor(Math.random() * ART_IMAGES.length)   
  );
  
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Random interval between 4s and 12s
    const randomInterval = Math.floor(Math.random() * 8000) + 4000;

    const changeImage = () => {
      setOpacity(0.5); 
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % ART_IMAGES.length);
        setOpacity(1); 
      }, 1500); 
    };

    const intervalId = setInterval(changeImage, randomInterval);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="relative overflow-hidden m-[1px] bg-[#050505]"
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      <img
        src={ART_IMAGES[currentImageIndex]}
        alt="art-bg"
        className="w-full h-full object-cover grayscale brightness-[0.8] transition-opacity duration-[1500ms] ease-in-out scale-125"
        style={{
          opacity: opacity, 
        }}
      />
    </div>
  );
};

const CollageBackground = () => {
  const cells = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => {
      const rand = Math.random();
      let colSpan = 1;
      let rowSpan = 1;
      if (rand > 0.60 && rand <= 0.75) colSpan = 2;
      else if (rand > 0.75 && rand <= 0.90) rowSpan = 2;
      else if (rand > 0.90) { colSpan = 2; rowSpan = 2; }
      return { id: i, colSpan, rowSpan };
    });
  }, []);

  return (
    <div className="absolute -top-[10%] -left-[10%] -right-[10%] -bottom-[10%] grid grid-cols-12 auto-rows-[80px] grid-flow-dense gap-0 -rotate-2 scale-105 opacity-60 pointer-events-none z-0">
      {cells.map((cell) => (
        <GridCell key={cell.id} colSpan={cell.colSpan} rowSpan={cell.rowSpan} />
      ))}
    </div>
  );
};

function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  const handleMouseMove = (e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="pt-10 px-[60px] pb-5 relative overflow-hidden min-h-[600px] flex items-center justify-center bg-[#050505] cursor-default"
    >
      
      <CollageBackground />

      <div 
        className="absolute inset-0 pointer-events-none z-[1] transition-[background] duration-100 ease-linear"
        style={{
        background: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, transparent 10%, rgba(5,5,5,0.85) 100%)`,
        }} 
      />

      <div className="max-w-[1400px] w-full mx-auto relative z-10 text-center">
        <div className="mb-[30px]">
          
          <div className="inline-block px-5 py-1.5 bg-black/60 border border-white/30 backdrop-blur-[4px] rounded-[30px] text-[10px] tracking-[2px] mb-6 font-semibold uppercase text-white">
            Decentralized Marketplace
          </div>
          
          <h1 className="text-7xl font-normal m-0 mb-5 -tracking-[2px] leading-[1.1] font-serif text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
            Where Art Meets
            <br />
            <span className="italic text-[#ccc]">Blockchain</span>
          </h1>
          
          <p className="text-lg text-[#e0e0e0] max-w-[600px] mx-auto mb-8 leading-relaxed font-light drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Discover extraordinary digital masterpieces. Bid, collect, and own pieces of art history on the most trusted decentralized platform.
          </p>
          
          <div className="flex gap-4 justify-center items-center mb-10">
            <button className="bg-white text-black border-none py-3.5 px-8 rounded-xl text-sm flex items-center gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative z-20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)]">
              How it works <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

//marquee strip
function Marquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap relative border-t border-b border-white/5 py-3 bg-white/[0.005]">
      <div className="inline-block animate-[marquee_30s_linear_infinite]">
        {Array(10).fill("LIVE AUCTIONS • GENESIS DROP • ETHEREAL COLLECTION • ").map((text, i) => (
          <span key={i} className="text-xs mx-5 tracking-[3px] text-[#444] font-sans font-semibold">
            {text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

//stats
function Stats({ stats }) {
  return (
    <section className="py-10 px-[60px] relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-4 items-center relative">
          {stats.map((stat, index) => {
            const isLast = index === stats.length - 1;

            return (
              <div key={index} className={`p-2.5 text-center relative ${!isLast ? 'border-r border-white/10' : ''}`}>
                <div className="transition-all duration-400 cursor-default group hover:-translate-y-0.5 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <div className="text-5xl font-normal mb-1 font-serif text-white leading-none group-hover:text-white">
                    {stat.value}
                    <span className="text-xl text-[#6b6b6b] ml-1 font-sans font-light">
                      {stat.unit}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#8a8a8a] uppercase tracking-[2px] font-semibold flex items-center justify-center gap-2">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// preferences
function Recommendations({ artworks }) {
  return (
    <section className="pt-0 px-[60px] pb-[100px]">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-14 flex justify-between items-end">
          <div>
            <div className="text-[13px] text-[#6b6b6b] tracking-[2px] mb-4 font-medium">CURATED FOR YOU</div>
            <h2 className="text-5xl font-normal m-0 -tracking-[1px] font-serif">Based on Your Preferences</h2>
            <p className="text-[17px] text-[#8a8a8a] mt-3 mb-0">Curated selections inspired by your viewing history.</p>
          </div>
          <button className="bg-transparent text-white border border-white/15 py-3.5 px-7 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-white/5 hover:border-white/30">
            View All Recommendations <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          {artworks.map((artwork) => (
            <ArtCard key={artwork.id} artwork={artwork} isLive={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

//live auctions
function LiveAuctions({ artworks }) {
  return (
    <section className="pt-0 px-[60px] pb-5 bg-gradient-to-b from-white/[0.02] to-transparent relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-[1400px] mx-auto pt-20">
        <div className="mb-14 flex justify-between items-end">
          <div>
            <div className="text-[13px] text-[#6b6b6b] tracking-[2px] mb-4 font-medium">HAPPENING NOW</div>
            <h2 className="text-5xl font-normal m-0 mb-3 -tracking-[1px] font-serif">Live Auctions</h2>
            <p className="text-[17px] text-[#8a8a8a] m-0">Real-time bidding on extraordinary artworks</p>
          </div>
          <Link to="/explore" className=" bg-transparent text-white border border-white/15 py-3.5 px-7 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-white/5 hover:border-white/30">
            View All  <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          {artworks.map((auction) => (
            <ArtCard key={auction.id} artwork={auction} isLive={true} />
          ))}
        </div>
      </div>
    </section>
  );
}

//join
function JoinCommunity() {
  return (
    <section className="pt-10 px-[60px] pb-[120px] bg-gradient-to-b from-transparent to-white/[0.02] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="max-w-[900px] mx-auto text-center relative">
        <div className="inline-block px-5 py-2 bg-white/5 border border-white/10 rounded-[30px] text-xs tracking-[1.5px] mb-8 font-medium">JOIN THE COMMUNITY</div>
        <h2 className="text-[64px] font-normal m-0 mb-6 -tracking-[2px] leading-[1.1] font-serif">Begin Your Art<br />Collection Journey</h2>
        <p className="text-[19px] text-[#8a8a8a] max-w-[640px] mx-auto mb-12 leading-[1.7]">Connect with thousands of collectors and artists in the premier decentralized art marketplace where creativity meets blockchain technology</p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-black border-none py-[18px] px-10 rounded-xl text-base flex items-center gap-2.5 transition-transform duration-200 shadow-none hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)]">Explore Marketplace <ArrowRight size={18} /></button>
          <button className="bg-transparent text-white border border-white/15 py-[18px] px-10 rounded-xl text-base font-bold cursor-pointer transition-all duration-300 hover:bg-white/5 hover:border-white/30">Create as Artist</button>
        </div>
      </div>
    </section>
  );
}

//animation thing

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  //spotligh thing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  //Passed down as props to children  (data)
  const recommendedWorks = [
    { id: 1, title: 'Abstract Composition #42', artist: 'Elena Martinez', currentBid: '2.5 ETH', timeLeft: '2h 15m', image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=800&fit=crop' },
    { id: 2, title: 'Digital Landscape Series', artist: 'Marcus Chen', currentBid: '3.8 ETH', timeLeft: '5h 42m', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&h=800&fit=crop' },
    { id: 3, title: 'Minimalist Portrait', artist: 'Sofia Andersson', currentBid: '1.9 ETH', timeLeft: '1h 08m', image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=800&fit=crop' }
  ];

  const heroAuction = {
    title: 'Ethereal Dimensions', artist: 'Isabella Romano', currentBid: '8.5 ETH', timeLeft: '3h 45m', bids: 47, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=800&fit=crop'
  };

  const liveAuctions = [
    { id: 5, title: 'Urban Expression', artist: 'Alex Rivera', currentBid: '5.6 ETH', bids: 23, image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&h=600&fit=crop' },
    { id: 6, title: 'Color Study #7', artist: 'Nina Kowalski', currentBid: '2.1 ETH', bids: 12, image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=600&fit=crop' },
    { id: 7, title: 'Form & Function', artist: 'David Park', currentBid: '3.3 ETH', bids: 18, image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&h=600&fit=crop' },
    { id: 8, title: 'Light Refraction', artist: 'Emma Thompson', currentBid: '1.8 ETH', bids: 9, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop' }
  ];

  const stats = [
    { label: 'Total Volume', value: '245K', unit: 'ETH', icon: TrendingUp },
    { label: 'Artworks Sold', value: '12.4K', unit: '+', icon: Award },
    { label: 'Active Artists', value: '8.5K', unit: '+', icon: Sparkles },
    { label: 'Community', value: '156K', unit: '+', icon: Users }
  ];

  // css glbl style 
  return (
    <div ref={containerRef} className="min-h-screen relative overflow-x-hidden font-sans">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
      `}</style>

      {/* noise-overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-50 mix-blend-overlay" />
      
      {/* spotlight */}
      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
        style={{ background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.06), transparent 40%)` }}
      />
      
      <main className="relative z-[2]">
        <Hero />
        <Marquee />
        <Stats stats={stats} />
        <FeaturedAuction auction={heroAuction} />
        <Recommendations artworks={recommendedWorks} />
        <LiveAuctions artworks={liveAuctions} />
        <JoinCommunity />
      </main>

      <Footer />
    </div>
  );
}