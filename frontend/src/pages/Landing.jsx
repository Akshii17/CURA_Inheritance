import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { useArtistContext } from "../context/ArtistContext";

import art1 from "../assets/sampleArts/art1.jpg";
import art2 from "../assets/sampleArts/art2.jpg";
import art3 from "../assets/sampleArts/art3.jpg";
import art4 from "../assets/sampleArts/art4.jpg";
import art5 from "../assets/sampleArts/art5.jpg";
import art6 from "../assets/sampleArts/art6.jpg";
import art7 from "../assets/sampleArts/art7.jpg";
import art8 from "../assets/sampleArts/art8.jpg";
import art9 from "../assets/sampleArts/art9.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const {
    contract,
    isConnected,
    artist,
    needsRegistration,
    isLoading,
    fetchArtist
  } = useArtistContext();

  const images = [art1, art2, art3, art4, art5, art6, art7, art8, art9];
  const boxes = [
    { top: "8%", left: "30%", size: 90 },
    { top: "20%", left: "38%", size: 120 },
    { top: "7%", left: "58%", size: 80 },
    { top: "64%", left: "32%", size: 130 },
    { top: "35%", left: "46%", size: 180 },
    { top: "20%", left: "64%", size: 140 },
    { top: "62%", left: "60%", size: 160 },
    { top: "9%", left: "80%", size: 60 },
  ];

  const randomImage = () => images[Math.floor(Math.random() * images.length)];
  const [activeImages, setActiveImages] = useState(boxes.map(randomImage));

  useEffect(() => {
    boxes.forEach((_, i) => loopImageChange(i));
  }, []);

  const loopImageChange = (index) => {
    setTimeout(() => {
      setActiveImages((prev) => {
        const copy = [...prev];
        copy[index] = randomImage();
        return copy;
      });
      loopImageChange(index);
    }, Math.random() * 8000 + 4000);
  };

  // 🔥 AUTH FLOW CONTROL
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isConnected || isLoading) return;

    if (artist) {   // this will redirect to home when login is done  
      setShowModal(false);
      navigate("/");
      return;
    }

    if (needsRegistration) {
      setShowModal(true);
    }
  }, [artist, needsRegistration, isConnected, isLoading]);

  // REGISTER FORM
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !username) {
      toast.error("Please fill all details");
      return;
    }

    try {
      setIsSubmitting(true);

      const tx = await contract.registerUser(name, username);
      await tx.wait();

      toast.success("Registration successful 🎉");
      await fetchArtist();
      setShowModal(false);
      setName("");
      setUsername("");

    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-black">
        <div className="flex justify-between items-center px-8 py-4">
          <h1 className="text-white tracking-wider">CURA</h1>
          <ConnectButton label="Login" />
        </div>
      </nav>

      {/* HERO */}
      <main className="relative overflow-hidden">
        <div className="px-8">
          <div className="grid lg:grid-cols-2 gap-12 py-32">
            <div className="space-y-8 lg:pl-20 text-center lg:text-left">
              <h2 className="text-white text-5xl lg:text-6xl max-w-lg">
                Bid, Buy and Own Exclusive Digital Art
              </h2>
              <p className="text-gray-400 max-w-md">
                Discover a curated marketplace where creativity meets blockchain.
              </p>
            </div>

            <div className="relative h-[520px]">
              {boxes.map((box, i) => (
                <div
                  key={i}
                  className="absolute rounded-xl overflow-hidden"
                  style={{
                    top: box.top,
                    left: box.left,
                    width: box.size,
                    height: box.size,
                  }}
                >
                  <img
                    src={activeImages[i]}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* REGISTER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400"
            >
              <X />
            </button>

            <h2 className="text-white text-xl mb-6 text-center">Register</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full mb-3 px-3 py-2 bg-gray-800 rounded text-white"
            />

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full mb-4 px-3 py-2 bg-gray-800 rounded text-white"
            />

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-2 bg-indigo-600 rounded hover:bg-indigo-700"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
