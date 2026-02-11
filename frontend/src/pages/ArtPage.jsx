import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useArtistContext } from "../context/ArtistContext";
import { useQueryContext } from "../context/QueryContext";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";

const ArtPage = () => {

  const [open, setOpen] = useState(false);
  const { artist, fetchArtist } = useArtistContext();

  const { artworks, fetchArtworks } = useQueryContext();

  const { id } = useParams();
  const navigate = useNavigate();

  const artwork = useMemo(() => {
    if (!artworks || !id) return null;

    return artworks.find(
      (a) => String(a.artworkID) === String(id)
    );
  }, [artworks, id]);

  let loggedArtistAddress = artist.artistAddress.toLowerCase();

  // try {
  //   loggedArtistAddress = ethers.getAddress(artist.artistAddress);
  //   console.log(loggedArtistAddress);
  // } catch (error) {
  //   console.error("Invalid address");
  //   toast.error("Something went wrong, Please try again later")
  // }


  const [tick, setTick] = useState(0);

  // Logic for roles
  const isCreator = artwork?.originalArtist.toLowerCase() === loggedArtistAddress;
  const isCollector = artwork?.purchasedBy?.includes(loggedArtistAddress); //?????????????????
  const isCurrentlyForSale = artwork?.available;

  useEffect(() => {
    if (artwork?.saleType !== "auction") return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [artwork?.saleType]);

  const remainingTime = useMemo(
    () => (artwork?.saleType === "auction" ? getTimeRemaining(auction.endDate) : null), //????????????
    [artwork, tick]
  );

  if (!artwork) return <div className="p-10 text-[#F3E5AB] bg-[#050505] min-h-screen">Art not found</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="max-w-6xl w-full space-y-4">

        <button onClick={() => navigate(-1)} className="text-xs font-bold tracking-[0.2em] text-neutral-500 hover:text-[#F3E5AB] flex items-center gap-2 uppercase transition-colors">
          ← Go Back
        </button>

        <div className="checkout-container border border-white/10 rounded-[24px] w-full flex flex-col md:flex-row overflow-hidden shadow-2xl bg-white/5 backdrop-blur-xl">

          {/* LEFT: Image Section */}
          <div className="md:w-1/2 bg-neutral-900/40 flex items-center justify-center p-6 border-r border-white/5">
            <img key={artwork.id} src={`https://gateway.pinata.cloud/ipfs/${artwork.ipfsHash}`} alt={artwork.artworkTitle} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl" />
          </div>

          {/* RIGHT: Info Section */}
          <div className="md:w-1/2 p-10 flex flex-col justify-between bg-black/20">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#7C3AED] uppercase">
                  {artwork.saleType}
                </span>
                <h1 className="text-5xl font-serif text-[#F3E5AB] mt-2 leading-tight">{artwork.artworkTitle}</h1>
                <p className="text-sm text-neutral-400 mt-2">
                  Original Artist: <span className="text-white font-medium">{artwork.originalArtist}</span>
                </p>
              </div>

              {/* Description */}
              <div className="pt-2">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Description</p>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  {artwork.description || "A curated high-fidelity digital asset from the CURA collection."}
                </p>
              </div>

              {/* Pricing Section - Always Visible */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">
                      {artwork.saleType === "auction" ? "Current Bid" : "Price"}
                    </p>
                    <p className="text-3xl font-bold text-[#7C3AED]">{artwork.winningBid || artwork.basePrice} ETH</p>
                  </div>
                  {artwork.saleType === "auction" && remainingTime && (
                    <div className="text-right">
                      <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Time Left</p>
                      <p className="text-lg font-mono text-[#F3E5AB]">
                        {remainingTime.hours}h {remainingTime.minutes}m {remainingTime.seconds}s
                      </p>
                    </div>
                  )}
                </div>
              </div>


            </div>

            {/* ACTION BUTTONS - Conditional Based on Ownership */}
            <div className="mt-10">
              {isCreator ? (
                /* Creator Buttons */
                <div className="flex flex-col gap-3">
                  {/* SELL ARTWORK */}
                  {isCurrentlyForSale && (
                    <button
                      onClick={() => setOpen(true)}
                      className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-xs transition-all bg-[#7C3AED] text-[#F3E5AB] cursor-pointer"
                    >
                      SELL ARTWORK
                    </button>
                  )}

                  {/* END AUCTION */}
                  {!isCurrentlyForSale && artwork?.saleType === "auction" && (
                    <button
                      //onClick={handleEndAuction}
                      className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-xs transition-all bg-[#7C3AED] text-[#F3E5AB] cursor-pointer"
                    >
                      END AUCTION
                    </button>
                  )}

                  {/* END SALE */}
                  {!isCurrentlyForSale && artwork?.saleType === "direct" && (
                    <button
                      // onClick={handleEndSale}
                      className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-xs transition-all bg-[#7C3AED] text-[#F3E5AB] cursor-pointer"
                    >
                      END SALE
                    </button>
                  )}

                </div>
              ) : isCollector ? (
                /* Collector (Owner) Buttons */
                <div className="flex flex-col gap-3">
                  <button className="w-full py-5 bg-[#F3E5AB] text-black rounded-xl font-bold tracking-[0.3em] text-xs transition-all">
                    {isCurrentlyForSale ? "CANCEL RESALE" : "LIST FOR RESALE"}
                  </button>
                </div>
              ) : (
                /* Public Buyer Button */
                <>
                  {artwork.saleType === "auction" ? (
                    <Link to = {`/auctioncheckout/${artwork.artworkID}`}>
                      <div
                      className="w-full py-5 bg-[#7C3AED] text-[#F3E5AB] rounded-xl font-bold tracking-[0.3em] text-xs transition-all active:scale-[0.98] text-center"
                      onClick={handlePlaceBid}
                    >
                      PLACE YOUR BID
                      </div>
                    </Link>
                  ) : (
                    <Link to ={`/directcheckout/${artwork.artworkID}`}>
                      <div className="w-full py-5 bg-[#7C3AED] text-[#F3E5AB] rounded-xl font-bold tracking-[0.3em] text-xs transition-all active:scale-[0.98] text-center"
                      
                    >
                      PURCHASE ARTWORK
                      </div>
                    </Link>
                  )}

                </>
              )}
            </div>
          </div>

        </div>
      </div>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        id={artwork.artworkID}
      />
    </div>
  );
};

const getTimeRemaining = (endDate) => {
  if (!endDate) return null;
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return null;
  return {
    hours: Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000)),
    minutes: Math.floor((diff % (3600 * 1000)) / (60 * 1000)),
    seconds: Math.floor((diff % (60 * 1000)) / 1000),
  };
};

export default ArtPage;