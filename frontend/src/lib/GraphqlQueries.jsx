import { gql } from "@apollo/client";


export const GET_ARTISTS = gql`
  query GetArtists {
    artistStates {
      artistAddress
      followerCount
      id
      name
      pfpHash
      username
      transactionHash
      blockNumber
      blockTimestamp
    }
  }
`;


export const GET_ARTWORKS = gql`
  query GetArtworks {
    artworkStates(
    orderBy: blockTimestamp
    orderDirection: desc) {
      artworkID
      artworkTitle
      available
      description
      id
      ipfsHash
      likes
      nftMinted
      originalArtist
      royaltyP
      saleType
    }
  }
`;

export const GET_DS = gql`
  query GetDS {
    dsstates {
      artworkID
      directSaleID
      price
      seller
      sold
      blockNumber
      blockTimestamp
      id
    }
  }
`;

export const GET_AUCTIONS = gql`
  query GetDS {
    auctionStates {
      artID
      auctionID
      basePrice
      endTime
      ended
      seller
      winner
      winningBid
      blockTimestamp
    }
  }
`;
