import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import toast from "react-hot-toast";

import art1 from "../assets/sampleArts/art1.jpg";
import art2 from "../assets/sampleArts/art2.jpg";
import art3 from "../assets/sampleArts/art3.jpg";
import art4 from "../assets/sampleArts/art4.jpg";
import art5 from "../assets/sampleArts/art5.jpg";
import art6 from "../assets/sampleArts/art6.jpg";
import art7 from "../assets/sampleArts/art7.jpg";
import art8 from "../assets/sampleArts/art8.jpg";
import art9 from "../assets/sampleArts/art9.jpg";

import { useArtistContext } from "../context/ArtistContext";

const Landing = () => {
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
  const [activeImages, setActiveImages] = useState(boxes.map(() => randomImage()));

  useEffect(() => {
    boxes.forEach((_, index) => loopImageChange(index));
  }, []);

  const loopImageChange = (index) => {
    const delay = Math.random() * 8000 + 4000;
    setTimeout(() => {
      setActiveImages((prev) => {
        const updated = [...prev];
        updated[index] = randomImage();
        return updated;
      });
      loopImageChange(index);
    }, delay);
  };

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const { contract, isConnected, address } = useArtistContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !username) {
      toast.error("Please fill all details");
      return;
    }

    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!contract) {
      toast.error("Please wait a few seconds.");
      return;
    }

    console.log(name);
    console.log(username);
    console.log(address);


    try {
      setIsSubmitting(true);
      // send transaction
      const tx = await contract.registerUser(name, username);
      const receipt = await tx.wait(); // wait for blockchain confirmation

      toast.success("Registration successful!");

      // Log emitted events
      receipt.events?.forEach((event) => {
        if (event.event === "Registered") {
          console.log("Registered event:", event.args);
        //   event.args[0] -> address
        //   event.args[1] -> username
        //   event.args[2] -> name
        }
      });
      
      
      
      setShowModal(false);
      setName("");
      setUsername("");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Please try gain later");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setUsername("");
    setShowModal(false);
  };

  return (
    <div className="bg-black min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-black sticky top-0 z-50">
        <div className="mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-white tracking-wider">CURA</h1>
          <div className="flex gap-4">
            <ConnectButton label="Login" />
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main className="relative overflow-hidden">
        <div className="mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-32">
            {/* LEFT */}
            <div className="space-y-8 lg:pl-20 text-center lg:text-left">
              <h2 className="text-white max-w-lg leading-tight text-5xl lg:text-6xl">
                Bid, Buy and Own Exclusive Digital Art
              </h2>
              <p className="text-gray-400 max-w-md">
                Discover a curated marketplace where creativity meets blockchain.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <button className="px-8 py-3 bg-gray-700 rounded hover:bg-gray-600">
                  Explore Gallery
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-8 py-3 border border-gray-700 rounded hover:bg-gray-700"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* RIGHT COLLAGE */}
            <div className="relative w-full h-[520px] -mt-10">
              {boxes.map((box, i) => (
                <div
                  key={i}
                  className="absolute overflow-hidden shadow-md rounded-xl"
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
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-gray-900 p-6 shadow-xl animate-fadeIn">
            <button
              onClick={handleCancel}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="mb-6 text-2xl font-semibold text-gray-100 text-center">
              Register
            </h2>

            <div className="mb-4">
              <label className="text-sm text-gray-400">Name</label>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-400">Username</label>
              <input
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your username"
              />
            </div>

            <ConnectButton showBalance={false} />

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !contract || !isConnected}
              className={`w-full rounded-lg py-2 font-medium text-white mt-4 transition ${
                !contract || !isConnected
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
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