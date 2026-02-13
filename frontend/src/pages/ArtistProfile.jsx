import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import { useArtistContext } from "../context/ArtistContext";
import toast from 'react-hot-toast';
import { ethers } from "ethers";
import { useQueryContext } from '../context/QueryContext';


const ArtistProfile = () => {
    const { contract, address, isConnected } = useArtistContext();
    const { artists, artworks } = useQueryContext();
    const { id } = useParams();

    const artistData = artists.find(
        (artist) => artist?.artistAddress?.toLowerCase() === id.toLowerCase()
    );


    if (!artistData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Artist not found
            </div>
        );
    }


    const handleFollow = async () => {
        let checksumAddress;

        try {
            checksumAddress = ethers.getAddress(artistData.artistAddress);
            console.log(checksumAddress);
        } catch (error) {
            console.error("Invalid address");
            toast.error("Something went wrong, Please try again later")
        }
        try {
            if (!isConnected || !address || !contract) {
                return;
            }

            console.log("following");

            const follow = await contract.FollowUnfollow(checksumAddress);

            await follow.wait();
            toast.success("Following!");

        } catch (error) {
            console.log("error in following", error);
            toast.error("Something went wrong, Please try again later");
        }
    };

    const INITIAL_USER = {
        name: artistData.name,
        username: artistData.username,
        tagline: "Digital Artist & Curator", //
        followers: artistData.followerCount,
        about: artistData.bio,
        location: "Mumbai, India", //
        website: "cura.art/shreyy", //
        joined: "Joined Jan 2026", //
        profileImage: null,
        coverImage:
            "https://wallpapers.com/images/hd/retrowave-mountain-cover-hpjdu2b1wxpcpwt3.jpg", //
    };

    const filteredArtworks = artworks.filter((art) => {

        return (
            art.originalArtist?.toLowerCase() === artistData?.artistAddress?.toLowerCase()
        );
    });


    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-24">
            {/* Keeping font import only */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap'); 
        :root { --font-serif: 'Playfair Display', serif; --font-sans: 'Manrope', sans-serif; } 
        body { font-family: var(--font-sans); }
      `}</style>





            {/*cover*/}
            <div className="h-[180px] md:h-[280px] w-full relative overflow-hidden rounded-b-3xl -mb-[60px] md:-mb-[80px]">
                <img src={INITIAL_USER.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />

            </div>

            <main className="max-w-[1000px] mx-auto px-5">
                {/*prof card*/}
                <div className="px-5 relative">

                    {/* avatar and action rows*/}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 gap-5 md:gap-0">
                        <div className="relative">
                            <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full border-4 md:border-6 border-[#050505] overflow-hidden bg-[#1a1a1a] relative">
                                {INITIAL_USER.profileImage ? (
                                    <img src={INITIAL_USER.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-[#222] flex items-center justify-center">
                                        <User size={60} color="#555" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/*action buttons*/}
                        <div className="flex gap-3 pb-2.5 w-full md:w-auto justify-center flex-wrap">

                            <button
                                className=" text-white border border-white px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform"
                                onClick={handleFollow}
                            >
                                Follow
                            </button>

                        </div>
                    </div>

                    {/*prof info*/}
                    <div className="max-w-[600px] mt-2.5 text-center md:text-left w-full">
                        {
                            <>
                                <h1 className="text-3xl font-bold font-serif m-0 mb-1 tracking-tight">{INITIAL_USER.name}</h1>
                                <div className="text-base text-[#8a8a8a] mb-4 font-medium">{INITIAL_USER.username} • {INITIAL_USER.tagline}</div>

                                <div className="flex justify-center md:justify-start gap-6 flex-wrap text-[#666] text-[13px] mb-6">
                                    {INITIAL_USER.location && <div className="flex items-center gap-1.5"><MapPin size={14} /> {INITIAL_USER.location}</div>}
                                    {INITIAL_USER.website && <div className="flex items-center gap-1.5"><LinkIcon size={14} /> <a href={`https://${INITIAL_USER.website}`} className="text-inherit no-underline hover:text-white">{INITIAL_USER.website}</a></div>}
                                    <div className="flex items-center gap-1.5"><Calendar size={14} /> {INITIAL_USER.joined}</div>
                                </div>

                                <div className="text-[15px] leading-relaxed text-[#e0e0e0] mb-5">{INITIAL_USER.about}</div>

                                {/*folower stats*/}
                                <div className="inline-flex gap-6 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 mt-5">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-white">{INITIAL_USER.followers}</span>
                                        <span className="text-[11px] text-[#888] uppercase tracking-wider mt-0.5">Followers</span>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>

                {/* YOUR COLLECTION */}
                <section className="mt-16">
                    {/* header row */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-serif font-bold">{artistData.name}'s Creations</h2>
                        <span className="text-sm text-gray-400">
                            {filteredArtworks.length} {" "}
                            {filteredArtworks.length === 1 ? "artwork" : "artworks"}
                        </span>
                    </div>



                    {/* grid */}
                    <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {filteredArtworks.map((art) => (
                            <div
                                key={art.id}
                                className="
          relative
          aspect-square
          overflow-hidden
          rounded-md
          bg-neutral-900
          cursor-pointer
          rounded-none
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
                                    <Link to={`/art/${art.artworkID}`} className="text-xs font-semibold text-white">View</Link>
                                </div>
                            </div>
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





        </div>
    );
};

export default ArtistProfile;