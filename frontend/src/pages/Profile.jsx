import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useArtistContext } from "../context/ArtistContext";
import { axiosInstance } from "../lib/axiosInstance";
const Profile = () => {
  const { contract, address, isConnected } = useArtistContext();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [royaltyP, setRoyaltyP] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const imageRef = useRef(null);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("image", image);
      const res = await axiosInstance.post("/ipfs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: (data) => {
      console.log(data.data.imageHash);
      createArtwork(data.data.imageHash);
    },
    onError: (err) => {
      setIsLoading(false);
      console.log("error", err);
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong, Please try again later",
      );
    },
  });

  const createArtwork = async (ipfsHash) => {
    if (!isConnected || !address || !contract) {
      return;
    }
    console.log("in blocjachin function");
    const royalty = Number(royaltyP);

    if (Number.isNaN(royalty)) {
      toast.error("Royalty must be a number");
      return;
    }
    console.log(title, ipfsHash, description, royalty);

    const tx = await contract.createArtwork(
      title,
      ipfsHash,
      description,
      royalty,
    );

    await tx.wait();
    toast.success("Artwork created successfully 🎉");

    // Reset state
    setShowCreateModal(false);
    setDescription("");
    setTitle("");
    setRoyaltyP("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      const royalty = parseInt(royaltyP, 10);

      if (
        !title ||
        !description ||
        !image ||
        isNaN(royalty) ||
        royalty < 1 ||
        royalty > 99
      ) {
        toast.error("Fill all fields correctly (royalty 1–99)");
        return;
      }
      setIsLoading(true);

      mutate();
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6">
      {/* CREATE BUTTON */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-6 py-3 bg-white text-black font-semibold rounded-xl"
      >
        Create Artwork
      </button>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Artwork</h2>

            {/* IMAGE */}
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {imagePreview && (
              <img src={imagePreview} className="mt-3 rounded-xl" />
            )}

            {/* TITLE */}
            <input
              type="text"
              placeholder="Title"
              className="w-full mt-4 p-3 rounded-lg bg-zinc-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* DESCRIPTION */}
            <textarea
              placeholder="Description"
              className="w-full mt-3 p-3 rounded-lg bg-zinc-800"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* ROYALTY */}
            <input
              type="number"
              placeholder="Royalty (1–99)"
              className="w-full mt-3 p-3 rounded-lg bg-zinc-800"
              value={royaltyP}
              onChange={(e) => setRoyaltyP(e.target.value)}
            />

            {/* ACTIONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setDescription("");
                  setTitle("");
                  setRoyaltyP("");
                  setImage("");
                }}
                className="flex-1 p-3 rounded-xl bg-zinc-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 p-3 rounded-xl bg-white text-black font-bold disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
