import { gql } from "@apollo/client";


export const GET_ARTISTS = gql`
  query GetArtists {
    artistStates(
    orderBy: blockTimestamp
    orderDirection: desc) {
      artistAddress
      followerCount
      id
      name
      pfpHash
      username
      transactionHash
      blockNumber
      blockTimestamp
      bio
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
    auctionStates(
    orderBy: blockTimestamp
    orderDirection: desc) {
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

export const GET_LIKED_ARTWORKS = gql`
  query GetLikedArtworks ($user: Bytes!){
    artworkLikeds(
      where: {
        liker: $user,
        likeUnlikeArtwork: true
      }
      orderBy: blockTimestamp
      orderDirection: desc
  ) {
    artWorkID
    
  }
  }
`;