import { useState } from "react";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import { MoveUp } from "lucide-react"
import { MoveDown } from "lucide-react"
import ArtGrid from "../components/ArtGrid";
import sampleArtData from "../constants/SampleArtData";


const Explore = () => {
  const [saleType, setSaleType] = useState(null); 
  const [genre, setGenre] = useState("all");
  const [sortBy, setSortBy] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");
  const SALE_TYPES = ["auction", "direct"];


  const filteredArtData = sampleArtData.filter((art) => {
    if (saleType && art.saleType !== saleType) {
      return false;
    }

    if (genre !== "all" && art.genre !== genre) {
      return false;
    }

    if (art.saleType != "auction" && art.status === "sold") {
      return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        art.title?.toLowerCase().includes(query) ||
        art.artist?.toLowerCase().includes(query) ||
        art.genre?.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }
    }
    return true;
  });

  const sortedFilteredArtData = [...filteredArtData].sort((a, b) => {
    if (sortBy === "new") {
      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    }

    if (sortBy === "low") {
      return a.price - b.price;
    }

    if (sortBy === "high") {
      return b.price - a.price;
    }

    return 0;
  });


  return (

    <div className="min-h-screen px-10 py-6 text-white">
      <h1 className="text-3xl text-neutral-300 mt-1 mb-4 font-serif">
        Discover Exceptional Art & Artists
      </h1>

      {/*SearchBar*/}
      <div className="mt-8">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" 
              w-full
              bg-black
              border border-neutral-800
              rounded-sm
              py-4 pl-12 pr-6
              text-white
              placeholder-gray-500
              focus:outline-none
              focus:border-white
              transition
            "
          />
        </div>
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
                ${
                  saleType === type
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

        {/* Genre Dropdown */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="
            bg-black border border-neutral-800
            px-4 py-2 rounded-md text-sm
            text-gray-300 focus:outline-none
          "
        >
          <option value="all">All Genres</option>
          <option value="illustration">Illustration</option>
          <option value="character">Character Art</option>
          <option value="concept">Concept Art</option>
          <option value="abstract">Abstract</option>
          <option value="fantasy">Fantasy/Sci-Fi</option>
          <option value="modern">Minimal/Modern</option>
        </select>

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
