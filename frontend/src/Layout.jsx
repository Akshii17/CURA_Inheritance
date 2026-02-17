import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { useArtistContext } from './context/ArtistContext';

export default function MainLayout() {
  
    const { artist, isConnected, isLoading } = useArtistContext();
    const isAuthed = isConnected && artist;

  
  return (
    <>
      {isAuthed && <Navbar />}
      <Outlet />
    </>
  );
}
