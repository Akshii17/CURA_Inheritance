import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import { MoveUp } from "lucide-react"
import { MoveDown, User } from "lucide-react"
import ArtGrid from "../components/ArtGrid";
import { useQueryContext } from "../context/QueryContext";
import { useArtistContext } from "../context/ArtistContext";
import { Link } from "react-router-dom";


const Explore = () => {

  const { artworks, fetchArtworks, owners, artists, mergeArtworks } = useQueryContext();
  const { artist, fetchArtist, contract } = useArtistContext();

  const [saleType, setSaleType] = useState(null);
  const [genre, setGenre] = useState("all");
  const [sortBy, setSortBy] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");
  const SALE_TYPES = ["auction", "direct"];
  const [isOwnerLoading, setIsOwnerLoading] = useState(false);
  

  let loggedArtistAddress = artist?.artistAddress?.toLowerCase();


  const filteredArtData = artworks?.filter((art) => {
  // 1. Ownership Check (Safe handling for missing data)
  const artOwner = owners?.[art.artworkID]?.toLowerCase();
  if (loggedArtistAddress && loggedArtistAddress === artOwner) return false;

  // 2. Status/Sale Checks
  if (!art.saleType) return false;
  if (saleType && art.saleType !== saleType) return false;
  // Note: Ensure your query also returns 'status' if you use this check
  if (art.saleType !== "auction" && art.status === "sold") return false;

  // 3. Search Logic (Corrected Field Names)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();

    // MATCHING AGAINST GRAPHQL KEYS:
    // artworkTitle instead of title
    // originalArtist instead of artist
    const matchesTitle = art.artworkTitle?.toLowerCase().includes(query);
    const matchesArtist = art.originalArtist?.toLowerCase().includes(query);
    
    // Check if the artist's name (from the artists context) matches the search
    const artistFromContext = artists?.find(
      (a) => a.artistAddress?.toLowerCase() === art.originalArtist?.toLowerCase()
    );
    const matchesArtistName = artistFromContext?.name?.toLowerCase().includes(query);

    // If it doesn't match any of these, exclude it
    if (!matchesTitle && !matchesArtist && !matchesArtistName) return false;
  }

  return true;
}) || [];


  // Logic for filtering artists for the Instagram-style panel
  const filteredArtists = searchQuery.trim() 
    ? artists?.filter(a => 
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.artistAddress?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Limit to top 5 results
    : [];


  // const filteredArtData = newArtworks?.filter((art) => {
  //   if (saleType && art.saleType !== saleType) {
  //     return false;
  //   }

  //   if (art.saleType != "auction" && art.status === "sold") {
  //     return false;
  //   }

  //   if (searchQuery.trim()) {
  //     const query = searchQuery.toLowerCase();

  //     const matchesSearch =
  //       art.title?.toLowerCase().includes(query) ||
  //       art.artist?.toLowerCase().includes(query) ||
  //       art.genre?.toLowerCase().includes(query);

  //     if (!matchesSearch) {
  //       return false;
  //     }
  //   }
  //   return true;
  // });

  // Helper to get timestamp safely
const getTimestamp = (art) => {
  // if you store blockTimestamp in context for artworks use that
  return Number(art.blockTimestamp || 0);
};

// Helper to get price safely
const getPrice = (art) => {
  if (art.saleType === "direct") {
    return Number(art.price || 0);
  }

  if (art.saleType === "auction") {
    // Use winningBid if exists, else basePrice
    return Number(art.winningBid || art.basePrice || 0);
  }

  return 0;
};


  const sortedFilteredArtData = [...filteredArtData].sort((a, b) => {

  if (sortBy === "new") {
    return Number(b.blockTimestamp) - Number(a.blockTimestamp);
  }

  if (sortBy === "low") {
    return Number(a.price) - Number(b.price);
  }

  if (sortBy === "high") {
    return Number(b.price) - Number(a.price);
  }

  if (sortBy === "ending") {
    return Number(a.endTime || 0) - Number(b.endTime || 0);
  }

  return 0;
});








  return (

    <div className="min-h-screen px-10 py-6 text-white">
      <h1 className="text-[#F3E5AB] text-5xl mt-1 mb-4 font-serif">
        Discover Exceptional Art & Artists
      </h1>


      {/* SearchBar with Artist Results Panel */}
      <div className="mt-8 relative">
        <div className="relative z-20">
          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search for art or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" 
              w-full
              bg-black
              border border-neutral-800
              rounded-sm
              py-4 pl-12 pr-12
              text-white
              placeholder-gray-500
              focus:outline-none
              focus:border-white
              transition
            "
          />
          
          {searchQuery && (
            <X 
              size={18} 
              onClick={() => setSearchQuery("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-white"
            />
          )}
        </div>

        {/* --- INSTAGRAM STYLE ARTIST PANEL --- */}
        {searchQuery.trim() && filteredArtists.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#0A0A0A] border border-neutral-800 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-xl bg-opacity-95">
            <div className="p-3 border-b border-neutral-900">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Artists Found</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredArtists.map((item, idx) => (
                <Link 
                  key={idx} 
                  to={`/artist/${item.artistAddress}`} 
                  onClick={() => setSearchQuery("")} // Close on click
                  className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800 flex-shrink-0">
                    {item.pfpHash ? (
                      <img src={`https://gateway.pinata.cloud/ipfs/${item.pfpHash}`} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-[#F3E5AB] transition-colors">
                      {item.name || "Anonymous Artist"}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono italic">
                      {item.artistAddress.slice(0, 6)}...{item.artistAddress.slice(-4)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/*Filters*/}
      <div className="mt-6 flex flex-wrap items-center gap-4">

        {/* Sale Type Pills */}
        <div className="flex gap-2">
          {SALE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSaleType(saleType === type ? null : type)}
              className={`
                flex items-center gap-2
                px-4 py-2 rounded-full text-sm capitalize
                border transition cursor-pointer
                ${saleType === type
                  ? "border-white text-white"
                  : "border-neutral-800 text-gray-500 hover:border-neutral-600"
                }
              `}
            >
              {type}

              {saleType === type && (
                <X
                  size={14}
                  className="opacity-70 hover:opacity-100"
                />
              )}
            </button>
          ))}
        </div>

        

        {/* Sort By Dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-gray-400">Sort by:</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="
              bg-black border border-neutral-800
              px-4 py-2 rounded-md text-sm
              text-gray-300 focus:outline-none
              "
          >
            <option value="new">New Arrivals</option>
            <option value="low">Price ↑ </option>
            <option value="high">Price ↓ </option>

            {saleType === "auction" && (
              <option value="ending">Ending Soon</option>
            )}
          </select>
        </div>
      </div>

      <ArtGrid
        artworks={sortedFilteredArtData} page="explore"
      />
    </div>
  );
};

export default Explore;
