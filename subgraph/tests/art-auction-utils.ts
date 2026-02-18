import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  ArtistState,
  ArtworkLiked,
  DSState,
  FollowUnFollowArtist,
  Transfer,
  artworkState,
  auctionState,
  bidPlaced,
  withdraw
} from "../generated/artAuction/artAuction"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createArtistStateEvent(
  name: string,
  artistAddress: Address,
  username: string,
  bio: string,
  pfpHash: string,
  followerCount: BigInt,
  tagline: string
): ArtistState {
  let artistStateEvent = changetype<ArtistState>(newMockEvent())

  artistStateEvent.parameters = new Array()

  artistStateEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  artistStateEvent.parameters.push(
    new ethereum.EventParam(
      "artistAddress",
      ethereum.Value.fromAddress(artistAddress)
    )
  )
  artistStateEvent.parameters.push(
    new ethereum.EventParam("username", ethereum.Value.fromString(username))
  )
  artistStateEvent.parameters.push(
    new ethereum.EventParam("bio", ethereum.Value.fromString(bio))
  )
  artistStateEvent.parameters.push(
    new ethereum.EventParam("pfpHash", ethereum.Value.fromString(pfpHash))
  )
  artistStateEvent.parameters.push(
    new ethereum.EventParam(
      "followerCount",
      ethereum.Value.fromUnsignedBigInt(followerCount)
    )
  )
  artistStateEvent.parameters.push(
    new ethereum.EventParam("tagline", ethereum.Value.fromString(tagline))
  )

  return artistStateEvent
}

export function createArtworkLikedEvent(
  artist: Address,
  artWorkID: BigInt,
  name: string,
  liker: Address,
  likeUnlikeArtwork: boolean
): ArtworkLiked {
  let artworkLikedEvent = changetype<ArtworkLiked>(newMockEvent())

  artworkLikedEvent.parameters = new Array()

  artworkLikedEvent.parameters.push(
    new ethereum.EventParam("artist", ethereum.Value.fromAddress(artist))
  )
  artworkLikedEvent.parameters.push(
    new ethereum.EventParam(
      "artWorkID",
      ethereum.Value.fromUnsignedBigInt(artWorkID)
    )
  )
  artworkLikedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  artworkLikedEvent.parameters.push(
    new ethereum.EventParam("liker", ethereum.Value.fromAddress(liker))
  )
  artworkLikedEvent.parameters.push(
    new ethereum.EventParam(
      "likeUnlikeArtwork",
      ethereum.Value.fromBoolean(likeUnlikeArtwork)
    )
  )

  return artworkLikedEvent
}

export function createDSStateEvent(
  directSaleID: BigInt,
  price: BigInt,
  artworkID: BigInt,
  sold: boolean,
  seller: Address
): DSState {
  let dsStateEvent = changetype<DSState>(newMockEvent())

  dsStateEvent.parameters = new Array()

  dsStateEvent.parameters.push(
    new ethereum.EventParam(
      "directSaleID",
      ethereum.Value.fromUnsignedBigInt(directSaleID)
    )
  )
  dsStateEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  dsStateEvent.parameters.push(
    new ethereum.EventParam(
      "artworkID",
      ethereum.Value.fromUnsignedBigInt(artworkID)
    )
  )
  dsStateEvent.parameters.push(
    new ethereum.EventParam("sold", ethereum.Value.fromBoolean(sold))
  )
  dsStateEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )

  return dsStateEvent
}

export function createFollowUnFollowArtistEvent(
  artist: Address,
  follower: Address,
  timestamp: BigInt,
  followUnfollow: boolean
): FollowUnFollowArtist {
  let followUnFollowArtistEvent =
    changetype<FollowUnFollowArtist>(newMockEvent())

  followUnFollowArtistEvent.parameters = new Array()

  followUnFollowArtistEvent.parameters.push(
    new ethereum.EventParam("artist", ethereum.Value.fromAddress(artist))
  )
  followUnFollowArtistEvent.parameters.push(
    new ethereum.EventParam("follower", ethereum.Value.fromAddress(follower))
  )
  followUnFollowArtistEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  followUnFollowArtistEvent.parameters.push(
    new ethereum.EventParam(
      "followUnfollow",
      ethereum.Value.fromBoolean(followUnfollow)
    )
  )

  return followUnFollowArtistEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createartworkStateEvent(
  artworkID: BigInt,
  artworkTitle: string,
  description: string,
  saleType: string,
  ipfsHash: string,
  royaltyP: BigInt,
  likes: BigInt,
  nftMinted: boolean,
  originalArtist: Address,
  available: boolean
): artworkState {
  let artworkStateEvent = changetype<artworkState>(newMockEvent())

  artworkStateEvent.parameters = new Array()

  artworkStateEvent.parameters.push(
    new ethereum.EventParam(
      "artworkID",
      ethereum.Value.fromUnsignedBigInt(artworkID)
    )
  )
  artworkStateEvent.parameters.push(
    new ethereum.EventParam(
      "artworkTitle",
      ethereum.Value.fromString(artworkTitle)
    )
  )
  artworkStateEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  artworkStateEvent.parameters.push(
    new ethereum.EventParam("saleType", ethereum.Value.fromString(saleType))
  )
  artworkStateEvent.parameters.push(
    new ethereum.EventParam("ipfsHash", ethereum.Value.fromString(ipfsHash))
  )
  artworkStateEvent.parameters.push(
    new ethereum.EventParam(
      "royaltyP",
      ethereum.Value.fromUnsignedBigInt(royaltyP)
    )
  )
  artworkStateEvent.parameters.push(
    new ethereum.EventParam("likes", ethereum.Value.fromUnsignedBigInt(likes))
  )
  artworkStateEvent.parameters.push(
    new ethereum.EventParam("nftMinted", ethereum.Value.fromBoolean(nftMinted))
  )
  artworkStateEvent.parameters.push(
    new ethereum.EventParam(
      "originalArtist",
      ethereum.Value.fromAddress(originalArtist)
    )
  )
  artworkStateEvent.parameters.push(
    new ethereum.EventParam("available", ethereum.Value.fromBoolean(available))
  )

  return artworkStateEvent
}

export function createauctionStateEvent(
  auctionID: BigInt,
  seller: Address,
  artID: BigInt,
  winner: Address,
  winningBid: BigInt,
  basePrice: BigInt,
  endTime: BigInt,
  ended: boolean
): auctionState {
  let auctionStateEvent = changetype<auctionState>(newMockEvent())

  auctionStateEvent.parameters = new Array()

  auctionStateEvent.parameters.push(
    new ethereum.EventParam(
      "auctionID",
      ethereum.Value.fromUnsignedBigInt(auctionID)
    )
  )
  auctionStateEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  auctionStateEvent.parameters.push(
    new ethereum.EventParam("artID", ethereum.Value.fromUnsignedBigInt(artID))
  )
  auctionStateEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )
  auctionStateEvent.parameters.push(
    new ethereum.EventParam(
      "winningBid",
      ethereum.Value.fromUnsignedBigInt(winningBid)
    )
  )
  auctionStateEvent.parameters.push(
    new ethereum.EventParam(
      "basePrice",
      ethereum.Value.fromUnsignedBigInt(basePrice)
    )
  )
  auctionStateEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )
  auctionStateEvent.parameters.push(
    new ethereum.EventParam("ended", ethereum.Value.fromBoolean(ended))
  )

  return auctionStateEvent
}

export function createbidPlacedEvent(
  bidder: Address,
  bid: BigInt,
  auctionID: BigInt
): bidPlaced {
  let bidPlacedEvent = changetype<bidPlaced>(newMockEvent())

  bidPlacedEvent.parameters = new Array()

  bidPlacedEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  bidPlacedEvent.parameters.push(
    new ethereum.EventParam("bid", ethereum.Value.fromUnsignedBigInt(bid))
  )
  bidPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionID",
      ethereum.Value.fromUnsignedBigInt(auctionID)
    )
  )

  return bidPlacedEvent
}

export function createwithdrawEvent(
  amount: BigInt,
  receiver: Address,
  auctionID: BigInt
): withdraw {
  let withdrawEvent = changetype<withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "auctionID",
      ethereum.Value.fromUnsignedBigInt(auctionID)
    )
  )

  return withdrawEvent
}
