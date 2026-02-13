import React from 'react'
import { useQueryContext } from '../context/QueryContext'
import toast from 'react-hot-toast';
import { useEffect } from 'react';


const Testing = () => {


  const { artworks, fetchArtworks } = useQueryContext();










  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {artworks.map((artwork) => (
        <>
          <React.Fragment key={artwork.id}>
            <img
              src={`https://gateway.pinata.cloud/ipfs/${artwork.ipfsHash}`}
              alt={artwork.artworkTitle}
              className="w-full h-64 object-cover rounded-lg"
              loading="lazy"
            />
            <p>{artwork.artworkTitle}</p>
            {console.log(artwork.ipfsHash)}
          </React.Fragment>
          </>
      ))}
        </div >
  );
}


      export default Testing;

