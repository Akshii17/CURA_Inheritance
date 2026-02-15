import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useArtistContext } from "../context/ArtistContext";
import { useQueryContext } from "../context/QueryContext";
import { axiosInstance } from "../lib/axiosInstance";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { request, gql } from "graphql-request";
import { GET_WITHDRAWAL_INFO } from "../lib/GraphqlQueries";
import { User, Share, X, Save, Camera, Heart, MessageCircle, Plus, Upload, Bell, MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import { ethers } from "ethers";

const Profile = () => {
  const GRAPHQL_ENDPOINT = "https://api.studio.thegraph.com/query/1723072/cura-graph-4/version/latest";

  const { contract, address, isConnected, artist, fetchArtist } = useArtistContext();
  const { artworks, fetchArtworks, artists, owners,auction } = useQueryContext();

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

  console.log("PENDING WITHDRAWALS:", withdrawalInfo);

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
    setEditTagline(artistObject.tagline || "");
    setEditAbout(artistObject.bio || "");
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

  // ============================================================
  // PENDING WITHDRAWALS LOGIC
  // ============================================================
  
  // STEP 1: Group withdrawals by auctionID and merge bids
  const groupedWithdrawals = withdrawalInfo.reduce((acc, withdrawal) => {
    const auctionID = withdrawal.auctionID;
    
    if (!acc[auctionID]) {
      acc[auctionID] = {
        auctionID,
        bids: [],
        totalBids: 0
      };
    }
    
    acc[auctionID].bids.push(withdrawal.bid);
    acc[auctionID].totalBids += 1;
    
    return acc;
  }, {});

  // STEP 2 & 3: Filter valid withdrawable auctions and get artwork data
  const withdrawableAuctions = Object.values(groupedWithdrawals)
    .map((grouped) => {
      // Find auction
      const auctionData = auction?.find(
        (a) => a.auctionID === grouped.auctionID
      );

      if (!auctionData) return null;
      
      // Check if auction ended
      if (!auctionData.ended) return null;
      
      // Check if user is winner
      if (auctionData.winner?.toLowerCase() === loggedArtistAddress) return null;

      // Find artwork
      const artworkData = artworks.find(
        (art) => art.artworkID === auctionData.artID
      );

      if (!artworkData) return null;

      // Calculate total amount
      const totalAmount = grouped.bids.reduce((sum, bid) => {
        return sum + parseFloat(ethers.formatEther(bid));
      }, 0);

      return {
        ...grouped,
        auction: auctionData,
        artwork: artworkData,
        totalAmount
      };
    })
    .filter(Boolean);

  // STEP 5: Withdraw handler
  const [withdrawingAuction, setWithdrawingAuction] = useState(null);

  const handleWithdraw = async (auctionID) => {
    if (!isConnected || !address || !contract) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setWithdrawingAuction(auctionID);
      
      const tx = await contract.withdraw(auctionID);
      await tx.wait();
      
      toast.success("Withdrawal successful!");
      
      // Refresh withdrawal data
      await fetchWithdrawalInfo();
      
    } catch (error) {
      console.log("Withdraw error:", error);
      toast.error("Withdrawal failed. Please try again.");
    } finally {
      setWithdrawingAuction(null);
    }
  };


  return (
    <div className="mb-5">
      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Artwork</h2>

            {/* IMAGE */}
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {imagePreview && (
              <img src={imagePreview} className="mt-3 rounded-xl h-50 w-50" />
            )}

            {/* TITLE */}
            <input
              type="text"
              placeholder="Title"
              className="w-full mt-4 p-3 rounded-lg border"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* DESCRIPTION */}
            <textarea
              placeholder="Description"
              className="w-full mt-3 p-3 rounded-lg border"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* ROYALTY */}
            <input
              type="number"
              placeholder="Royalty (1–99)"
              className="w-full mt-3 p-3 rounded-lg border"
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
                disabled={isLoading}
                className="flex-1 p-3 rounded-xl  text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 p-3 rounded-xl bg-[#7c3aed] hover:bg-[#5f2db7] text-[#F3E5AB] font-bold disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-45 md:h-70 w-full bg-[#111] rounded-b-3xl -mb-15 md:-mb-20" />
      <main className="max-w-250 mx-auto px-5">
        {/*prof card*/}
        <div className="px-5 relative">
          {/* avatar and action rows*/}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 gap-5 md:gap-0">
            <div className="relative">
              <div className="w-30 h-30 md:w-40 md:h-40 rounded-full border-4 md:border-6 border-[#050505] overflow-hidden bg-[#1a1a1a] relative">
                <img
                  src={
                    newProfileImage
                      ? URL.createObjectURL(newProfileImage)
                      : profileImageHash
                        ? `https://gateway.pinata.cloud/ipfs/${profileImageHash}`
                        : ""
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                {isEditing && (
                  <div
                    className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                    onClick={() => profileImageRef.current.click()}
                  >
                    <Camera size={24} color="#fff" />
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
            </div>

            {/*action buttons*/}
            <div className="flex gap-3 pb-2.5 w-full md:w-auto justify-center flex-wrap">
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

                    className="bg-white/5 text-white border border-white/10 px-5 py-2.5 rounded-full font-semibold text-sm cursor-pointer flex items-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={handleEditDetails}
                    disabled={!isEdited || isLoading}
                    className="bg-white text-black border-none px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer flex items-center gap-2"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}

                  </button>
                </>
              ) : (
                <>
                  {/*bell*/}
                  <div className="relative">
                    <button
                      className="bg-transparent border-none text-white cursor-pointer p-2.5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                      onClick={() => setShowNotifs(!showNotifs)}
                    >
                      <Bell size={20} />
                      {notifications.length > 0 && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]" />
                      )}
                    </button>
                    {showNotifs && (
                      /* Notifications Dropdown */
                      <div className="absolute top-12.5 right-0 md:right-0 left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 w-70 md:w-85 bg-[#1a1a1a] border border-[#333] rounded-2xl z-50 shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-[#222] text-sm font-bold">
                          Notifications
                        </div>
                        <div className="max-h-75 overflow-y-auto">
                          {notifications.map((n) => (
                            <div
                              key={n.id}
                              className="p-4 border-b border-[#222] flex gap-3 items-start"
                            >
                              <div className="flex-1">
                                <div className="text-[13px] text-[#ccc] leading-snug">
                                  {/*func to parse text, click logic */}
                                  {renderNotificationText(n.text)}
                                </div>
                                <div className="text-[11px] text-[#666] mt-1">
                                  {n.time}
                                </div>
                              </div>
                              <X
                                size={14}
                                className="cursor-pointer text-[#666]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(n.id);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="bg-transparent border-none text-white cursor-pointer p-2.5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Share size={20} />
                  </button>
                  <button
                    className="bg-white/5 text-white border border-white/10 px-5 py-2.5 rounded-full font-semibold text-sm cursor-pointer flex items-center gap-2 hover:bg-white/10 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="bg-white text-black border-none px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus size={18} /> Create
                  </button>
                </>
              )}
            </div>
          </div>

          {/*prof info*/}
          <div className="max-w-150 mt-2.5 text-center md:text-left w-full">
            {isEditing ? (
              <>
                <label className="block text-xs text-[#888] mb-1.5 font-semibold">
                  Display Name
                </label>
                <input
                  className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full mb-3 text-xl font-bold focus:outline-none"
                  name="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}

                />

                <label className="block text-xs text-[#888] mb-1.5 font-semibold">
                  Username
                </label>
                <input
                  className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full mb-3 text-xl font-bold focus:outline-none"
                  name="username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />

                <label className="block text-xs text-[#888] mb-1.5 font-semibold">
                  Tagline
                </label>
                <input
                  className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full mb-3 text-sm focus:outline-none"
                  name="tagline"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                />

                <label className="block text-xs text-[#888] mb-1.5 font-semibold">
                  About
                </label>
                <textarea
                  className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full min-h-25 mb-3 text-sm font-sans focus:outline-none"
                  name="about"
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold font-serif m-0 mb-1 tracking-tight">
                  {name}
                </h1>
                <div className="text-base text-[#8a8a8a] mb-4 font-medium">
                  {username} • {tagline}
                </div>
                <div className="text-[15px] leading-relaxed text-[#e0e0e0] mb-5">
                  {about}
                </div>

                {/*folower stats*/}
                <div className="inline-flex gap-6 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 mt-5">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">
                      {followers}
                    </span>
                    <span className="text-[11px] text-[#888] uppercase tracking-wider mt-0.5">
                      Followers
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* PENDING WITHDRAWALS SECTION */}
        {withdrawableAuctions.length > 0 && (
          <section className="mt-16">
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold">Pending Withdrawals</h2>
              <span className="text-sm text-gray-400">
                {withdrawableAuctions.length} {withdrawableAuctions.length === 1 ? "auction" : "auctions"}
              </span>
            </div>

            {/* withdrawal cards */}
            <div className="space-y-4">
              {withdrawableAuctions.map((item) => (
                <div
                  key={item.auctionID}
                  className="bg-[#111] border border-white/5 rounded-2xl p-5 flex gap-5 hover:border-[#7C3AED]/40 transition-all duration-300"
                >
                  {/* Left: Artwork Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${item.artwork.ipfsHash}`}
                      alt={item.artwork.artworkTitle}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  </div>

                  {/* Middle: Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-2">
                      {item.artwork.artworkTitle}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      You placed {item.totalBids} {item.totalBids === 1 ? "bid" : "bids"}
                    </p>
                    
                    {/* Bid amounts */}
                    <div className="space-y-1">
                      {item.bids.map((bid, idx) => (
                        <div key={idx} className="text-xs text-gray-500">
                          Bid {idx + 1}: {ethers.formatEther(bid)} ETH
                        </div>
                      ))}
                    </div>

                    {/* Total amount */}
                    <div className="mt-3 text-sm font-semibold text-[#F3E5AB]">
                      Total: {item.totalAmount.toFixed(4)} ETH
                    </div>
                  </div>

                  {/* Right: Withdraw Button */}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleWithdraw(item.auctionID)}
                      disabled={withdrawingAuction === item.auctionID}
                      className="bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB] px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {withdrawingAuction === item.auctionID ? "Withdrawing..." : "Withdraw"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* YOUR COLLECTION */}
        <section className="mt-16">
          {/* header row */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold">Your Collection</h2>
            <span className="text-sm text-gray-400">
              {filteredArtworks.length} {" "}
              {filteredArtworks.length === 1 ? "artwork" : "artworks"}
            </span>
          </div>

          {/* filters */}
          <div className="flex gap-2 mt-4">
            {[
              { label: "Your Art", value: "your" },
              { label: "Purchased", value: "purchased" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setCollectionFilter(item.value)}
                className={` px-4 py-1.5 rounded-md text-sm font-semibold border transition-all
          ${collectionFilter === item.value
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-gray-400 border-white/10 hover:text-white hover:border-white/30"
                  }
        `}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* grid */}
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {filteredArtworks.map((art) => (
              <Link to={`/art/${art.artworkID}`}
                key={art.id}
                className="
          relative
          aspect-square
          overflow-hidden
          rounded-md
          bg-neutral-900
          cursor-pointer
          group
        "
              >
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${art.ipfsHash}`}
                  alt={art.artworkTitle}
                  className="
                w-full h-full
                object-cover
                transition-transform duration-300
                group-hover:scale-105
                "
                />

                {/* hover overlay (optional but looks great) */}
                <div
                  className="
            absolute inset-0
            bg-black/40
            opacity-0
            group-hover:opacity-100
            transition-opacity
            flex items-center justify-center
          "
                >
                  <span className="text-xs font-semibold text-white">View</span>
                </div>
              </Link>
            ))}
          </div>

          {/* empty state */}
          {filteredArtworks.length === 0 && (
            <div className="text-gray-500 text-sm mt-10 text-center">
              Nothing here yet.
            </div>
          )}
        </section>

      </main>
      {/*notif image popup*/}
      {selectedArt && (
        <div
          className="fixed inset-0 bg-black/85 z-2000 flex items-center justify-center p-10"
          onClick={() => setSelectedArt(null)}
        >
          <button className="absolute top-5 right-5 bg-transparent border-none text-white cursor-pointer z-2100">
            <X size={32} />
          </button>
          <div
            className="flex flex-col max-h-[90vh] max-w-250 w-full bg-black rounded-lg overflow-hidden relative border border-[#333]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black flex justify-center items-center flex-1 min-h-75">
              <img
                src={selectedArt.src}
                alt={selectedArt.title}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
            <div className="p-5 border-t border-[#222] flex justify-between items-center bg-[#111]">
              <div>
                <h3 className="m-0 mb-1 text-lg text-white">
                  {selectedArt.title}
                </h3>
                <span className="text-xs text-[#999]">
                  {selectedArt.price
                    ? `${selectedArt.price} ETH`
                    : "Uploaded just now"}
                </span>
              </div>
              <div className="flex gap-5">
                <div className="flex gap-2 cursor-pointer items-center">
                  <Heart size={24} color="white" />
                  <span className="font-bold">{selectedArt.likes}</span>
                </div>
                <Share size={24} className="cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;