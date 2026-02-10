import { useState } from "react";
import toast from "react-hot-toast";
import { useArtistContext } from "../context/ArtistContext";


const Modal = ({ isOpen, onClose, id }) => {
    const { contract, address, isConnected } = useArtistContext();
  const [saleType, setSaleType] = useState("");
  const [price, setPrice] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false)

  if (!isOpen) return null;

  // date limits
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

    const todaydate = new Date();
    const end = new Date(endDate);
    const duration = Math.floor((end - todaydate) / 1000) + 66600;

    const handleSubmit = async () => {
    try {

      if (saleType === "auction" && (!basePrice || !endDate)) {
        toast.error("Fill all fields correctly ");
        return;
      }
      if (saleType === "direct" && (!price)) {
        toast.error("Fill all fields correctly ");
        return;
      }

      if(saleType === "auction"){
        createAuction(id, basePrice, duration)
      }


      if(saleType === "direct"){
        createDS(price, id)
      }

    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Something went wrong");
    }
  };

  const createDS = async (price, id) => {
    try {
      setIsLoading(true);
      if (!isConnected || !address || !contract) {
        return;
      }

      console.log(duration);

      const sellds = await contract.createDS(
        price, id
      );

      await sellds.wait();
      toast.success("Direct Sale created successfully");

      // Reset state
      onClose();
      setPrice("");
      setBasePrice("");
      setIsLoading(false);
    } catch (error) {
      console.log("error in createArtwork", error);
      toast.error("Something went wrong, Please try again later");
      setIsLoading(false);
    }
  };

  const createAuction = async (id, basePrice, duration) => {
    try {
      setIsLoading(true);
      if (!isConnected || !address || !contract) {
        return;
      }

      console.log(todaydate, end, duration);

      const sellauc = await contract.createAuction(
        id, basePrice, duration
      );

      await sellauc.wait();
      toast.success("Auction created successfully");

      // Reset state
      setOpen(false);
      setPrice("");
      setBasePrice("");
      setIsLoading(false);
    } catch (error) {
      console.log("error in createArtwork", error);
      toast.error("Something went wrong, Please try again later");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-black p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Sell Artwork
        </h2>

        {/* Sale Type */}
        <div className="mb-4 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="saleType"
              value="auction"
              checked={saleType === "auction"}
              onChange={() => setSaleType("auction")}
              className="accent-[#7C3AED]"
            />
            Auction
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="saleType"
              value="direct"
              checked={saleType === "direct"}
              onChange={() => setSaleType("direct")}
              className="accent-[#7C3AED]"
            />
            Direct Sale
          </label>
        </div>

        {/* Auction Fields */}
        {saleType === "auction" && (
          <div className="space-y-3">
            <p className="mb-1">Base Price (in ETH)</p>
            <input
              placeholder="Enter base price"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />
            <p className="mb-1">End Date</p>
            <input
              type="date"
              value={endDate}
              min={today}
              max={maxDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        )}

        {/* Direct Sale Fields */}
        {saleType === "direct" && (
          <div className="mt-3">
            <p className="mb-1">Price (in ETH)</p>
            <input
              
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-lg bg-[#7c3aed] text-[#F3E5AB] px-4 py-2 hover:bg-[#5f2db7] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default Modal;