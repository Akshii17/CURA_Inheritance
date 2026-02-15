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

const Profile = () => {
  const GRAPHQL_ENDPOINT = "https://api.studio.thegraph.com/query/1723072/cura-graph-4/version/latest";

  const { contract, address, isConnected, artist, fetchArtist } = useArtistContext();
  const { artworks, fetchArtworks, artists, owners } = useQueryContext();

  const loggedArtistAddress = artist?.artistAddress?.toLowerCase();

  const artistObject = artists?.find(
    (item) =>
      item?.artistAddress?.toLowerCase() === loggedArtistAddress
  );
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

  // console.log("PENDING WITHDRAWALS:", withdrawalInfo);


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


  const INITIAL_USER = {
    name: artistObject.name,
    username: artistObject.username,
    tagline: "Digital Artist & Curator", //
    followers: artistObject.followerCount,
    about: artistObject.bio,
    location: "Mumbai, India", //
    website: "cura.art/shreyy", //
    joined: "Joined Jan 2026", //
    profileImage: null,
    coverImage:
      "https://wallpapers.com/images/hd/retrowave-mountain-cover-hpjdu2b1wxpcpwt3.jpg", //
  };


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


  const profileFileRef = useRef(null);
  const coverFileRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);

  const [profileData, setProfileData] = useState(INITIAL_USER);
  const [editFormData, setEditFormData] = useState(INITIAL_USER);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);



  const handleProfileChange = (e) =>
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  const handleProfileImageChange = (e) => {
    if (e.target.files[0])
      setEditFormData({
        ...editFormData,
        profileImage: URL.createObjectURL(e.target.files[0]),
      });
  };
  const handleCoverImageChange = (e) => {
    if (e.target.files[0])
      setEditFormData({
        ...editFormData,
        coverImage: URL.createObjectURL(e.target.files[0]),
      });
  };

  
  const handleEditDetails = async () => {
    try {
      setIsLoading(true);

      if (!isConnected || !address || !contract) return;

      const { name, username, about, tagline } = editFormData;

      const tx = await contract.editDetails(
        name,
        username,
        "",          // newPfpHash (replace later if needed)
        about,
        tagline
      );

      await tx.wait();

      toast.success("Details Edited Successfully");

      // Update profileData with new values
      setProfileData(editFormData);

      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      console.log("error editing details", error);
      toast.error("Something went wrong, Please try again later");
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

  const displayData = isEditing ? editFormData : profileData;

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

      <div className="h-45 md:h-70 w-full relative overflow-hidden rounded-b-3xl -mb-15 md:-mb-20">
        <img
          src={displayData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] to-transparent" />
        {isEditing && (
          <button
            className="absolute top-5 right-5 bg-black/60 text-white border border-white/20 rounded-2xl px-4 py-2 text-xs cursor-pointer backdrop-blur-sm flex items-center gap-1.5"
            onClick={() => coverFileRef.current.click()}
          >
            <Camera size={14} /> Edit Cover
            <input
              type="file"
              ref={coverFileRef}
              onChange={handleCoverImageChange}
              className="hidden"
              accept="image/*"
            />
          </button>
        )}
      </div>
      <main className="max-w-250 mx-auto px-5">
        {/*prof card*/}
        <div className="px-5 relative">
          {/* avatar and action rows*/}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 gap-5 md:gap-0">
            <div className="relative">
              <div className="w-30 h-30 md:w-40 md:h-40 rounded-full border-4 md:border-6 border-[#050505] overflow-hidden bg-[#1a1a1a] relative">
                {displayData.profileImage ? (
                  <img
                    src={displayData.profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#222] flex items-center justify-center">
                    <User size={60} color="#555" />
                  </div>
                )}
                {isEditing && (
                  <div
                    className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                    onClick={() => profileFileRef.current.click()}
                  >
                    <Camera size={24} color="#fff" />
                    <input
                      type="file"
                      ref={profileFileRef}

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
                    onClick={() => setIsEditing(false)}
                    className="bg-white/5 text-white border border-white/10 px-5 py-2.5 rounded-full font-semibold text-sm cursor-pointer flex items-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={handleEditDetails}
                    className="bg-white text-black border-none px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer flex items-center gap-2"
                  >
                    <Save size={16} /> Save Changes
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
                  value={displayData.name}
                  onChange={handleProfileChange}
                />

                <label className="block text-xs text-[#888] mb-1.5 font-semibold">
                  Username
                </label>
                <input
                  className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full mb-3 text-xl font-bold focus:outline-none"
                  name="username"
                  value={displayData.username}
                  onChange={handleProfileChange}
                />

                <label className="block text-xs text-[#888] mb-1.5 font-semibold">
                  Tagline
                </label>
                <input
                  className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full mb-3 text-sm focus:outline-none"
                  name="tagline"
                  value={displayData.tagline}
                  onChange={handleProfileChange}
                />

                <label className="block text-xs text-[#888] mb-1.5 font-semibold">
                  About
                </label>
                <textarea
                  className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full min-h-25 mb-3 text-sm font-sans focus:outline-none"
                  name="about"
                  value={displayData.about}
                  onChange={handleProfileChange}
                />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold font-serif m-0 mb-1 tracking-tight">
                  {displayData.name}
                </h1>
                <div className="text-base text-[#8a8a8a] mb-4 font-medium">
                  {displayData.username} • {displayData.tagline}
                </div>

                <div className="flex justify-center md:justify-start gap-6 flex-wrap text-[#666] text-[13px] mb-6">
                  {displayData.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} /> {displayData.location}
                    </div>
                  )}
                  {displayData.website && (
                    <div className="flex items-center gap-1.5">
                      <LinkIcon size={14} />{" "}
                      <a
                        href={`https://${displayData.website}`}
                        className="text-inherit no-underline hover:text-white"
                      >
                        {displayData.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} /> {displayData.joined}
                  </div>
                </div>

                <div className="text-[15px] leading-relaxed text-[#e0e0e0] mb-5">
                  {displayData.about}
                </div>

                {/*folower stats*/}
                <div className="inline-flex gap-6 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 mt-5">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">
                      {displayData.followers}
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
