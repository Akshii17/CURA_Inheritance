import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Clock, Gavel } from "lucide-react";
import { ethers } from "ethers";
import { useArtistContext } from "../context/ArtistContext";
import { useQueryContext } from "../context/QueryContext";
import toast from "react-hot-toast";

const AuctionCheckout = () => {

  const { contract, address, isConnected } = useArtistContext();
  const { artworks, fetchArtworks, auction } = useQueryContext();

  const { id } = useParams();

  const artwork = useMemo(() => {
    if (!artworks || !id) return null;

    return artworks.find(
      (a) => String(a.artworkID) === String(id)
    );
  }, [artworks, id]);

  if (!artwork) {
    return <div className="text-white p-10">Artwork not found</div>;
  }


  //console.log(auction);
  const auctionObject = auction?.find(
    (item) => item.artID === artwork.artworkID
  );

  let AuctionID = auctionObject.auctionID;

  let aucBasePriceWei = auctionObject?.basePrice;
  const priceInEthAuc = aucBasePriceWei
    ? ethers.formatEther(aucBasePriceWei)
    : "0";

  let aucWinningPriceWei = auctionObject?.winningBid;
  const priceInEthWin = aucWinningPriceWei
    ? ethers.formatEther(aucWinningPriceWei)
    : "0";

  const [tick, setTick] = useState(0);
  const [bidAmount, setBidAmount] = useState("");

  const [finalSaleChecked, setFinalSaleChecked] = useState(false);
  const [ownershipChecked, setOwnershipChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canPay = finalSaleChecked && ownershipChecked;

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

  const time = getTimeRemaining(auctionObject.endDate);



  const handlePlaceBid = async () => {
    try {
      setIsLoading(true);

      let stringBid = bidAmount.toString();
      let bidInWei = ethers.parseEther(stringBid);

      if (!isConnected || !address || !contract) {
        return;
      }

      console.log(AuctionID);

      const tx = await contract.placeBid(AuctionID, { value: bidInWei });

      await tx.wait();
      toast.success("Bid Placed");
      await fetchAuction();

      // Reset state
      setBidAmount("");
      setIsLoading(false);
    } catch (error) {
      console.log("error in bidding", error);
      toast.error("Something went wrong, Please try again later");
      setIsLoading(false);
    }
  };

  return (

    <div className=" w-full text-white flex justify-center px-6 py-3 items-center">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-stretch">

        <div className="space-y-6 flex flex-col items-center h-full">
          <div className="relative w-full max-w-md aspect-square">
            <img
              src={`https://gateway.pinata.cloud/ipfs/${artwork.ipfsHash}`}
              alt={artwork.artworkTitle}
              className="rounded-xl shadow-lg w-full h-full object-cover"
            />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#F3E5AB]">{artwork.artworkTitle}</h1>
            <p className="text-gray-400">by {artwork.originalArtist}</p>
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

        <div className="bg-white/5 rounded-2xl p-8 space-y-6 backdrop-blur flex flex-col h-full">
          <h2 className="text-2xl font-semibold text-[#F3E5AB]">
            Place Your Bid
          </h2>

          <div className="space-y-2 text-md">
            <div className="flex justify-between">
              <span>Number of Bids</span>
              <span>17 </span>
              {/* ???????????????????????????????????????add from graph */}
            </div>
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>{priceInEthAuc} ETH</span>
            </div>
            <div className="flex justify-between">
              <span>Current Bid</span>
              <span>{priceInEthWin} ETH</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm mb-2">Your Bid</p>
            <input
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Enter at least ${auctionObject.winningBid != 0.0? priceInEthWin : priceInEthAuc}`}
              className="w-full bg-black/40 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div className="bg-black/40 rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Clock size={16} /> Auction Rules
            </div>
            <p>• Each bid must meet the minimum increment</p>
            <p>• If outbid, you must collect your funds from the withdraw section in your profile</p>
            <p>• Clock's ticking! The top bid secures the win</p>
          </div>

          <div className="space-y-3 text-sm">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={finalSaleChecked}
                onChange={(e) => setFinalSaleChecked(e.target.checked)}
                className="mt-1 accent-indigo-800"
              />
              <span>
                I understand that bids cannot be withdrawn until the auction ends
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ownershipChecked}
                onChange={(e) => setOwnershipChecked(e.target.checked)}
                className="mt-1 accent-indigo-800"
              />
              <span>Ownership is transferred to the winner</span>
            </label>
          </div>


          <button
            disabled={!canPay}
            onClick={handlePlaceBid}
            className={`mt-auto w-full bg-indigo-600 hover:bg-indigo-800 text-[#F3E5AB] font-bold py-4 rounded-2xl shadow-lg transition uppercase tracking-wider
              ${canPay
                ? "hover:opacity-90 cursor-pointer"
                : "opacity-30 cursor-not-allowed"
              }`}
          >
            Confirm & Bid {bidAmount} ETH
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionCheckout;