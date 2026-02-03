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
import NotFound from "./pages/NotFound";



import { useArtistContext } from "./context/ArtistContext";

const App = () => {
  const { artist, isConnected, isLoading } = useArtistContext();

  const isAuthed = isConnected && artist;
  console.log("isAuthed",isAuthed);

  if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-900 text-white">
      Loading...
    </div>
  );
  }



  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="" element={isAuthed ? <Home /> : <Navigate to="/join" />} />
        <Route path="join" element={!isAuthed ? <Landing /> : <Navigate to="/" />} />
        <Route path="explore" element={isAuthed ? <Explore /> : <Navigate to="/join" />}/>
        <Route path="studio" element={isAuthed ? <Studio /> : <Navigate to="/join" />}/>
        <Route path="analytics" element={isAuthed ? <Analytics /> : <Navigate to="/join" />}/>
        <Route path="profile" element={isAuthed ? <Profile /> : <Navigate to="/join" />}/>
        <Route path="art/:id" element={isAuthed ? <ArtPage /> : <Navigate to="/join" />}/>
        <Route path="directcheckout/:id" element={isAuthed ? <DirectSaleCheckout /> : <Navigate to="/join"/>}
        />
        <Route
          path="auctioncheckout/:id"
          element={isAuthed ? <AuctionCheckout /> : <Navigate to="/join" />}
        />
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
