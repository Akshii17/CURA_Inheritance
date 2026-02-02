import React, { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  User, Hexagon, Share, X, Save, Camera, 
  Heart, MessageCircle, Plus, Upload, 
  Bell, MapPin, Link as LinkIcon, Calendar, Menu
} from 'lucide-react';

const Profile = () => {
  const INITIAL_USER = {
    name: 'Shreya Pawar',
    username: '@shreyy',
    tagline: 'Digital Artist & Curator',
    followers: '1.2k', 
    about: 'Exploring the boundaries of digital minimalism. Focused on monochrome aesthetics, 3D rendering, and the future of Web3 art.',
    location: 'Mumbai, India',
    website: 'cura.art/shreyy',
    joined: 'Joined Jan 2026',
    profileImage: null,
    coverImage: 'https://wallpapers.com/images/hd/retrowave-mountain-cover-hpjdu2b1wxpcpwt3.jpg' 
  };

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

  const PREDEFINED_TAGS = ["Abstract", "3D Render", "Photography", "Surrealism", "Cyberpunk", "Minimalist", "Portrait"];
  const NAV_ITEMS = ['Home', 'Explore', 'Studio', 'Analytics'];
  const navigate = useNavigate();
  const location = useLocation();
  const profileFileRef = useRef(null);
  const coverFileRef = useRef(null);
  const createFileRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const [profileData, setProfileData] = useState(INITIAL_USER);
  const [editFormData, setEditFormData] = useState(INITIAL_USER);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [artworks, setArtworks] = useState(INITIAL_ARTWORKS); //for popup lookup

  const [createForm, setCreateForm] = useState({ title: '', description: '', price: '', royalty: '', imageSrc: null });
  const [createTags, setCreateTags] = useState([]);
  const [customTagInput, setCustomTagInput] = useState("");

  const isActive = (path) => location.pathname === path;
  
  const handleProfileChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  const handleProfileImageChange = (e) => { 
    if (e.target.files[0]) setEditFormData({ ...editFormData, profileImage: URL.createObjectURL(e.target.files[0]) }); 
  };
  const handleCoverImageChange = (e) => {
    if (e.target.files[0]) setEditFormData({ ...editFormData, coverImage: URL.createObjectURL(e.target.files[0]) });
  };
  const saveProfile = () => { 
    setProfileData(editFormData); 
    setIsEditing(false); 
  };
  const handleCreateChange = (e) => setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  const handleCreateImageUpload = (e) => {
    if (e.target.files[0]) setCreateForm({ ...createForm, imageSrc: URL.createObjectURL(e.target.files[0]) });
  };
  const toggleCreateTag = (tag) => {
    createTags.includes(tag) ? setCreateTags(createTags.filter(t => t !== tag)) : setCreateTags([...createTags, tag]);
  };
  const handleCustomTagAdd = (e) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      if (!createTags.includes(customTagInput.trim())) setCreateTags([...createTags, customTagInput.trim()]);
      setCustomTagInput("");
    }
  };
  const submitArtwork = () => {
    if (!createForm.title || !createForm.imageSrc) return alert("Please provide at least a title and an image.");
    alert("Artwork Created! (It will appear in your backend)");
    setShowCreateModal(false);
    setCreateForm({ title: '', description: '', price: '', royalty: '', imageSrc: null });
    setCreateTags([]);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const renderNotificationText = (text) => {
    const parts = text.split(/'([^']+)'/);
    if (parts.length === 1) return text;
    return parts.map((part, index) => {
      const matchedArt = artworks.find(a => a.title === part);
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
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-24">
      {/* Keeping font import only */}
      

    
        
        
      
      {/*cover*/}
      <div className="h-[180px] md:h-[280px] w-full relative overflow-hidden rounded-b-3xl -mb-[60px] md:-mb-[80px]">
        <img src={displayData.coverImage} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
        {isEditing && (
          <button 
            className="absolute top-5 right-5 bg-black/60 text-white border border-white/20 rounded-2xl px-4 py-2 text-xs cursor-pointer backdrop-blur-sm flex items-center gap-1.5"
            onClick={() => coverFileRef.current.click()}
          >
            <Camera size={14} /> Edit Cover
            <input type="file" ref={coverFileRef} onChange={handleCoverImageChange} className="hidden" accept="image/*" />
          </button>
        )}
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
                {isEditing && (
                  <div 
                    className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer" 
                    onClick={() => profileFileRef.current.click()}
                  >
                    <Camera size={24} color="#fff" />
                    <input type="file" ref={profileFileRef} onChange={handleProfileImageChange} className="hidden" accept="image/*" />
                  </div>
                )}
              </div>
            </div>

            {/*action buttons*/}
            <div className="flex gap-3 pb-2.5 w-full md:w-auto justify-center flex-wrap">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="bg-white/5 text-white border border-white/10 px-5 py-2.5 rounded-full font-semibold text-sm cursor-pointer flex items-center gap-2"><X size={16} /> Cancel</button>
                  <button onClick={saveProfile} className="bg-white text-black border-none px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer flex items-center gap-2"><Save size={16} /> Save Changes</button>
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
                      {notifications.length > 0 && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]" />}
                    </button>
                    {showNotifs && (
                        /* Notifications Dropdown */
                        <div className="absolute top-[50px] right-0 md:right-0 left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 w-[280px] md:w-[340px] bg-[#1a1a1a] border border-[#333] rounded-2xl z-50 shadow-2xl overflow-hidden">
                            <div className="p-4 border-b border-[#222] text-sm font-bold">Notifications</div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.map(n => (
                                    <div key={n.id} className="p-4 border-b border-[#222] flex gap-3 items-start">
                                        <div className="flex-1">
                                            <div className="text-[13px] text-[#ccc] leading-snug">
                                              {/*func to parse text, click logic */}
                                              {renderNotificationText(n.text)}
                                            </div>
                                            <div className="text-[11px] text-[#666] mt-1">{n.time}</div>
                                        </div>
                                        <X size={14} className="cursor-pointer text-[#666]" onClick={(e)=>{e.stopPropagation(); deleteNotification(n.id)}}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>
                  
                  <button className="bg-transparent border-none text-white cursor-pointer p-2.5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><Share size={20} /></button>
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
          <div className="max-w-[600px] mt-2.5 text-center md:text-left w-full">
            {isEditing ? (
              <>
                <label className="block text-xs text-[#888] mb-1.5 font-semibold">Display Name</label>
                <input className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full mb-3 text-xl font-bold focus:outline-none" name="name" value={displayData.name} onChange={handleProfileChange} />
                
                <label className="block text-xs text-[#888] mb-1.5 font-semibold">Tagline</label>
                <input className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full mb-3 text-sm focus:outline-none" name="tagline" value={displayData.tagline} onChange={handleProfileChange} />
                
                <label className="block text-xs text-[#888] mb-1.5 font-semibold">Bio</label>
                <textarea className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full min-h-[100px] mb-3 text-sm font-sans focus:outline-none" name="about" value={displayData.about} onChange={handleProfileChange} />
                
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-xs text-[#888] mb-1.5 font-semibold">Location</label>
                        <input className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full mb-3 text-sm focus:outline-none" name="location" value={displayData.location} onChange={handleProfileChange} />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs text-[#888] mb-1.5 font-semibold">Website</label>
                        <input className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full mb-3 text-sm focus:outline-none" name="website" value={displayData.website} onChange={handleProfileChange} />
                    </div>
                </div>
              </>
            ) : (
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
            )}
          </div>
        </div>
      </main>

      {/*create*/}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 z-[2000] flex items-center justify-center p-10" onClick={() => setShowCreateModal(false)}>
          <div className="w-full max-w-[550px] max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[20px] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-[#222] flex justify-between items-center">
              <h2 className="text-xl m-0 font-serif">Mint New Artwork</h2>
              <button onClick={() => setShowCreateModal(false)} className="bg-transparent border-none text-white cursor-pointer"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex flex-col gap-5">
              <div className="w-full h-[140px] border-2 border-dashed border-[#333] rounded-xl flex flex-col items-center justify-center bg-white/5 cursor-pointer" onClick={() => createFileRef.current.click()}>
                <input type="file" ref={createFileRef} onChange={handleCreateImageUpload} className="hidden" accept="image/*" />
                {createForm.imageSrc ? 
                  <img src={createForm.imageSrc} alt="Preview" className="w-full h-full object-cover rounded-xl" /> : 
                  <><div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3"><Upload size={24} color="#888" /></div><span className="text-[#666] text-[13px]">Click to Upload Image</span></>
                }
              </div>
              
              <div className="flex flex-col gap-1.5"><label className="block text-xs text-[#888] mb-1.5 font-semibold">Title</label><input className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full text-sm focus:outline-none" name="title" value={createForm.title} placeholder="e.g. The Golden Hour" onChange={handleCreateChange} /></div>
              <div className="flex flex-col gap-1.5"><label className="block text-xs text-[#888] mb-1.5 font-semibold">Description</label><textarea className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full min-h-[80px] text-sm resize-none font-sans focus:outline-none" name="description" value={createForm.description} placeholder="Tell the story..." onChange={handleCreateChange} /></div>
              
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs text-[#888] mb-1.5 font-semibold">Genre & Tags</label>
                <div className="flex flex-wrap gap-2">{PREDEFINED_TAGS.map(tag => <button key={tag} onClick={() => toggleCreateTag(tag)} className={`px-3 py-1.5 rounded-[20px] cursor-pointer text-xs ${createTags.includes(tag) ? 'bg-white border border-white text-black font-bold' : 'bg-white/5 border border-[#333] text-[#aaa]'}`}>{tag}</button>)}</div>
                <input className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full text-sm mt-2 focus:outline-none" placeholder="Type custom tag and press Enter..." value={customTagInput} onChange={(e) => setCustomTagInput(e.target.value)} onKeyDown={handleCustomTagAdd} />
                <div className="flex gap-2 flex-wrap mt-2">{createTags.filter(t => !PREDEFINED_TAGS.includes(t)).map(t => <span key={t} className="text-[11px] bg-[#222] px-2 py-1 rounded text-white flex items-center gap-1">#{t} <X size={10} className="cursor-pointer" onClick={() => toggleCreateTag(t)}/></span>)}</div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1"><label className="block text-xs text-[#888] mb-1.5 font-semibold">Price (ETH)</label><input type="number" className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full text-sm focus:outline-none" name="price" value={createForm.price} placeholder="0.5" onChange={handleCreateChange} /></div>
                <div className="flex-1"><label className="block text-xs text-[#888] mb-1.5 font-semibold">Resell Royalty (%)</label><input type="number" className="bg-white/5 border border-[#333] text-white p-3 rounded-lg w-full text-sm focus:outline-none" name="royalty" value={createForm.royalty} placeholder="5" max="20" onChange={handleCreateChange} /></div>
              </div>
            </div>
            <div className="px-6 py-5 border-t border-[#222] bg-[#0a0a0a]"><button className="w-full p-3.5 bg-white text-black font-bold border-none rounded-xl cursor-pointer hover:bg-gray-200 transition-colors" onClick={submitArtwork}>Create Artwork</button></div>
          </div>
        </div>
      )}

      {/*notif image popup*/}
      {selectedArt && (
        <div className="fixed inset-0 bg-black/85 z-[2000] flex items-center justify-center p-10" onClick={() => setSelectedArt(null)}>
          <button className="absolute top-5 right-5 bg-transparent border-none text-white cursor-pointer z-[2100]"><X size={32} /></button>
          <div className="flex flex-col max-h-[90vh] max-w-[1000px] w-full bg-[#000] rounded-lg overflow-hidden relative border border-[#333]" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#000] flex justify-center items-center flex-1 min-h-[300px]"><img src={selectedArt.src} alt={selectedArt.title} className="max-w-full max-h-[80vh] object-contain" /></div>
            <div className="p-5 border-t border-[#222] flex justify-between items-center bg-[#111]">
              <div>
                <h3 className="m-0 mb-1 text-lg text-white">{selectedArt.title}</h3>
                <span className="text-xs text-[#999]">{selectedArt.price ? `${selectedArt.price} ETH` : 'Uploaded just now'}</span>
              </div>
              <div className="flex gap-5"><div className="flex gap-2 cursor-pointer items-center"><Heart size={24} color="white" /><span className="font-bold">{selectedArt.likes}</span></div><Share size={24} className="cursor-pointer"/></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;