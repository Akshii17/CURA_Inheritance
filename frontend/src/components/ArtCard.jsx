
import { ClockFading } from "lucide-react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { fetchEthPriceINR } from "./ethToRupee";
import { useArtistContext } from "../context/ArtistContext";
import { useQueryContext } from "../context/QueryContext";



const ArtCard = ({ art, page }) => {



  const { contract, address, isConnected, artist } = useArtistContext();
  const { DS, auction, artists, fetchArtworks, fetchLikedArtworks, likedArtworks } = useQueryContext();

  const artistObject = artists?.find(
    (item) =>
      item?.artistAddress?.toLowerCase() === art?.originalArtist?.toLowerCase()
  );




  const dsObject = DS?.find(
    (item) => item.artworkID === art.artworkID
  );

  let DSpriceWei = dsObject?.price;
  const priceInEth = DSpriceWei
    ? ethers.formatEther(DSpriceWei)
    : "0";

  const auctionObject = auction?.find(
    (item) => item.artID === art.artworkID
  );

  let aucBasePriceWei = auctionObject?.basePrice;
  const priceInEthAuc = aucBasePriceWei
    ? ethers.formatEther(aucBasePriceWei)
    : "0";

  let aucWinningPriceWei = auctionObject?.winningBid;
  const priceInEthWin = aucWinningPriceWei
    ? ethers.formatEther(aucWinningPriceWei)
    : "0";

  //console.log(likedArtworks);

  let loggedArtistAddress = artist?.artistAddress?.toLowerCase();





  const [tick, setTick] = useState(0);


  useEffect(() => {
    if (art.saleType !== "auction") return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [art.saleType]);


  const getTimeRemaining = () => {
    if (!auctionObject?.endTime) return undefined;

    const now = Date.now();

    // convert seconds → milliseconds
    const end = Number(auctionObject.endTime) * 1000;

    const diff = end - now;

    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  };



  const timeRemaining = art.saleType === "auction" ? getTimeRemaining() : null;

  const auctionEnded =
    art.saleType === "auction" &&
    auctionObject &&
    timeRemaining === null;

  if (auctionEnded && page === "explore") {
    return null;
  }

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


  const priceInInr = ethToInr ? Number(priceInEth) * ethToInr : null;
  const priceInInrAuc = ethToInr
    ? Number(priceInEthAuc) * ethToInr
    : null;
  const priceInInrWin = ethToInr
    ? Number(priceInEthWin) * ethToInr
    : null;


  const hasWinningBid =
    auctionObject?.winningBid &&
    BigInt(auctionObject.winningBid) > 0n;



  return (
    <div className="block group">

      {/* Image */}
      <Link to={`/art/${art.artworkID}`}>
        <div className="relative overflow-hidden rounded-lg bg-neutral-900 cursor-pointer">
          {/*Likes*/}


          <div className="relative inline-block w-full h-72 overflow-hidden rounded-lg shadow-2xl">
            <>
              <img
                key={art.id}
                src={`https://gateway.pinata.cloud/ipfs/${art.ipfsHash}`}
                alt={art.artworkTitle}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 pointer-events-none"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="transform -rotate-45 text-white/80 font-black text-2xl tracking-[0.3em] whitespace-nowrap mix-blend-overlay drop-shadow-md">
                  CURA © PROTECTED
                </div>
              </div>
            </>
          </div>

          {/* Sale Type Badge */}
          <span
            className="
            absolute top-3 left-3
            px-3 py-1 text-xs rounded-full
            bg-black/70 text-white
            backdrop-blur
          "
          >
            {art.saleType}
          </span>

          {/* Ends in Badge for Auction only */}
          {art.saleType === "auction" && (
            <div className="absolute top-3 right-3 group/ends">
              <div
                className=" flex items-center gap-1 px-3 py-1 text-xs text-white rounded-full bg-black/70 backdrop-blur overflow-hidden max-w-[80px] group-hover/ends:max-w-[260px] transition-all duration-300 ease-out origin-right"
              >


                {/* Compact */}
                {timeRemaining ? (
                  <>
                    <ClockFading size={14} className="shrink-0 opacity-80" />
                    <span className="whitespace-nowrap">
                      {timeRemaining.days}d {timeRemaining.hours}h
                    </span>
                  </>
                ) : (
                  <span className="whitespace-nowrap text-red-400">
                    Ended
                  </span>
                )}

                {/* Expanded (only if still live) */}
                {timeRemaining && (
                  <span
                    className="
                    whitespace-nowrap
                    opacity-0
                    group-hover/ends:opacity-100
                    transition-opacity duration-200 delay-100
                  "
                  >
                    {timeRemaining.minutes}m {timeRemaining.seconds}s
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div>
        <h3 className=" mt-2 font-serif text-lg text-white">
          {art.artworkTitle}
        </h3>
        <div className="flex justify-between" >
          <div className=" space-y-1">

            <Link to={`/artist/${artistObject?.artistAddress}`} className="text-sm text-gray-400 cursor-pointer hover:underline underline-offset-3 decoration-transparent
  transition-all duration-300
  hover:decoration-gray-300 hover:text-gray-300">
              By {artistObject.name}
            </Link>

            {/* ⭐ PRICE DISPLAY */}
            <p className="text-sm text-gray-300">
              {art.saleType === "auction" && (
                <span className="text-gray-500">
                  {hasWinningBid ? "Current Bid:" : "Base Price:"}{" "}
                  {hasWinningBid ? priceInEthWin : priceInEthAuc} ETH
                  {ethToInr && (
                    <>
                      {" "}
                      (₹{" "}
                      {(hasWinningBid
                        ? priceInInrWin
                        : priceInInrAuc)?.toLocaleString()}
                      )
                    </>
                  )}
                </span>
              )}



              {art.saleType === "direct" && (
                <span className="text-gray-500">
                  Price: {priceInEth} ETH
                  {ethToInr && (
                    <> (₹ {priceInInr?.toLocaleString()})</>
                  )}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ArtCard;
