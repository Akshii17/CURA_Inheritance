import { useQuery } from "@apollo/client/react";
import { GET_ARTISTS } from "./lib/GraphqlQueries";

const Test = () => {
  const { data, loading, error } = useQuery(GET_ARTISTS);
  console.log("error",error);
    
  if (loading) return <p>Loading artists...</p>;
  if (error) return <p>Error: {error.message}</p>;
    
  return (
    <div>
      <h2>Artists</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Test;