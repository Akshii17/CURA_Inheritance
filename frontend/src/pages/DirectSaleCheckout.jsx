import { useParams } from "react-router-dom";
import { useState } from "react";
import { Lock } from "lucide-react";
import SampleArtData from "../constants/SampleArtData";

const DirectSaleCheckout = () => {
  const { id } = useParams();
  const art = SampleArtData.find((a) => a.id === Number(id));

  if (!art) {
    return <div className="text-white p-10">Artwork not found</div>;
  }

  const artwork = {
    image: art.image,
    title: art.title,
    artist: art.artist,
    tags: art.tags,
    priceETH: art.piece || 1.1,
    gasETH: 0.002,
  };

  const [finalSaleChecked, setFinalSaleChecked] = useState(false);
  const [ownershipChecked, setOwnershipChecked] = useState(false);

  const totalETH = artwork.priceETH + artwork.gasETH;
  const canPay = finalSaleChecked && ownershipChecked;

  const handlePay = async() => {
    try {
      if (!isConnected || !address || !contract) {
        return;
      }

      console.log();

      const tx = await contract.buyDSArtwork(
        title,
        ipfsHash,
        description,
        royalty,
      );

      await tx.wait();
      toast.success("Artwork created successfully");

      // Reset state
      setShowCreateModal(false);
      setDescription("");
      setTitle("");
      setRoyaltyP("");
      setImage(null);
      setImagePreview(null);
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
              src={artwork.image}
              alt={artwork.title}
              className="rounded-xl shadow-lg w-full h-full object-cover"
            />

            
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#F3E5AB]">
              {artwork.title}
            </h1>
            <p className="text-gray-400">by {artwork.artist}</p>

            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {artwork.tags.map((tag) => (
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

        {/* RIGHT — CHECKOUT (MATCHES AUCTION HEIGHT) */}
        <div className="bg-white/5 rounded-2xl p-8 space-y-6 backdrop-blur h-full flex flex-col">
          <h2 className="text-2xl font-semibold text-[#F3E5AB]">
            Purchase Details
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Artwork Price</span>
              <span>{artwork.priceETH.toLocaleString()} ETH</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Gas / Transaction</span>
              <span>{artwork.gasETH.toLocaleString()} ETH</span>
            </div>

            <hr className="border-white/10" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-[#F3E5AB]">
                {totalETH.toLocaleString()} ETH
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="bg-black/40 px-4 py-3 rounded-xl text-sm truncate border border-white/5">
              <p>Notice</p>
              <p>...</p>
              <p>...</p>
            </div>
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
                I understand this is a <b>final sale</b>
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ownershipChecked}
                onChange={(e) => setOwnershipChecked(e.target.checked)}
                className="mt-1 accent-indigo-800"
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
              You are about to purchase <b>“{artwork.title}”</b> by{" "}
              <b>{artwork.artist}</b> for{" "}
              <b>{totalETH.toLocaleString()} ETH</b>.
            </p>

            <p className="text-red-400/80 italic text-xs">
              This transaction is non-refundable.
            </p>
          </div>

          <button
            disabled={!canPay}
            onClick={handlePay}
            className={`mt-auto w-full bg-indigo-600 hover:bg-indigo-800 text-[#F3E5AB] font-bold py-4 rounded-2xl shadow-lg transition uppercase tracking-wider
              ${
                canPay
                  ? "hover:opacity-90 cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
          >
            Confirm & Pay {totalETH.toLocaleString()} ETH
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectSaleCheckout;
