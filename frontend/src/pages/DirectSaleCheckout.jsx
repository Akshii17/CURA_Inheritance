import { useParams } from "react-router-dom";
import { useState } from "react";
import { Lock } from "lucide-react";
import SampleArtData from "../constants/SampleArtData";

const DirectSaleCheckout = () => {
  const { id } = useParams();

  const art = SampleArtData.find(
    (a) => a.id === Number(id)
  );

  if (!art) {
    return <div className="text-white p-10">Artwork not found</div>;
  }

  const artwork = {
    image: art.image,
    title: art.title,
    artist: art.artist,
    tags: art.tags,
    priceINR: 1000,
    gasFeeINR: 120,
    priceETH: 1.1,
    walletAddress: "1gD67....4"
  };

  const handlePay = (artwork) => {
    console.log("Paying for:", artwork);
    // wagmi writeContract / backend call here
  };

  const [finalSaleChecked, setFinalSaleChecked] = useState(false);
  const [ownershipChecked, setOwnershipChecked] = useState(false);

  const totalINR = artwork.priceINR + artwork.gasFeeINR;

  const canPay = finalSaleChecked && ownershipChecked;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f14] to-[#14141c] text-white px-4 py-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

        {/* LEFT – ARTWORK */}
        <div className="space-y-6">
          <div className="relative">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="rounded-2xl shadow-xl w-full max-w-md mx-auto"
            />
            <span className="absolute top-4 left-4 bg-emerald-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
              Direct Sale
            </span>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{artwork.title}</h1>
            <p className="text-gray-400">by {artwork.artist}</p>

            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              {artwork.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT – CHECKOUT */}
        <div className="bg-white/5 rounded-2xl p-6 space-y-6 backdrop-blur">
          <h2 className="text-xl font-semibold">Purchase Details</h2>

          {/* PRICE BREAKDOWN */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Artwork Price</span>
              <span>₹{artwork.priceINR.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Gas / Transaction</span>
              <span>₹{artwork.gasFeeINR.toLocaleString()}</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>
                ₹{totalINR.toLocaleString()} 
                <span className="text-sm text-gray-400">({artwork.priceETH} ETH)</span>
              </span>
            </div>
          </div>

          {/* WALLET */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Wallet Address</label>
            <div className="bg-black/40 px-4 py-3 rounded-xl text-sm truncate">
              {artwork.walletAddress}
            </div>
          </div>

          {/* CONFIRMATIONS */}
          <div className="space-y-3 text-sm">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={finalSaleChecked}
                onChange={e => setFinalSaleChecked(e.target.checked)}
                className="mt-1"
              />
              <span>I understand this is a <b>final sale</b></span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ownershipChecked}
                onChange={e => setOwnershipChecked(e.target.checked)}
                className="mt-1"
              />
              <span>Ownership transfer occurs after payment</span>
            </label>
          </div>

          {/* FINAL CONFIRMATION */}
          <div className="bg-black/40 rounded-xl p-4 text-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Lock size={16} />
              <span>Final Confirmation</span>
            </div>
            <p>
              You are about to purchase <b>“{artwork.title}”</b> by <b>{artwork.artist}</b>
              for <b>₹{totalINR.toLocaleString()}</b>.
            </p>
            <p className="text-red-400">This transaction is non-refundable.</p>
          </div>
        </div>
      </div>

      {/* STICKY PAY BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-white/10 p-4 md:static md:bg-transparent md:border-none md:mt-10">
        <button
          disabled={!canPay}
          onClick={() => handlePay(artwork)}
          className={`w-full max-w-5xl mx-auto block text-lg font-semibold py-4 rounded-2xl shadow-lg transition 
            ${canPay ? "bg-red-500 hover:bg-red-600 cursor-pointer" : "bg-gray-600 cursor-not-allowed"}`}
        >
          Confirm & Pay ₹{totalINR.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

export default DirectSaleCheckout;
