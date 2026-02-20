import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useArtistContext } from "../context/ArtistContext";
import { useQueryContext } from "../context/QueryContext";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { GET_BID_HISTORY } from "../lib/GraphqlQueries";
import { request, gql } from "graphql-request";
import { fetchEthPriceINR } from "../components/ethToRupee";
import { Heart, LoaderCircle } from "lucide-react";

const ArtPage = () => {
  const GRAPHQL_ENDPOINT = "https://api.studio.thegraph.com/query/1723072/cura-graph-5/version/latest";

  const [open, setOpen] = useState(false);
  const [currentOwner, setCurrentOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bids, setBids] = useState([]);
  const [showBids, setShowBids] = useState(false);

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





  const { artist, contract, isConnected, address } = useArtistContext();
  const { artworks, auction, DS, artists, fetchArtworks, fetchAuction, fetchDS, likedArtworks, fetchLikedArtworks } = useQueryContext();

  const { id } = useParams();
  const navigate = useNavigate();

  const artwork = useMemo(() => {
    if (!artworks || !id) return null;
    return artworks.find((a) => String(a.artworkID) === String(id));
  }, [artworks, id]);

  const [isFavorite, setIsFavorite] = useState(() => {
    return likedArtworks?.some(
      (item) => String(item.artWorkID) === String(artwork.artworkID)
    ) || false;
  });

  console.log(isFavorite);
  console.log(likedArtworks);


  const handleFavoriteClick = async (e) => {
    e.preventDefault();    // stops <Link>
    e.stopPropagation();  // stops bubbling


    try {
      if (!isConnected || !address || !contract) {
        return;
      }



      console.log("liked", artwork.artworkID);

      setIsFavorite((prev) => !prev);
      const like = await contract.LikeUnlike(artwork.artworkID);
      await like.wait();



      fetchLikedArtworks();
      fetchArtworks();

    } catch (error) {
      setIsFavorite((prev) => !prev);
      console.log("error in liking", error);
      if (artwork?.originalArtist?.toLowerCase() === loggedArtistAddress.toLowerCase()) {
        toast.error("Cannot like own Artwork")
      }
      else {
        toast.error("Something went wrong, Please try again later");
      }
    }

  };

  const artistObject = artists?.find(
    (item) => item?.artistAddress?.toLowerCase() === artwork?.originalArtist?.toLowerCase()
  );

  const auctionObject = auction?.find((item) => item.artID === artwork.artworkID);

  let aucBasePriceWei = auctionObject?.basePrice;
  const priceInEthAuc = aucBasePriceWei ? ethers.formatEther(aucBasePriceWei) : "0";

  let aucWinningPriceWei = auctionObject?.winningBid;
  const priceInEthWin = aucWinningPriceWei ? ethers.formatEther(aucWinningPriceWei) : "0";

  let AuctionID = auctionObject?.auctionID;

  const dsObject = DS.find((item) => item.artworkID === artwork.artworkID);
  const DSid = dsObject?.directSaleID;

  let dsPriceWei = dsObject?.price;
  const priceInEth = dsPriceWei ? ethers.formatEther(dsPriceWei) : "0";

  let loggedArtistAddress = artist.artistAddress.toLowerCase();

  const priceInInr = ethToInr ? Number(priceInEth) * ethToInr : null;
  const priceInInrAuc = ethToInr
    ? Number(priceInEthAuc) * ethToInr
    : null;
  const priceInInrWin = ethToInr
    ? Number(priceInEthWin) * ethToInr
    : null;

  const fetchBids = async () => {
    try {
      const data = await request(GRAPHQL_ENDPOINT, GET_BID_HISTORY, { aucID: AuctionID });
      setBids(data.bidPlaceds);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!AuctionID) return;
    fetchBids();
  }, [auctionObject]);

  console.log(bids);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        if (!contract || !artwork?.artworkID) return;
        const owner = await contract.checkOwnership(artwork.artworkID);
        setCurrentOwner(owner);
      } catch (error) {
        console.error("Error fetching owner:", error);
      }
    };
    fetchOwner();
  }, [contract, artwork]);

  const ownerObject = artists?.find(
    (item) => item?.artistAddress?.toLowerCase() === currentOwner?.toLowerCase()
  );

  const [tick, setTick] = useState(0);
  const isCreator = artwork?.originalArtist.toLowerCase() === loggedArtistAddress;
  const isCollector = currentOwner?.toLowerCase() === loggedArtistAddress && currentOwner.toLowerCase() !== artwork.originalArtist.toLowerCase();
  const isCurrentlyForSale = artwork?.available;

  useEffect(() => {
    if (artwork?.saleType !== "auction") return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [artwork?.saleType]);

  const getTimeRemaining = (auctionObj) => {
    if (!auctionObj?.endTime) return undefined;
    const now = Date.now();
    const end = Number(auctionObj.endTime) * 1000;
    const diff = end - now;
    if (diff <= 0) return null;
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  };

  const remainingTime = useMemo(
    () => (artwork?.saleType === "auction" ? getTimeRemaining(auctionObject) : null),
    [auctionObject, tick]
  );

  if (!artwork) return <div className="p-10 text-[#F3E5AB] bg-[#050505] min-h-screen">Art not found</div>;

  const handleEndSale = async () => {
    try {
      setIsLoading(true);
      if (!isConnected || !address || !contract) return;
      const endDS = await contract.endDS(DSid);
      await endDS.wait();
      toast.success("Direct Sale ended");

      await fetchArtworks();
      await fetchDS();

      setIsLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  console.log(DS);

  const handleEndAuction = async () => {
    try {
      setIsLoading(true);
      if (!isConnected || !address || !contract) return;
      const endAuction = await contract.endAuction(AuctionID);
      await endAuction.wait();
      toast.success("Auction ended");

      await fetchArtworks();
      await fetchAuction();

      setIsLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="max-w-6xl w-full space-y-4">
        <button onClick={() => navigate(-1)} className="text-xs font-bold tracking-[0.2em] text-neutral-500 hover:text-[#F3E5AB] flex items-center gap-2 uppercase transition-colors">
          ← Go Back
        </button>

        <div className="checkout-container border border-white/10 rounded-[24px] w-full flex flex-col md:flex-row overflow-hidden shadow-2xl bg-white/5 backdrop-blur-xl">
          {/* LEFT: Image Section */}
          <div className="md:w-1/2 bg-neutral-900/40 flex items-center justify-center p-6 border-r border-white/5 relative select-none">
            <div className="relative inline-block overflow-hidden rounded-lg shadow-2xl">
              <img
                key={artwork.id}
                src={`https://gateway.pinata.cloud/ipfs/${artwork.ipfsHash}`}
                alt={artwork.artworkTitle}
                className="max-w-full max-h-[500px] object-contain pointer-events-none"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="transform -rotate-45 text-white/80 font-black text-2xl tracking-[0.3em] whitespace-nowrap mix-blend-overlay drop-shadow-md">
                  CURA © PROTECTED
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Info Section */}
          <div className="md:w-1/2 p-10 flex flex-col justify-between bg-black/20">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#7C3AED] uppercase">
                  {artwork.saleType}
                </span>

                {/* --- TITLE & LIKE BUTTON ROW --- */}
                <div className="flex items-center justify-between mt-2 gap-4">
                  <h1 className="text-5xl font-serif text-[#F3E5AB] leading-tight">
                    {artwork.artworkTitle}
                  </h1>

                  <button
                    onClick={handleFavoriteClick}
                    className="flex items-center gap-2 group cursor-pointer active:scale-90 transition-transform"
                  >
                    <div className={`p-2 rounded-full border transition-all ${isFavorite ? 'bg-red-500/10 border-red-500/50' : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}>
                      <Heart
                        size={22}
                        className={`transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-neutral-500 group-hover:text-neutral-300'}`}
                      />
                    </div>
                    <span className={`text-sm font-mono font-bold ${isFavorite ? 'text-red-500' : 'text-neutral-500'}`}>
                      {artwork.likes}
                    </span>
                  </button>
                </div>

                <p className="text-sm text-neutral-400 mt-2">
                  Original Artist: <span className="text-white font-medium">{artistObject?.name}</span>
                </p>
                {artwork.saleType !== "" && (
                  <p className="text-sm text-neutral-400 mt-2">
                    Seller: <span className="text-white font-medium">{ownerObject?.name}</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Description</p>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  {artwork.description || "A curated high-fidelity digital asset from the CURA collection."}
                </p>
              </div>

              {artwork.saleType === "auction" && (
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Base Price:</p>
                  <p className="text-sm text-neutral-400 font-light">
                    {priceInEthAuc} ETH{" "}
                    {priceInInrAuc && (
                      <span className="text-neutral-500">
                        (₹ {priceInInrAuc.toLocaleString("en-IN", { maximumFractionDigits: 0 })})
                      </span>
                    )}
                  </p>

                </div>
              )}

              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <div className="flex justify-between items-center">
                  <div>
                    {artwork.saleType === "auction" ? (
                      <>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Current Bid</p>
                        <p className="text-3xl font-bold text-[#7C3AED]">
                          {priceInEthWin} ETH{" "}
                          {priceInInrWin !== null && (
                            <span className="text-lg text-neutral-400 font-normal">
                              (₹ {priceInInrWin.toLocaleString("en-IN", { maximumFractionDigits: 0 })})
                            </span>
                          )}
                        </p>
                      </>
                    ) : artwork.saleType === "direct" ? (
                      <>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Price</p>
                        <p className="text-3xl font-bold text-[#7C3AED]">
                          {priceInEth} ETH{" "}
                          {priceInInr && (
                            <span className="text-lg text-neutral-400 font-normal">
                              (₹ {priceInInr.toLocaleString("en-IN", { maximumFractionDigits: 0 })})
                            </span>
                          )}
                        </p>
                      </>
                    ) : (
                      <p className="text-xl uppercase tracking-widest font-bold text-[#7C3AED]">Currently not Listed for sale </p>
                    )}
                  </div>
                  {artwork.saleType === "auction" && remainingTime && (
                    <div className="text-right">
                      <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Time Left</p>
                      <p className="text-lg font-mono text-[#F3E5AB]">
                        {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m {remainingTime.seconds}s
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {artwork.saleType === "auction" && (
                <div className="pt-2">
                  <button onClick={() => setShowBids(!showBids)} className="w-full text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2 flex justify-between items-center hover:text-neutral-300">
                    <span>Past Bids ({bids?.length || 0})</span>
                    <span>{showBids ? "▲" : "▼"}</span>
                  </button>
                  {showBids && (
                    <div className="max-h-[140px] overflow-y-auto space-y-2 pr-2 bg-white/5 rounded-xl p-3 border border-white/5">
                      {bids.length > 0 ? bids.map((bid, index) => (
                        <div key={index} className="flex justify-between items-center bg-black/40 p-3 rounded-lg">
                          <span className="text-sm text-neutral-300 font-mono">{bid.bidder.slice(0, 6)}...{bid.bidder.slice(-4)}</span>
                          <span className="text-sm text-[#F3E5AB] font-bold">{ethers.formatEther(bid.bid)} ETH</span>
                        </div>
                      )) : <div className="text-center py-4 text-sm text-neutral-500 italic">No bids yet.</div>}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10">
              {isCreator ? (
                <div className="flex flex-col gap-3">
                  {isCurrentlyForSale && (currentOwner?.toLowerCase() === loggedArtistAddress) && (
                    <button onClick={() => setOpen(true)} className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-xs bg-[#7C3AED] hover:bg-[#5f2db7] cursor-pointer text-[#F3E5AB]">SELL ARTWORK</button>
                  )}
                  {!isCurrentlyForSale && artwork?.saleType === "auction" && (
                    <button
                      onClick={handleEndAuction}
                      disabled={isLoading}
                      className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-xs bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                          ENDING AUCTION...
                        </span>
                      ) : (
                        "END AUCTION"
                      )}
                    </button>
                  )}
                  {!isCurrentlyForSale && artwork?.saleType === "direct" && (
                    <button
                      onClick={handleEndSale}
                      disabled={isLoading}
                      className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-xs bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoaderCircle className="w-4 h-4 animate-spin " />
                          ENDING SALE...
                        </span>
                      ) : (
                        "END SALE"
                      )}
                    </button>
                  )}
                </div>
              ) : isCollector ? (
                <button onClick={() => setOpen(true)} className="w-full py-5 bg-[#7C3AED] hover:bg-[#5f2db7] cursor-pointer text-[#F3E5AB] rounded-xl font-bold tracking-[0.3em] text-xs">LIST FOR RESALE</button>
              ) : artwork.saleType != "" ? (
                <Link to={artwork.saleType === "auction" ? `/auctioncheckout/${artwork.artworkID}` : `/directcheckout/${artwork.artworkID}`}>
                  <div className="w-full py-5 bg-[#7C3AED] hover:bg-[#5f2db7] cursor-pointer text-[#F3E5AB] rounded-xl font-bold tracking-[0.3em] text-xs text-center">
                    {artwork.saleType === "auction" ? "PLACE YOUR BID" : "PURCHASE ARTWORK"}
                  </div>
                </Link>
              ) : (
                <div className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-xs text-center text-neutral-500 border border-white/10">
                  NOT FOR SALE
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)} id={artwork.artworkID} />
    </div>
  );
};

export default ArtPage;