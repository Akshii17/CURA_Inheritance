
import { ClockFading } from "lucide-react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { useArtistContext } from "../context/ArtistContext";
import { useQueryContext } from "../context/QueryContext";



const ArtCard = ({ art, page }) => {

  

  const { contract, address, isConnected, artist } = useArtistContext();
  const { DS, auction } = useQueryContext();

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


  const navigate = useNavigate();

  let loggedArtistAddress = artist.artistAddress.toLowerCase();


  const [isFavorite, setIsFavorite] = useState(false);
  const [tick, setTick] = useState(0);
  

  useEffect(() => {
    if (art.saleType !== "auction") return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [art.saleType]);


  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) {
      return null; // auction ended
    }

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  };

  const timeRemaining = art.saleType === "auction" ? getTimeRemaining(art.endDate) : null;

  const auctionEnded = art.saleType === "auction" && timeRemaining === null;
  if (auctionEnded && page === "explore") {
    return null;
  }

  const handleFavoriteClick = async(e) => {
    e.preventDefault();    // stops <Link>
    e.stopPropagation();  // stops bubbling

    try {
      if (!isConnected || !address || !contract) {
        return;
      }

      console.log("liked", art.artworkID);

      const like = await contract.LikeUnlike( art.artworkID );

      await like.wait();

     // for red heart...change this
      setIsFavorite((prev) => !prev);

    } catch (error) {
      console.log("error in liking", error);
      toast.error("Something went wrong, Please try again later");
    }

  };

  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/directcheckout/${art.ArtworkID}`);
  };

  const handleSell = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const handleRemove = (e) => {
    //open modal to remove
  };

  const handleEndAuction = (e) => {
    //open modal to end auc
  };

  const handlePlaceBid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/auctioncheckout/${art.id}`);
  };



  return (
    <div className="block group">
      
      {/* Image */}
      <Link to={`/art/${art.artworkID}`}>
        <div className="relative overflow-hidden rounded-lg bg-neutral-900 cursor-pointer">
          {/*Likes*/}
          <button
            onClick={handleFavoriteClick}
            className="
            absolute bottom-3 right-3 z-10
            p-2 rounded-full
            bg-black/70 backdrop-blur
            transition-transform
            hover:scale-110
          "
          >
            <Heart
              size={18}
              className={`
              transition-colors
              ${isFavorite
                  ? "text-red-500 fill-red-500"
                  : "text-white"}
            `}
            />
          </button>

          <img key={art.id} src={`https://gateway.pinata.cloud/ipfs/${art.ipfsHash}`} alt={art.artworkTitle} className=" w-full h-72 object-cover transition-transform duration-300 hover:scale-105 " />

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

            <Link to = {`/artist/${art.artistId}`} className="text-sm text-gray-400 cursor-pointer hover:underline underline-offset-3 decoration-transparent
  transition-all duration-300
  hover:decoration-gray-300 hover:text-gray-300">
              {art.originalArtist} {/*fetch his nameeee??????????????*/}
            </Link>

            <p className="text-sm text-gray-300">
              {art.saleType === "auction" && <span className="text-gray-500">Current Bid: {auction.winningBid?priceInEthWin:priceInEthAuc} </span>}
              {art.saleType === "direct" && <span className="text-gray-500">Price: {priceInEth} </span>}
              {"ETH"}
            </p>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ArtCard;
