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

const ArtPage = () => {

  const GRAPHQL_ENDPOINT = "https://api.studio.thegraph.com/query/1723072/cura-graph-4/version/latest";


  const [open, setOpen] = useState(false);
  const [currentOwner, setCurrentOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bids, setBids] = useState([]);

  const { artist, contract, isConnected, address } = useArtistContext();

  const { artworks, auction, DS, artists } = useQueryContext();

  const { id } = useParams();
  const navigate = useNavigate();

  const artwork = useMemo(() => {
    if (!artworks || !id) return null;

    return artworks.find(
      (a) => String(a.artworkID) === String(id)
    );
  }, [artworks, id]);

  const artistObject = artists?.find(
    (item) =>
      item?.artistAddress?.toLowerCase() === artwork?.originalArtist?.toLowerCase()
  );

  const auctionObject = auction?.find(
    (item) => item.artID === artwork.artworkID
  );

  console.log(auctionObject);

  let aucBasePriceWei = auctionObject?.basePrice;
  const priceInEthAuc = aucBasePriceWei
    ? ethers.formatEther(aucBasePriceWei)
    : "0";

  let aucWinningPriceWei = auctionObject?.winningBid;
  const priceInEthWin = aucWinningPriceWei
    ? ethers.formatEther(aucWinningPriceWei)
    : "0";

  let AuctionID = auctionObject?.auctionID;

  const dsObject = DS.find(
    (item) => item.artworkID === artwork.artworkID
  );

  const DSid = dsObject?.directSaleID;

  let dsPriceWei = dsObject?.price;
  const priceInEth = dsPriceWei
    ? ethers.formatEther(dsPriceWei)
    : "0";

  console.log(priceInEth)

  let loggedArtistAddress = artist.artistAddress.toLowerCase();

  const fetchBids = async () => {
    try {
      const data = await request(GRAPHQL_ENDPOINT, GET_BID_HISTORY,
        {
          aucID: AuctionID
        });
      console.log("Graph response:", data);
      setBids(data.bidPlaceds);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!AuctionID) return;
    fetchBids();
  }, [auctionObject]);

 
    console.log("BIDS UPDATED:", bids);
  

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
    (item) =>
      item?.artistAddress?.toLowerCase() === currentOwner?.toLowerCase()
  );

  console.log(ownerObject);


  const [tick, setTick] = useState(0);

  // Logic for roles
  const isCreator = artwork?.originalArtist.toLowerCase() === loggedArtistAddress;
  const isCollector = currentOwner && currentOwner.toLowerCase() !== artwork.originalArtist.toLowerCase();
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
  () =>
    artwork?.saleType === "auction"
      ? getTimeRemaining(auctionObject)
      : null,
  [auctionObject, tick]
);


  if (!artwork) return <div className="p-10 text-[#F3E5AB] bg-[#050505] min-h-screen">Art not found</div>;

  const handleEndSale = async () => {
    try {
      setIsLoading(true);

      if (!isConnected || !address || !contract) {
        return;
      }

      console.log(DSid);

      const endDS = await contract.endDS(DSid);

      await endDS.wait();
      toast.success("Direct Sale ended");

      // Reset state
      setIsLoading(false);
    } catch (error) {
      console.log("error in ending sale", error);
      toast.error("Something went wrong, Please try again later");
      setIsLoading(false);
    }
  };

  const handleEndAuction = async () => {
    try {
      setIsLoading(true);

      if (!isConnected || !address || !contract) {
        return;
      }



      const endAuction = await contract.endAuction(AuctionID);

      await endAuction.wait();
      console.log(AuctionID);
      toast.success("Auction ended");

      // Reset state
      setIsLoading(false);
    } catch (error) {
      console.log("error in ending auction", error);
      toast.error("Something went wrong, Please try again later");
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
                  Original Artist: <span className="text-white font-medium">{artistObject?.name}</span>
                </p>
                <p className="text-sm text-neutral-400 mt-2">
                  Seller: <span className="text-white font-medium">{ownerObject?.name}</span>
                </p>
              </div>

              {/* Description */}
              <div className="pt-2">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Description</p>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  {artwork.description || "A curated high-fidelity digital asset from the CURA collection."}
                </p>
              </div>

              <div className="pt-2">
                {artwork.saleType === "auction" && (
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-1">
                      Base Price:
                    </p>
                    <p className="text-sm text-neutral-400 font-light">
                      {priceInEthAuc} ETH
                    </p>
                  </div>
                )}
              </div>

              {/* Pricing Section - Always Visible */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <div className="flex justify-between items-center">
                  <div>
                    {artwork.saleType === "auction" && (
                      <>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">
                          Current Bid
                        </p>
                        <p className="text-3xl font-bold text-[#7C3AED]">
                          {priceInEthWin} ETH
                        </p>
                      </>
                    )}

                    {artwork.saleType === "direct" && (
                      <>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">
                          Price
                        </p>
                        <p className="text-3xl font-bold text-[#7C3AED]">
                          {priceInEth} ETH
                        </p>
                      </>
                    )}
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
                  {isCurrentlyForSale && (currentOwner===loggedArtistAddress) && (
                    <button
                      onClick={() => setOpen(true)}
                      className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-xs transition-all bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] cursor-pointer"
                    >
                      SELL ARTWORK
                    </button>
                  )}

                  {/* END AUCTION */}
                  {!isCurrentlyForSale && artwork?.saleType === "auction" && (
                    <button
                      onClick={handleEndAuction}
                      className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-xs transition-all bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] cursor-pointer"
                    >
                      END AUCTION
                    </button>
                  )}

                  {/* END SALE */}
                  {!isCurrentlyForSale && artwork?.saleType === "direct" && (
                    <button
                      onClick={handleEndSale}
                      className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-xs transition-all bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] cursor-pointer"
                    >
                      END SALE
                    </button>
                  )}

                </div>
              ) : isCollector ? (
                /* Collector (Owner) Buttons */
                <div className="flex flex-col gap-3">
                  {isCurrentlyForSale ? (
                    <button
                      onClick={() => setOpen(true)}
                      className="w-full py-5 bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] rounded-xl font-bold tracking-[0.3em] text-xs transition-all cursor-pointer"
                    >
                      LIST FOR RESALE
                    </button>
                  ) : (
                    <button
                      //onClick={}
                      className="w-full py-5 bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] rounded-xl font-bold tracking-[0.3em] text-xs transition-all cursor-pointer"
                    >
                      END RESALE
                    </button>
                  )}
                </div>

              ) : (
                /* Public Buyer Button */
                <>
                  {artwork.saleType === "auction" ? (
                    <Link to={`/auctioncheckout/${artwork.artworkID}`}>
                      <div
                        className="w-full py-5 bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] rounded-xl font-bold tracking-[0.3em] text-xs transition-all active:scale-[0.98] text-center"
                      // onClick={handlePlaceBid}
                      >
                        PLACE YOUR BID
                      </div>
                    </Link>
                  ) : (
                    <Link to={`/directcheckout/${artwork.artworkID}`}>
                      <div className="w-full py-5 bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] rounded-xl font-bold tracking-[0.3em] text-xs transition-all active:scale-[0.98] text-center"

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

export default ArtPage;