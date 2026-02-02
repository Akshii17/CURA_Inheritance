import art1 from "../assets/sampleArts/art1.jpg";
import art2 from "../assets/sampleArts/art2.jpg";
import art3 from "../assets/sampleArts/art3.jpg";
import art4 from "../assets/sampleArts/art4.jpg";
import art5 from "../assets/sampleArts/art5.jpg";
import art6 from "../assets/sampleArts/art6.jpg";
import art7 from "../assets/sampleArts/art7.jpg";
import art8 from "../assets/sampleArts/art8.jpg";
import art9 from "../assets/sampleArts/art9.jpg";

const SampleArtData = [
  {
    id: 1,
    title: "Ethereal Drift",
    artist: "A. Rao",
    artistId: 1,
    seller: "A. Rao",
    image: art1,
    ownerId: 1,
    purchasedBy: [],

    likedBy:[2,5,3],

    saleType: "auction",
    price: 2.4,
    currency: "ETH",
    currentBid: 2.9,
    endDate: "2026-01-25T09:00:00Z",

    genre: "fantasy",
    tags: ["fantasy", "sci-fi", "digital"],

    uploadedAt: "2026-01-02",
    status: "Live",
  },
  {
    id: 2,
    title: "Silent Protagonist",
    artist: "N. Verma",
    artistId: 2,
    seller: "N. Verma",
    image: art2,
    ownerId: 2,
    purchasedBy: [],

    likedBy:[2,5,3],

    saleType: "direct",
    price: 1.1,
    currency: "ETH",

    genre: "character",
    tags: ["character", "portrait"],

    uploadedAt: "2026-01-01",
    status: "Up for Sale",
  },
  {
    id: 3,
    title: "Concept No. 07",
    artist: "N. Verma",
    artistId: 2,
    seller: "K. Mehta",
    image: art3,
    ownerId: 1,
    purchasedBy: [6, 1],

    likedBy:[2,5,3],

    saleType: "direct",
    price: 0.25,
    currency: "ETH",

    genre: "concept",
    tags: ["concept", "environment"],

    uploadedAt: "2025-12-30",
    status: "Sold",
  },
  {
    id: 4,
    title: "Fragmented Thought",
    artist: "R. Sharma",
    artistId: 3,
    seller: "R. Sharma",
    image: art4,
    ownerId: 3,
    purchasedBy: [],

    likedBy:[2,5,3],

    saleType: "auction",
    price: 3.2,
    currency: "ETH",
    currentBid: 3.8,
    endDate: "2026-01-23T18:30:00Z",

    genre: "abstract",
    tags: ["abstract", "modern"],

    uploadedAt: "2026-01-03",
    status: "Live",
  },
  {
    id: 5,
    title: "Still Form",
    artist: "S. Iyer",
    artistId: 4,
    seller: "S. Iyer",
    image: art5,
    ownerId: 2,
    purchasedBy: [2],

    likedBy:[2,5,3],

    saleType: "direct",
    price: 0.9,
    currency: "ETH",

    genre: "modern",
    tags: ["minimal", "modern"],

    uploadedAt: "2025-12-29",
    status: "Sold",
  },
  {
    id: 6,
    title: "Ink & Light",
    artist: "P. Khanna",
    artistId: 5,
    seller: "P. Khanna",
    image: art6,
    ownerId: 5,
    purchasedBy: [],

    likedBy:[2,5,3],

    saleType: "direct",
    price: 0.4,
    currency: "ETH",

    genre: "illustration",
    tags: ["illustration", "ink", "minimal"],

    uploadedAt: "2026-01-01",
    status: "Up For Sale",
  },
  {
    id: 7,
    title: "Midnight Strokes",
    artist: "P. Khanna",
    artistId: 5,
    seller: "N. Verma",
    image: art7,
    ownerId: 2,
    purchasedBy: [3, 2],

    likedBy:[2,5,3],

    saleType: "direct",
    price: 1.2,
    currency: "ETH",

    genre: "illustration",
    tags: ["ink", "dark", "abstract"],

    uploadedAt: "2026-01-03",
    status: "Up For Sale",
  },
  {
    id: 8,
    title: "Quiet Contrast",
    artist: "N.Verma",
    artistId: 2,
    seller: "P. Khanna",
    image: art8,
    ownerId: 5,
    purchasedBy: [3, 5],

    likedBy:[2,5,3],

    saleType: "auction",
    price: 0.8, 
    currency: "ETH",
    currentBid: 3.9,
    endDate: "2026-01-08T18:30:00Z",

    genre: "character",
    tags: ["monochrome", "contrast", "lineart"],

    uploadedAt: "2026-01-05",
    status: "Unsold",
  },
  {
    id: 9,
    title: "Fragments of Light",
    artist: "N.Verma",
    artistId: 2,
    seller: "N. Verma",
    image: art9,
    ownerId: 5,
    purchasedBy: [5],

    likedBy:[2,5,3],

    saleType: "direct",
    price: 0.25,
    currency: "ETH",

    genre: "concept",
    tags: ["light", "texture", "modern"],

    uploadedAt: "2026-01-07",
    status: "Sold",
  },

];

export default SampleArtData;
