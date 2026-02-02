import { ClockFading } from "lucide-react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ArtCard = ({ art, page }) => {

  const navigate = useNavigate();

  const mockAuthUser = {
    userId: 2,
    username: "N. Verma",
  };

  const loggedInUser = mockAuthUser;

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

  const handleFavoriteClick = (e) => {
    e.preventDefault();    // stops <Link>
    e.stopPropagation();  // stops bubbling

    setIsFavorite((prev) => !prev);
  };

  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/directcheckout/${art.id}`);
  };

  const handleSell = (e) => {
    //open modal to sell
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

  const getButtonConfig = ({ saleType, status, artistId, userId }) => {
    // UNSOLD → Sell
    if (status === "Unsold") {
      return { label: "Sell", action: handleSell };
    }

    // DIRECT SALE
    if (saleType === "direct") {
      if (artistId === userId) {
        return { label: "End Sale", action: handleRemove };
      }
      return { label: "Buy Now", action: handleBuy };
    }

    // AUCTION
    if (saleType === "auction") {
      if (artistId === userId) {
        return { label: "End Auction", action: handleEndAuction };
      }
      return { label: "Place Bid", action: handlePlaceBid };
    }

    return null;
  };

  const buttonConfig = getButtonConfig({
    saleType: art.saleType,
    status: art.status,
    artistId: art.artistId,
    userId: loggedInUser.userId,
  });

  if (!buttonConfig) return null;

  return (
    <div className="block group">
      {/* Image */}
      <Link to={`/art/${art.id}`}>
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

          <img src={art.image} alt={art.title} className=" w-full h-72 object-cover transition-transform duration-300 hover:scale-105 " />

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
          {art.title}
        </h3>
        <div className="flex justify-between" >
          <div className=" space-y-1">

            <p className="text-sm text-gray-400 cursor-pointer hover:underline underline-offset-3 decoration-transparent
  transition-all duration-300
  hover:decoration-gray-300 hover:text-gray-300">
              {art.artist}
            </p>

            <p className="text-sm text-gray-300">
              {art.saleType === "auction" && <span className="text-gray-500">Current Bid: </span>}
              {art.price} {art.currency}
            </p>
          </div>
          {page !== "explore" && <button onClick={buttonConfig.action} className="bg-neutral-700 h-8 w-20 mt-3 text-sm rounded-md cursor-pointer hover:bg-red-600 transition duration-300">
            {buttonConfig.label}
          </button>}
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
