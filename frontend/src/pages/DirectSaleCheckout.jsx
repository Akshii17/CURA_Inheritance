import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Lock, LoaderCircle } from "lucide-react";
import { useArtistContext } from "../context/ArtistContext";
import { useQueryContext } from "../context/QueryContext";
import { ethers } from "ethers";
import { fetchEthPriceINR } from "../context/ethToRupee";

const DirectSaleCheckout = () => {

  const navigate = useNavigate();

  const { contract, address, isConnected } = useArtistContext();
  const { artworks, fetchArtworks, DS, artists, fetchDS } = useQueryContext();

  const { id } = useParams();

  const artwork = useMemo(() => {
    if (!artworks || !id) return null;

    return artworks.find(
      (a) => String(a.artworkID) === String(id)
    );
  }, [artworks, id]);

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

  const dsObject = DS.find(
    (item) => item.artworkID === artwork.artworkID
  );

  const DSid = dsObject?.directSaleID;
  if (!artwork) {
    return <div className="text-white p-10">Artwork not found</div>;
  }

  let DSpriceWei = dsObject?.price;
  const priceInEth = ethers.formatEther(DSpriceWei);

  const priceInInr = ethToInr ? Number(priceInEth) * ethToInr : null;


  const [finalSaleChecked, setFinalSaleChecked] = useState(false);
  const [ownershipChecked, setOwnershipChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const canPay = finalSaleChecked && ownershipChecked;

  const handlePay = async () => {
    try {
      setIsLoading(true);

      if (!isConnected || !address || !contract) {
        return;
      }

      console.log(DSid);

      const tx = await contract.buyDSArtwork(DSid, { value: DSpriceWei });

      await tx.wait();
      toast.success("Artwork purchased");
      navigate(`/success/${artwork.artworkID}`);

      fetchDS();
      fetchArtworks();

      // Reset state
      //show
      setIsLoading(false);
    } catch (error) {
      console.log("error in createArtwork", error);
      toast.error("Something went wrong, Please try again later");
      setIsLoading(false);
    }
  };

  return (
    <div className=" w-full text-white flex items-center justify-center px-6 py-5">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-stretch">

        {/* LEFT — ARTWORK (MATCHES AUCTION) */}
        <div className="space-y-6 flex flex-col items-center h-full justify-center">
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
            <p className="text-gray-400">by {artistObject.name}</p>
            {/* <p className="text-gray-400">Sold by: {artwork.currentOwner}</p> */}
          </div>
        </div>


        {/* RIGHT — CHECKOUT (MATCHES AUCTION HEIGHT) */}
        <div className="bg-white/5 rounded-2xl p-8 space-y-6 backdrop-blur h-full flex flex-col">
          <h2 className="text-2xl font-semibold text-[#F3E5AB]">
            Purchase Details
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Artwork Price</span>
              <p className="text-2xl font-bold text-[#7C3AED]">
                {priceInEth} ETH{" "}
                {priceInInr && (
                  <span className="text-lg text-neutral-400 font-normal">
                    (₹ {priceInInr.toLocaleString("en-IN", { maximumFractionDigits: 0 })})
                  </span>
                )}
              </p>

            </div>
          </div>

          <div className="space-y-1">
            <div className="bg-black/40 px-4 py-3 rounded-xl text-sm truncate border border-white/5">
              <p className="text-bold text-[#F3E5AB]">Notice</p>
              <p>Once confirmed, purchases cannot be canceled, reversed, or refunded.</p>
              <p> Upon successful payment, the digital asset is immediately transferred to <br /> your connected wallet.</p>
            </div>
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
                I understand this is a <b>final sale</b>
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ownershipChecked}
                onChange={(e) => setOwnershipChecked(e.target.checked)}
                className="mt-1 accent-[#7C3AED]"
              />
              <span>Ownership transfer occurs after payment</span>
            </label>
          </div>

          <div className="bg-black/40 rounded-xl p-4 text-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Lock size={16} />
              <span className="font-semibold">Final Confirmation</span>
            </div>

            <p>
              You are about to purchase <b>“{artwork.artworkTitle}”</b> by{" "}
              <b>{artistObject.name}</b> for{" "}
              <b>{priceInEth} ETH</b>.
            </p>

            <p className="text-red-400/80 italic text-xs">
              This transaction is non-refundable.
            </p>
          </div>

          <button
            disabled={!canPay}
            onClick={handlePay}
            className={`mt-auto w-full bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] font-bold py-4 rounded-2xl shadow-lg transition uppercase tracking-wider
    ${canPay
                ? "hover:opacity-90 cursor-pointer"
                : "opacity-30 cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Confirming Payment...
              </span>
            ) : (
              `Confirm & Pay ${priceInEth} ETH`
            )}
          </button>


        </div>
      </div>
    </div>
  );
};

export default DirectSaleCheckout;
