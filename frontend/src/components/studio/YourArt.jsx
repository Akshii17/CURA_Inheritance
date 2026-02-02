import { useState } from "react";
import YourArtFilters from "./YourArtFilters";


const YourArt = () => {
  const [status, setStatus] = useState(null);

  return (
    <>
      <YourArtFilters status={status} setStatus={setStatus} />
      
    </>
  );
};

export default YourArt;
