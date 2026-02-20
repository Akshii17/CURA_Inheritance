import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, MapPin, Link as LinkIcon, Calendar, Check, Share, Bell, Plus, Heart, Wallet, ArrowRight, X } from 'lucide-react';
import { useArtistContext } from "../context/ArtistContext";
import { useQueryContext } from '../context/QueryContext';
import toast from 'react-hot-toast';
import { ethers } from "ethers";

const ArtistProfile = () => {
    const { contract, address, isConnected, artist } = useArtistContext();
    const { artists, artworks, following, fetchArtists } = useQueryContext();
    const { id } = useParams();

    // 1. Logic & Data Fetching
    const artistData = useMemo(() => {
        return artists.find(a => a?.artistAddress?.toLowerCase() === id.toLowerCase());
    }, [artists, id]);

    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (following && id) {
            setIsFollowing(following.some(f => f?.artist?.toLowerCase() === id.toLowerCase()));
        }
    }, [following, id]);

    const filteredArtworks = useMemo(() => {
        return artworks.filter(art => art.originalArtist?.toLowerCase() === id.toLowerCase());
    }, [artworks, id]);

    if (!artistData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                Artist not found
            </div>
        );
    }

    const handleFollow = async () => {
        try {
            if (!isConnected || !address || !contract) {
                toast.error("Please connect your wallet");
                return;
            }
            const checksumAddress = ethers.getAddress(artistData.artistAddress);
            setIsFollowing(prev => !prev);
            const tx = await contract.FollowUnfollow(checksumAddress);
            await tx.wait();
            toast.success(isFollowing ? "Unfollowed" : "Following!");
            fetchArtists();
        } catch (error) {
            setIsFollowing(prev => !prev);
            toast.error("Follow failed");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* HERO BANNER - Styled like user profile [cite: 350] */}
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
                
                {/* PROFILE CARD - Applying User Profile Layout [cite: 351, 352] */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                        
                        {/* Avatar [cite: 352] */}
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-3xl border-4 border-[#7C3AED] overflow-hidden bg-gradient-to-br from-[#7C3AED]/20 to-transparent shadow-2xl">
                                {artistData.pfpHash ? (
                                    <img 
                                        src={`https://gateway.pinata.cloud/ipfs/${artistData.pfpHash}`} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                                        <User size={60} className="text-neutral-600" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-[#1a1a1a]"></div>
                        </div>

                        {/* Info Section [cite: 243] */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-[#F3E5AB] text-5xl mt-1 mb-2 font-serif">
                                {artistData.name || "Unnamed Artist"}
                            </h1>
                            <p className="text-lg text-gray-400 mb-4">
                                @{artistData.username || "username"} 
                                <span className="text-gray-600">{" "}•{" "}</span> 
                                {artistData.tagline || "Exploring digital creativity"}
                            </p>
                            
                            {/* Metadata Strip */}
                            <div className="flex justify-center lg:justify-start gap-6 text-gray-500 text-sm mb-6">
                                <div className="flex items-center gap-1.5"><MapPin size={16} /> Mumbai, India</div>
                                <div className="flex items-center gap-1.5">
                                    <LinkIcon size={16} /> 
                                    <span className="hover:text-white cursor-pointer transition-colors">cura.art/{artistData.username}</span>
                                </div>
                                <div className="flex items-center gap-1.5"><Calendar size={16} /> Joined Jan 2026</div>
                            </div>

                            <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">
                                {artistData.bio || "Exploring and collecting digital experiences on CURA."}
                            </p>

                            {/* Stats Cards [cite: 243] */}
                            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-[#F3E5AB]">{artistData.followerCount || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Followers</div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-[#F3E5AB]">{filteredArtworks.length}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Creations</div>
                                </div>
                            </div>

                            {/* Action Buttons [cite: 246] */}
                            <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
                                <button 
                                    onClick={handleFollow}
                                    className={`px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2 ${
                                        isFollowing 
                                        ? "bg-white/5 border border-white/10 text-white" 
                                        : "bg-[#7C3AED] hover:bg-[#5f2db7] text-[#F3E5AB]"
                                    }`}
                                >
                                    {isFollowing ? <><Check size={18} /> Following</> : "Follow"}
                                </button>
                                <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                                    <Share size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ARTIST'S CREATIONS GALLERY */}
                <section className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-serif font-bold">
                            {artistData.name}'s Creations
                        </h2>
                        <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
                            {filteredArtworks.length} {filteredArtworks.length === 1 ? "Artwork" : "Artworks"}
                        </span>
                    </div>

                    {/* Grid using updated styling */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredArtworks.map((art) => (
                            <Link
                                to={`/art/${art.artworkID}`}
                                key={art.artworkID}
                                className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-900 group border border-white/5 hover:border-[#7C3AED]/50 transition-all shadow-lg"
                            >
                                <img
                                    src={`https://gateway.pinata.cloud/ipfs/${art.ipfsHash}`}
                                    alt={art.artworkTitle}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Watermark Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-50 transition-opacity">
                                    <div className="transform -rotate-45 text-white font-bold text-md tracking-[0.3em] whitespace-nowrap mix-blend-overlay  px-2 py-1">
                                        CURA © PROTECTED
                                    </div>
                                </div>

                                {/* Hover Info [cite: 248] */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <p className="text-sm font-bold text-[#F3E5AB] truncate">{art.artworkTitle}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">View Artwork</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredArtworks.length === 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center">
                            <p className="text-gray-500 italic">No creations found for this artist yet.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default ArtistProfile;