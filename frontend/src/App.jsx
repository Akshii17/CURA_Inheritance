import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";


import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Studio from "./pages/Studio";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import ArtPage from "./pages/ArtPage";
import Landing from "./pages/Landing";
import Layout from "./Layout";
import DirectSaleCheckout from "./pages/DirectSaleCheckout";
import AuctionCheckout from "./pages/AuctionCheckout";
import ArtistProfile from "./pages/ArtistProfile";
import NotFound from "./pages/NotFound";
import { useArtistContext } from "./context/ArtistContext";
import Test from "./Test";
import Testing from "./pages/Testing";


const App = () => {
  const { artist, isConnected, isLoading } = useArtistContext();


  const isAuthed = isConnected && artist;
  console.log("isAuthed",isAuthed);


  if (isLoading) {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black overflow-hidden">
      
      {/* BACKGROUND LAYER: Moving Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="stars-container opacity-40" />
      </div>

      {/* CENTER CONTENT */}
      <div className="relative z-10 flex flex-col items-center">
        {/* THE GLOBE GIF */}
        <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] flex items-center justify-center">
          <img 
            src="/globe.gif" 
            alt="Loading..." 
            className="w-full h-full object-contain mix-blend-screen"
          />
          
          {/* OPTIONAL: A soft purple radial glow behind the globe to give it depth */}
          <div className="absolute inset-0 bg-purple-600/10 blur-[120px] rounded-full z-[-1]" />
        </div>

        {/* LOADING TEXT */}
        <div className="mt-4 flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-[0.8em] text-purple-400/60 font-bold animate-pulse">
            Loading
          </p>
        </div>
      </div>

      <style>{`
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(1px 1px at 25px 35px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 50px 80px, #eee, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 100px 150px, #fff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 250px 250px;
          animation: starsMove 150s linear infinite;
        }
        @keyframes starsMove {
          from { transform: translateY(0); }
          to { transform: translateY(-1000px); }
        }
      `}</style>
    </div>
  );
}




  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="" element={isAuthed ? <Home /> : <Navigate to="/join" />} />
        <Route path="join" element={!isAuthed ? <Landing /> : <Navigate to="/" />} />
        <Route path="explore" element={isAuthed ? <Explore /> : <Navigate to="/join" />}/>
        <Route path="testing" element={isAuthed ? <Testing /> : <Navigate to="/join" />}/>


        <Route path="studio" element={isAuthed ? <Studio /> : <Navigate to="/join" />}/>
        <Route path="analytics" element={isAuthed ? <Analytics /> : <Navigate to="/join" />}/>
        <Route path="profile" element={isAuthed ? <Profile /> : <Navigate to="/join" />}/>
        <Route path="artist/:id" element={isAuthed ? <ArtistProfile /> : <Navigate to="/join" />}/>
        <Route path="art/:id" element={isAuthed ? <ArtPage /> : <Navigate to="/join" />}/>
        <Route path="directcheckout/:id" element={isAuthed ? <DirectSaleCheckout /> : <Navigate to="/join"/>}
        />
        <Route
          path="auctioncheckout/:id"
          element={isAuthed ? <AuctionCheckout /> : <Navigate to="/join" />}
        />
        <Route path="test" element={<Test/>} />
        <Route
          path="*"
          element={isAuthed ? <Navigate to="/" /> : <NotFound/>}
        />
      </Route>,
    ),
  );


  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          style: {
            background: "black",
            color: "white",
            fontFamily: "SpaceGrotesk",
            zIndex: 99999,
          },
        }}
      />
    </>
  );
};


export default App;



