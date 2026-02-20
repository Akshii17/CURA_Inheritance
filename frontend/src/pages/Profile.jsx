import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useArtistContext } from "../context/ArtistContext";
import { useQueryContext } from "../context/QueryContext";
import { axiosInstance } from "../lib/axiosInstance";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { request, gql } from "graphql-request";
import { GET_WITHDRAWAL_INFO } from "../lib/GraphqlQueries";
import { User, LoaderCircle, Share, X, Save, Camera, Heart, MessageCircle, Plus, Upload, Bell, MapPin, Link as LinkIcon, Calendar, ArrowRight, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { ethers } from "ethers";

const ArtistFollowingStrip = ({ artists = [] }) => {
  if (!artists.length) return null;

  return (
    <div className="mt-12 mb-12">
      <h2 className="text-2xl font-serif text-[#F3E5AB]">
        Artists You Follow
      </h2>

      {/* Horizontal Avatar Strip */}
      <div className="w-full bg-black rounded-2xl p-1 overflow-x-auto overflow-y-visible">
        <div className="flex items-center gap-1 relative">
          {artists.map((artist) => (
            <Link
              key={artist.artistAddress}
              to={`/artist/${artist.artistAddress}`}
              className="relative group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black 
                              transition-all duration-300 
                              group-hover:scale-110 
                              group-hover:border-[#7C3AED]">
                {artist.pfpHash ? (
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${artist.pfpHash}`}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                    <User size={20} className="text-neutral-500" />
                  </div>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-8 
                              opacity-0 group-hover:opacity-100 
                              transition-all duration-200 
                              bg-[#1f1f1f] text-white text-xs 
                              px-3 py-1 rounded-md shadow-lg 
                              whitespace-nowrap z-50 pointer-events-none">
                {artist.name || "Unnamed"}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArtistFollowerStrip = ({ artists = [] }) => {
  if (!artists.length) return null;

  return (
    <div className="mt-12 mb-12">
      <h2 className="text-2xl font-serif text-[#F3E5AB]">
        Your Followers
      </h2>

      {/* Horizontal Avatar Strip */}
      <div className="w-full bg-black rounded-2xl p-1 overflow-x-auto overflow-y-visible">
        <div className="flex items-center gap-1 relative">
          {artists.map((artist) => (
            <Link
              key={artist.artistAddress}
              to={`/artist/${artist.artistAddress}`}
              className="relative group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black 
                              transition-all duration-300 
                              group-hover:scale-110 
                              group-hover:border-[#7C3AED]">
                {artist.pfpHash ? (
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${artist.pfpHash}`}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                    <User size={20} className="text-neutral-500" />
                  </div>)}
              </div>

              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-8 
                              opacity-0 group-hover:opacity-100 
                              transition-all duration-200 
                              bg-[#1f1f1f] text-white text-xs 
                              px-3 py-1 rounded-md shadow-lg 
                              whitespace-nowrap z-50 pointer-events-none">
                {artist.name || "Unnamed"}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};



const Profile = () => {
  const GRAPHQL_ENDPOINT = "https://api.studio.thegraph.com/query/1723072/cura-graph-5/version/latest";

  const { contract, address, isConnected, artist, fetchArtist } = useArtistContext();
  const { artworks, fetchArtworks, fetchArtists, artists, owners, auction, followersList, following, withdrawals, fetchWithdrawals } = useQueryContext();

  const loggedArtistAddress = artist?.artistAddress?.toLowerCase();

  const artistObject = artists?.find(
    (item) =>
      item?.artistAddress?.toLowerCase() === loggedArtistAddress
  );

  console.log(artistObject);
  console.log(artworks);

  const [withdrawalInfo, setWithdrawalInfo] = useState([]);

  const fetchWithdrawalInfo = async () => {
    try {

      const data = await request(GRAPHQL_ENDPOINT, GET_WITHDRAWAL_INFO,
        {
          user: loggedArtistAddress
        });
      setWithdrawalInfo(data.bidPlaceds);
    } catch (err) {
      console.log(err.message);
    }
  };


  useEffect(() => {
    fetchWithdrawalInfo();
  }, []);




  const [showCreateModal, setShowCreateModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [royaltyP, setRoyaltyP] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showWithdrawHistory, setShowWithdrawHistory] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [pendingWithdrawal, setPendingWithdrawal] = useState([]);

  const withdrawnAuctions = new Set(
    withdrawals.map((w) => w.auctionID.toString())
  );

  useEffect(() => {
    if (!withdrawalInfo?.length || !auction?.length) return;

    const grouped = {};

    withdrawalInfo.forEach((bidItem) => {
      const auctionObject = auction.find(
        (a) => a.auctionID.toString() === bidItem.auctionID.toString()
      );

      if (!auctionObject) return;

      // ✅ NEW: Skip if this auction is already withdrawn
      if (withdrawnAuctions.has(auctionObject.auctionID.toString())) return;

      const artworkObject = artworks?.find(
        (item) =>
          item?.artworkID?.toString() === auctionObject?.artID?.toString()
      );

      const isWinningBid =
        auctionObject.winningBid?.toString() === bidItem.bid.toString();

      if (auctionObject?.ended && !isWinningBid) {
        if (!grouped[auctionObject?.auctionID]) {
          grouped[auctionObject?.auctionID] = {
            auctionID: auctionObject?.auctionID,
            artworkObject: artworkObject,
            bids: [],
            totalAmount: 0n,
          };
        }

        grouped[auctionObject?.auctionID].bids.push(bidItem);
        grouped[auctionObject?.auctionID].totalAmount += BigInt(bidItem.bid);
      }
    });

    setPendingWithdrawal(Object.values(grouped));
  }, [withdrawalInfo, auction, withdrawals]); // ✅ also add withdrawals as dependency


  console.log("PENDING WITHDRAWALS:", pendingWithdrawal);


  const toggleDropdown = (auctionId) => {
    setOpenDropdown((prev) =>
      prev === auctionId ? null : auctionId
    );
  };






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
    try {
      if (!isConnected || !address || !contract) {
        return;
      }
      const royalty = Number(royaltyP);

      console.log(title, ipfsHash, description, royalty);

      const tx = await contract.createArtwork(
        title,
        ipfsHash,
        description,
        royalty,
      );

      await tx.wait();
      toast.success("Artwork created successfully");
      fetchArtworks();
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      const royalty = Number(royaltyP);

      if (!Number.isInteger(royalty) || royalty < 1 || royalty > 99) {
        toast.error("Royalty must be an integer between 1 and 99");
        return;
      }

      if (!title || !description || !image) {
        toast.error("Fill all fields correctly ");
        return;
      }
      setIsLoading(true);

      mutate();
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Something went wrong");
    }
  };

  //kachra *****************************************************



  const [collectionFilter, setCollectionFilter] = useState("your");

  const filteredArtworks = artworks.filter((art) => {
    const owner = owners[art.artworkID];

    if (!owner) return false; // wait until ownership loads

    if (collectionFilter === "your") {
      return (
        owner === loggedArtistAddress &&
        art.originalArtist?.toLowerCase() === loggedArtistAddress
      );
    }

    if (collectionFilter === "purchased") {
      return (
        owner === loggedArtistAddress &&
        art.originalArtist?.toLowerCase() !== loggedArtistAddress
      );
    }

    return true;
  });


  const INITIAL_NOTIFICATIONS = [
    {
      id: 1,
      text: "Your artwork 'Midnight Echo' was sold for 0.5 ETH!",
      time: "2m ago",
    },
    {
      id: 2,
      text: "New bid placed on 'Geometric Solitude' by @crypto_king.",
      time: "1h ago",
    },
    {
      id: 3,
      text: "Welcome to CURA! Complete your profile to get verified.",
      time: "1d ago",
    },
  ];



  const [showNotifs, setShowNotifs] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  // BASE PROFILE (saved state)
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [tagline, setTagline] = useState("");
  const [about, setAbout] = useState("");
  const [followers, setFollowers] = useState(0);
  const [profileImageHash, setProfileImageHash] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);


  // EDIT DRAFT STATES
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editTagline, setEditTagline] = useState("");
  const [editAbout, setEditAbout] = useState("");

  const isEdited =
    editName !== name ||
    editUsername !== username ||
    editTagline !== tagline ||
    editAbout !== about ||
    newProfileImage !== null;


  const [isEditing, setIsEditing] = useState(false);
  const profileImageRef = useRef(null);

  const handleWithdraw = async (auctionId) => {
    try {
      if (!isConnected || !address || !contract) return;
      const tx = await contract.withdrawRefund(auctionId);
      await tx.wait();
      setPendingWithdrawal(prev =>
        prev.filter(item => item.auctionID !== auctionId)
      );
      await fetchWithdrawalInfo();
      await fetchWithdrawals();
      toast.success("Withdrawal successful");

    } catch (err) {
      toast.error("Withdrawal failed");
      console.error(err);
    }
  };



  useEffect(() => {
    if (!artistObject) return;

    setName(artistObject.name || "");
    setUsername(artistObject.username || "");
    setTagline(artistObject.tagline || "Exploring digital creativity");
    setAbout(artistObject.bio || "Exploring and collecting digital experiences on CURA.");
    setFollowers(artistObject.followerCount || 0);

    setProfileImageHash(artistObject.pfpHash || "");
    setEditName(artistObject.name || "");
    setEditUsername(artistObject.username || "");
    setEditTagline(artistObject.tagline || "Exploring digital creativity");
    setEditAbout(artistObject.bio || "Exploring and collecting digital experiences on CURA.");
  }, [artistObject]);

  const handProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewProfileImage(file);
  }

  const handleEditDetails = async () => {
    if (!isConnected || !address || !contract) return;

    if (!isEdited) {
      toast("No changes made");
      return;
    }

    try {
      setIsLoading(true);

      let imageHashToUse = profileImageHash;

      // Upload only if new image selected
      if (newProfileImage) {
        const formData = new FormData();
        formData.append("image", newProfileImage);

        const res = await axiosInstance.post("/ipfs/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageHashToUse = res.data.data.imageHash;
      }
      console.log(editName,
        editUsername,
        imageHashToUse,
        editAbout,
        editTagline);

      const tx = await contract.editDetails(
        editName,
        editUsername,
        imageHashToUse,
        editAbout,
        editTagline
      );

      await tx.wait();

      // Update base state after success
      setName(editName);
      setUsername(editUsername);
      setTagline(editTagline);
      setAbout(editAbout);
      setProfileImageHash(imageHashToUse);

      setNewProfileImage(null);
      setIsEditing(false);

      toast.success("Profile updated successfully");
      await fetchArtist();
      await fetchArtists();
    } catch (error) {
      console.log("edit error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };



  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const renderNotificationText = (text) => {
    const parts = text.split(/'([^']+)'/);
    if (parts.length === 1) return text;
    return parts.map((part, index) => {
      const matchedArt = artworks.find((a) => a.title === part);
      if (matchedArt) {
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedArt(matchedArt);
              setShowNotifs(false);
            }}
            className="font-bold text-blue-400 cursor-pointer underline"
          >
            '{part}'
          </span>
        );
      }
      if (index % 2 !== 0) return `'${part}'`;
      return part;
    });
  };

  //console.log("FOLLOWING:", following);

  const followingSet = new Set(
    (following || [])
      .map(item => item.artist?.toLowerCase())
  );

  const followersSet = new Set(
    (followersList || [])
      .map(item => item.follower?.toLowerCase())
  );

  //console.log(followingSet);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* ============================================================ */}
      {/* CREATE ARTWORK MODAL */}
      {/* ============================================================ */}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#F3E5AB]">
                Create Artwork
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setDescription("");
                  setTitle("");
                  setRoyaltyP("");
                  setImage(null);
                  setImagePreview(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body (SCROLLS) */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-3">
                  Artwork Image
                </label>

                <div
                  onClick={() => imageRef.current?.click()}
                  className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-[#7C3AED]/50 transition-all cursor-pointer group"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        className="w-full h-48 object-cover rounded-xl"
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <Upload className="text-white" size={32} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto text-gray-600 mb-3" size={40} />
                      <p className="text-gray-400 text-sm">Click to upload image</p>
                    </div>
                  )}

                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter artwork title"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#7C3AED] transition-colors"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe your artwork"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#7C3AED] transition-colors min-h-[100px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Royalty */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Royalty Percentage
                </label>
                <input
                  type="number"
                  placeholder="1-99"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#7C3AED] transition-colors"
                  value={royaltyP}
                  onChange={(e) => setRoyaltyP(e.target.value)}
                />
              </div>
            </div>

            {/* Footer (ALWAYS VISIBLE) */}
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setDescription("");
                  setTitle("");
                  setRoyaltyP("");
                  setImage(null);
                  setImagePreview(null);
                }}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Artwork"
                )}
              </button>

            </div>
          </div>
        </div>
      )}



      {/* ============================================================ */}
      {/* HERO BANNER */}
      {/* ============================================================ */}
      <div
        className="relative h-80 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(https://wallpapers.com/images/hd/retrowave-mountain-cover-hpjdu2b1wxpcpwt3.jpg)` }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#F3E5AB] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7C3AED] rounded-full blur-3xl"></div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        {/* ============================================================ */}
        {/* PROFILE CARD */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
          {/* Avatar and Actions */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-40 h-40 rounded-3xl border-4 border-[#7C3AED] overflow-hidden bg-gradient-to-br from-[#7C3AED]/20 to-transparent shadow-2xl">
                {newProfileImage ? (
                  <img
                    src={URL.createObjectURL(newProfileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : profileImageHash ? (
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${profileImageHash}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                    <User size={60} className="text-neutral-600" />
                  </div>
                )}

                {isEditing && (
                  <div
                    className="absolute inset-0 bg-black/70 flex items-center justify-center cursor-pointer"
                    onClick={() => profileImageRef.current.click()}
                  >
                    <Camera size={32} className="text-[#F3E5AB]" />
                    <input
                      type="file"
                      ref={profileImageRef}
                      onChange={handProfileImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
              {/* Status Indicator */}
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-[#1a1a1a]"></div>
            </div>

            {/* Info and Actions */}
            <div className="flex-1 text-center lg:text-left">
              {isEditing ? (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                      Display Name
                    </label>
                    <input
                      className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl w-full text-xl font-bold focus:outline-none focus:border-[#7C3AED] transition-colors"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                      Username
                    </label>
                    <input
                      className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl w-full text-lg focus:outline-none focus:border-[#7C3AED] transition-colors"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                      Tagline
                    </label>
                    <input
                      className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl w-full focus:outline-none focus:border-[#7C3AED] transition-colors"
                      value={editTagline}
                      onChange={(e) => setEditTagline(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                      About
                    </label>
                    <textarea
                      className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl w-full min-h-[120px] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
                      value={editAbout}
                      onChange={(e) => setEditAbout(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-[#F3E5AB] text-5xl mt-1 mb-4 font-serif">
                    {name}
                  </h1>
                  <p className="text-lg text-gray-400 mb-4">
                    @{username} <span className="text-gray-600">•</span> {tagline}
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">
                    {about}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 backdrop-blur-sm">
                      <div className="text-3xl font-bold text-[#F3E5AB]">{followers}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                        Followers
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 backdrop-blur-sm">
                      <div className="text-3xl font-bold text-[#F3E5AB]">{followingSet.size}</div>
                      {/* ?????????? */}
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                        Following
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(name);
                        setEditUsername(username);
                        setEditTagline(tagline);
                        setEditAbout(about);
                        setNewProfileImage(null);
                      }}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all flex items-center gap-2"
                    >
                      <X size={18} /> Cancel
                    </button>
                    <button
                      onClick={handleEditDetails}
                      disabled={!isEdited || isLoading}
                      className="px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                    >
                      <Save size={18} />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Bell */}
                    <div className="relative">
                      <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        <Bell size={20} />
                        {notifications.length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                            {notifications.length}
                          </div>
                        )}
                      </button>

                      {showNotifs && (
                        <div className="absolute top-16 right-0 w-96 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                          <div className="p-4 border-b border-white/10">
                            <h3 className="font-bold text-lg">Notifications</h3>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {notifications.map((n) => (
                              <div
                                key={n.id}
                                className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                              >
                                <div className="flex justify-between items-start gap-3">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                      {renderNotificationText(n.text)}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-2">{n.time}</p>
                                  </div>
                                  <button
                                    onClick={() => deleteNotification(n.id)}
                                    className="text-gray-600 hover:text-white transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                      <Share size={20} />
                    </button>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
                    >
                      Edit Profile
                    </button>

                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] font-bold transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <Plus size={20} /> Create Artwork
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>




        <ArtistFollowingStrip
          artists={artists.filter((a) =>
            followingSet.has(a.artistAddress?.toLowerCase())
          )}
        />
        <ArtistFollowerStrip
          artists={artists.filter((a) =>
            followersSet.has(a.artistAddress?.toLowerCase())
          )}
        />


        {/* ============================================================ */}
        {/* WITHDRAWAL ROW – STATIC WITH DROPDOWN */}
        {/* ============================================================ */}
        <h4 className="text-2xl text-[#F3E5AB] mb-1 font-serif">
          Pending Withdrawals
        </h4>
        <section className="mb-10 space-y-6">
          {pendingWithdrawal.map((auction) => (
            <div
              key={auction.auctionID}
              className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 md:p-8"
            >
              {/* Top Row */}
              <div className="flex justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center text-[#7C3AED]">
                    <img
                      key={auction.artworkObject?.id}
                      src={`https://gateway.pinata.cloud/ipfs/${auction.artworkObject?.ipfsHash}`}
                      alt={auction.artworkObject?.artworkTitle}
                      className="max-w-full max-h-[500px] object-contain pointer-events-none"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">
                      {auction.artworkObject?.artworkTitle}
                    </p>

                    <p className="text-3xl font-serif font-bold text-[#F3E5AB]">
                      {ethers.formatEther(auction.totalAmount)} ETH
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Withdraw Button */}
                  <button
                    onClick={() => handleWithdraw(auction.auctionID)}
                    disabled={isLoading}
                    className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        Withdrawing...
                      </span>
                    ) : (
                      "Withdraw"
                    )}
                  </button>


                  {/* Dropdown Toggle */}
                  <button
                    onClick={() => toggleDropdown(auction.auctionId)}
                    className="p-1 px-2 rounded-xl  hover:bg-white/10  transition-all"
                  >
                    {openDropdown === auction.auctionId ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
              </div>

              {/* Dropdown Content */}
              {openDropdown === auction.auctionId && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2">
                  {auction.bids.map((bid, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-zinc-300">
                        Bid #{index + 1}
                      </span>
                      <span className="text-[#7C3AED] font-mono font-bold">
                        +{ethers.formatEther(bid.bid)} ETH
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>



        {/* ============================================================ */}
        {/* YOUR COLLECTION */}
        {/* ============================================================ */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#F3E5AB] text-4xl mt-5 mb-2 font-serif">Your Collection</h2>            <span className="px-4 py-2 rounded-full bg-white/5 text-gray-400 font-semibold text-sm">
              {filteredArtworks.length} {filteredArtworks.length === 1 ? "Artwork" : "Artworks"}
            </span>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            {[
              { label: "Your Art", value: "your" },
              { label: "Purchased", value: "purchased" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setCollectionFilter(item.value)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${collectionFilter === item.value
                  ? "bg-[#7C3AED] text-[#F3E5AB]"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filteredArtworks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredArtworks.map((art) => (
                <Link
                  to={`/art/${art.artworkID}`}
                  key={art.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#7C3AED]/50 transition-all"
                >
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${art.ipfsHash}`}
                    alt={art.artworkTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white text-sm mb-1">
                        {art.artworkTitle}
                      </h3>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-[#F3E5AB]" />
                        <span className="text-xs text-[#F3E5AB]">View Details</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-gray-400 text-lg">Nothing here yet.</p>
              <p className="text-gray-600 text-sm mt-2">Start creating or collecting artworks!</p>
            </div>
          )}
        </div>

      </main>

      {/* ============================================================ */}
      {/* ARTWORK DETAIL MODAL */}
      {/* ============================================================ */}
      {selectedArt && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedArt(null)}
        >
          <button
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
            onClick={() => setSelectedArt(null)}
          >
            <X size={24} />
          </button>

          <div
            className="max-w-5xl w-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Image */}
              <div className="lg:w-2/3 bg-black flex items-center justify-center p-8">
                <img
                  src={selectedArt.src}
                  alt={selectedArt.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl"
                />
              </div>

              {/* Details */}
              <div className="lg:w-1/3 p-8 flex flex-col">
                <h2 className="text-3xl font-bold mb-4">{selectedArt.title}</h2>
                <p className="text-gray-400 mb-6">
                  {selectedArt.price ? `${selectedArt.price} ETH` : "Uploaded just now"}
                </p>

                <div className="flex gap-4 mt-auto">
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <Heart size={20} />
                    <span>{selectedArt.likes || 0}</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <Share size={20} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>


  );
};

export default Profile;