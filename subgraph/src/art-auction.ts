import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  ArtistState as ArtistStateEvent,
  ArtworkLiked as ArtworkLikedEvent,
  DSState as DSStateEvent,
  FollowUnFollowArtist as FollowUnFollowArtistEvent,
  Transfer as TransferEvent,
  artworkState as artworkStateEvent,
  auctionState as auctionStateEvent,
  bidPlaced as bidPlacedEvent,
  withdraw as withdrawEvent
} from "../generated/artAuction/artAuction"
import {
  Approval,
  ApprovalForAll,
  ArtistState,
  ArtworkLiked,
  Follow,
  DSState,
  FollowUnFollowArtist,
  Transfer,
  artworkState,
  auctionState,
  bidPlaced,
  withdraw
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleArtistState(event: ArtistStateEvent): void {
  let entity = new ArtistState(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.name = event.params.name
  entity.artistAddress = event.params.artistAddress
  entity.username = event.params.username
  entity.bio = event.params.bio
  entity.pfpHash = event.params.pfpHash
  entity.followerCount = event.params.followerCount
  entity.tagline = event.params.tagline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleArtworkLiked(event: ArtworkLikedEvent): void {


  let id =
  event.params.liker.toHex() +
  "-" +
  event.params.artWorkID.toString()


  let entity = ArtworkLiked.load(id)


  if (entity == null) {
    entity = new ArtworkLiked(id)
  }


  entity.artist = event.params.artist
  entity.artWorkID = event.params.artWorkID
  entity.name = event.params.name
  entity.liker = event.params.liker
  entity.likeUnlikeArtwork = event.params.likeUnlikeArtwork


  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash


  entity.save()
}

export function handleDSState(event: DSStateEvent): void {
  let entity = new DSState(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.directSaleID = event.params.directSaleID
  entity.price = event.params.price
  entity.artworkID = event.params.artworkID
  entity.sold = event.params.sold
  entity.seller = event.params.seller

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFollowUnFollowArtist(
  event: FollowUnFollowArtistEvent
): void {


  let entity = new FollowUnFollowArtist(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.artist = event.params.artist
  entity.follower = event.params.follower
  entity.timestamp = event.params.timestamp
  entity.followUnfollow = event.params.followUnfollow


  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash


  entity.save()

  let id =
    event.params.follower.toHex() + "-" + event.params.artist.toHex()


  let follow = new Follow(id)
  follow.follower = event.params.follower
  follow.artist = event.params.artist
  follow.isFollowing = event.params.followUnfollow
  follow.blockTimestamp = event.block.timestamp


  follow.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleartworkState(event: artworkStateEvent): void {
  let entity = new artworkState(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.artworkID = event.params.artworkID
  entity.artworkTitle = event.params.artworkTitle
  entity.description = event.params.description
  entity.saleType = event.params.saleType
  entity.ipfsHash = event.params.ipfsHash
  entity.royaltyP = event.params.royaltyP
  entity.likes = event.params.likes
  entity.nftMinted = event.params.nftMinted
  entity.originalArtist = event.params.originalArtist
  entity.available = event.params.available

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleauctionState(event: auctionStateEvent): void {
  let entity = new auctionState(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionID = event.params.auctionID
  entity.seller = event.params.seller
  entity.artID = event.params.artID
  entity.winner = event.params.winner
  entity.winningBid = event.params.winningBid
  entity.basePrice = event.params.basePrice
  entity.endTime = event.params.endTime
  entity.ended = event.params.ended

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlebidPlaced(event: bidPlacedEvent): void {
  let entity = new bidPlaced(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bidder = event.params.bidder
  entity.bid = event.params.bid
  entity.auctionID = event.params.auctionID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlewithdraw(event: withdrawEvent): void {
  let entity = new withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount
  entity.receiver = event.params.receiver
  entity.auctionID = event.params.auctionID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
