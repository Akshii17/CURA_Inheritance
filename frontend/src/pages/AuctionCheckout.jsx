import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Clock, Gavel, LoaderCircle } from "lucide-react";
import { ethers } from "ethers";
import { useArtistContext } from "../context/ArtistContext";
import { useQueryContext } from "../context/QueryContext";
import toast from "react-hot-toast";
import { fetchEthPriceINR } from "../context/ethToRupee";

const AuctionCheckout = () => {

  const navigate = useNavigate();

  const { contract, address, isConnected } = useArtistContext();
  const { artworks, fetchArtworks, auction, artists, fetchAuction } = useQueryContext();

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

  const artistObject = artists?.find(
    (item) => item?.artistAddress?.toLowerCase() === artwork?.originalArtist?.toLowerCase()
  );

  const [ethToInr, setEthToInr] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const price = await fetchEthPriceINR();
        setEthToInr(price);
      } catch (err) {
        console.log("Failed to fetch ETH price", err);
      }
    };

    load();
  }, []);

  //console.log(auction);
  const auctionObject = auction?.find(
    (item) => item.artID === artwork.artworkID
  );

  let AuctionID = auctionObject?.auctionID;

  let aucBasePriceWei = auctionObject?.basePrice;
  const priceInEthAuc = aucBasePriceWei
    ? ethers.formatEther(aucBasePriceWei)
    : "0";

  let aucWinningPriceWei = auctionObject?.winningBid;
  const priceInEthWin = aucWinningPriceWei
    ? ethers.formatEther(aucWinningPriceWei)
    : "0";


  const priceInInrAuc = ethToInr
    ? Number(priceInEthAuc) * ethToInr
    : null;
  const priceInInrWin = ethToInr
    ? Number(priceInEthWin) * ethToInr
    : null;

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

  const getTimeRemaining = () => {
    let endTime = auctionObject?.endTime
    if (!endTime) return undefined;

    const diff = Number(endTime) * 1000 - Date.now();

    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);

    return {
      days: Math.floor(totalSeconds / (24 * 3600)),
      hours: Math.floor((totalSeconds % (24 * 3600)) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  };


  const time = getTimeRemaining();



  const handlePlaceBid = async () => {
    try {
      setIsLoading(true);


      let stringBid = bidAmount.toString();
      let bidInWei = ethers.parseEther(stringBid);

      if (!isConnected || !address || !contract) {
        setIsLoading(false);
        return;
      }

      console.log(AuctionID);
      const tx = await contract.placeBid(AuctionID, { value: bidInWei });

      await tx.wait();
      

      await fetchArtworks();
      await fetchAuction();
      navigate(`/bidplaced/${artwork.artworkID}`);

      toast.success("Bid Placed");

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
              className="rounded-xl shadow-lg w-full h-full object-cover pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />

            {/* Watermark Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="transform -rotate-45 text-white/20 font-black text-2xl tracking-[0.3em] whitespace-nowrap mix-blend-overlay drop-shadow-md">
                CURA © PROTECTED
              </div>
            </div>

          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#F3E5AB]">
              {artwork.artworkTitle}
            </h1>
            <p className="text-gray-400">by {artistObject?.name}</p>
          </div>

          <div className="flex justify-center gap-4">
            {time ? (
              Object.entries(time).map(([label, value]) => (
                <div
                  key={label}
                  className="bg-black/40 backdrop-blur rounded-xl w-16 h-20 flex flex-col items-center justify-center animate-slideUp"
                >
                  <span className="text-xl font-bold">{value}</span>
                  <span className="text-xs uppercase text-gray-400">
                    {label}
                  </span>
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
              <span>Base Price</span>
              <p className="text-sm text-neutral-400 font-light">
                {priceInEthAuc} ETH{" "}
                {priceInInrAuc && (
                  <span className="text-neutral-500">
                    (₹ {priceInInrAuc.toLocaleString("en-IN", { maximumFractionDigits: 0 })})
                  </span>
                )}
              </p>
            </div>
            <div className="flex justify-between">
              <span>Current Bid</span>
              <p className="text-3xl font-bold text-[#7C3AED]">
                {priceInEthWin} ETH{" "}
                {priceInInrWin !== null && (
                  <span className="text-lg text-neutral-400 font-normal">
                    (₹ {priceInInrWin.toLocaleString("en-IN", { maximumFractionDigits: 0 })})
                  </span>
                )}
              </p>

            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm mb-2">Your Bid</p>
            <input
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Enter at least ${auctionObject.winningBid != 0.0 ? priceInEthWin : priceInEthAuc}`}
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
                className="mt-1 accent-[#7C3AED]"
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
                className="mt-1 accent-[#7C3AED]"
              />
              <span>Ownership is transferred to the winner</span>
            </label>
          </div>


          <button
            disabled={!canPay}
            onClick={handlePlaceBid}
            className={`mt-auto w-full bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] font-bold py-4 rounded-2xl shadow-lg transition uppercase tracking-wider
    ${canPay
                ? "hover:opacity-90 cursor-pointer"
                : "opacity-30 cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Placing Bid...
              </span>
            ) : (
              `Confirm & Bid ${bidAmount} ETH`
            )}
          </button>


        </div>
      </div>
    </div>
  );
};

export default AuctionCheckout;