import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import SampleArtistData from '../constants/SampleArtistData';
import { useArtistContext } from "../context/ArtistContext";
import toast from 'react-hot-toast';


const ArtistProfile = () => {
    const { contract, address, isConnected } = useArtistContext();
    const { id } = useParams();

    const artistData = SampleArtistData.find(
        (artist) => artist.artistId === Number(id)
    );


    const INITIAL_NOTIFICATIONS = [
        { id: 1, text: "Your artwork 'Midnight Echo' was sold for 0.5 ETH!", time: "2m ago" },
        { id: 2, text: "New bid placed on 'Geometric Solitude' by @crypto_king.", time: "1h ago" },
        { id: 3, text: "Welcome to CURA! Complete your profile to get verified.", time: "1d ago" }
    ];

    const INITIAL_ARTWORKS = [
        { id: 1, src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500', title: 'Midnight Echo', likes: 120 },
        { id: 2, src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=500', title: 'Abstract Waves', likes: 85 },
        { id: 3, src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=500', title: 'Geometric Solitude', likes: 210 },
        { id: 4, src: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=500', title: 'Dark Matter', likes: 45 },
        { id: 5, src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=500', title: 'Fluidity', likes: 98 },
        { id: 6, src: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=500', title: 'Redux', likes: 156 },
    ];

    if (!artistData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Artist not found
            </div>
        );
    }



    const navigate = useNavigate();
    const location = useLocation();
    const coverFileRef = useRef(null);


    const [profileData, setProfileData] = useState(artistData);



    const isActive = (path) => location.pathname === path;

    try {
        const checksumAddress = ethers.getAddress(artistData.address);
        console.log(checksumAddress);
    } catch (error) {
        console.error("Invalid address");
        toast.error("Something went wrong, Please try again later")
    }

    const handleFollow = async () => {
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

    const displayData = profileData;
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
                <img src={displayData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />

            </div>

            <main className="max-w-[1000px] mx-auto px-5">
                {/*prof card*/}
                <div className="px-5 relative">

                    {/* avatar and action rows*/}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 gap-5 md:gap-0">
                        <div className="relative">
                            <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full border-4 md:border-6 border-[#050505] overflow-hidden bg-[#1a1a1a] relative">
                                {displayData.profileImage ? (
                                    <img src={displayData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
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
                                <h1 className="text-3xl font-bold font-serif m-0 mb-1 tracking-tight">{displayData.name}</h1>
                                <div className="text-base text-[#8a8a8a] mb-4 font-medium">{displayData.username} • {displayData.tagline}</div>

                                <div className="flex justify-center md:justify-start gap-6 flex-wrap text-[#666] text-[13px] mb-6">
                                    {displayData.location && <div className="flex items-center gap-1.5"><MapPin size={14} /> {displayData.location}</div>}
                                    {displayData.website && <div className="flex items-center gap-1.5"><LinkIcon size={14} /> <a href={`https://${displayData.website}`} className="text-inherit no-underline hover:text-white">{displayData.website}</a></div>}
                                    <div className="flex items-center gap-1.5"><Calendar size={14} /> {displayData.joined}</div>
                                </div>

                                <div className="text-[15px] leading-relaxed text-[#e0e0e0] mb-5">{displayData.about}</div>

                                {/*folower stats*/}
                                <div className="inline-flex gap-6 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 mt-5">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-white">{displayData.followers}</span>
                                        <span className="text-[11px] text-[#888] uppercase tracking-wider mt-0.5">Followers</span>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </main>





        </div>
    );
};

export default ArtistProfile;