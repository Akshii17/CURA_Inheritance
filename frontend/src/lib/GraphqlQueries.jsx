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
      tagline
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

export const GET_BID_HISTORY = gql`
  query GetBids ($aucID: BigInt!){
    bidPlaceds (
    where : {auctionID : $aucID}
    orderBy :blockTimestamp
    orderDirection : desc
  ){
    auctionID
    bid
    bidder
    blockTimestamp
  }
  }
`;

export const GET_WITHDRAWAL_INFO = gql`
  query GetWithdrawals ($user : Bytes!){
  bidPlaceds(where: {bidder : $user }, 
    orderBy: auctionID, 
    orderDirection: asc) {
    auctionID
    bid
    bidder
    blockTimestamp
  }
}
`;

export const GET_FOLLOWING_LIST = gql`
  query GetFollowing ($user: Bytes!){
    follows (where : {
    follower : $user 
    isFollowing : true
  } orderBy: blockTimestamp
    orderDirection: desc
  ){
    artist
    blockTimestamp
  }
  }
`;