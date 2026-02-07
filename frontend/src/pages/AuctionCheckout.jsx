import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, Gavel } from "lucide-react";
import SampleArtData from "../constants/SampleArtData";

const AuctionCheckout = () => {
  const { id } = useParams();
  const art = SampleArtData.find(a => a.id === Number(id));

  if (!art) {
    return <div className="text-white p-10">Artwork not found</div>;
  }

  const [tick, setTick] = useState(0);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    return {
      days: Math.floor(totalSeconds / (24 * 3600)),
      hours: Math.floor((totalSeconds % (24 * 3600)) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  };

  const time = getTimeRemaining(art.endDate);

  const handlePlaceBid = () => {
    console.log("Placing bid:", bidAmount);
  };

  return (
    
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f0f14] to-[#14141c] text-white flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

        <div className="space-y-6 flex flex-col items-center">
          <div className="relative w-full max-w-md aspect-square">
            <img
              src={art.image}
              alt={art.title}
              className="rounded-xl shadow-lg w-full h-full object-cover"
            />

            <span className="absolute top-4 left-4 bg-[#5D4037] text-[#F3E5AB] text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
              Auction
            </span>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#F3E5AB]">{art.title}</h1>
            <p className="text-gray-400">by {art.artist}</p>
          </div>

          <div className="flex justify-center gap-4">
            {time ? (
              Object.entries(time).map(([label, value]) => (
                <div
                  key={label}
                  className="bg-black/40 backdrop-blur rounded-xl w-16 h-20 flex flex-col items-center justify-center animate-slideUp"
                >
                  <span className="text-xl font-bold">{value}</span>
                  <span className="text-xs uppercase text-gray-400">{label}</span>
                </div>
              ))
            ) : (
              <span className="text-red-400">Auction Ended</span>
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-8 space-y-6 backdrop-blur">
          <h2 className="text-2xl font-semibold text-[#F3E5AB]">
            Place Your Bid
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Current Bid</span>
              <span>{art.price} {art.currency}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Minimum Increment</span>
              <span>{art.minIncrement} {art.currency}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Your Bid</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Enter at least ${art.price + art.minIncrement}`}
              className="w-full bg-black/40 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div className="bg-black/40 rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Clock size={16} /> Auction Notice
            </div>
            <p>Clock's ticking! The top bid secures the win.</p>
          </div>

  
          <button
            onClick={handlePlaceBid}
            className="w-full bg-[#5D4037] hover:opacity-90 transition text-[#F3E5AB] font-bold py-5 rounded-2xl shadow-lg cursor-pointer uppercase tracking-wider"
          >
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionCheckout;