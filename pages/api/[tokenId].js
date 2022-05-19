export default function handler(req, res) {
  // get the tokenId from the query params
  const tokenId = req.query.tokenId;
  // As all the images are uploaded on github, we can extract the images from github directly.
  const image_url =
    "https://ipfs.io/ipfs/bafybeiajth5t724atg7smq3ygkg6z4xkehpkyttwvhwa4givq6wpsmbbm4/estate1.gif";

  // The api is sending back metadata for a Baker NFT
  // To make our collection compatible with Opensea, we need to follow some Metadata standards
  // when sending back the response from the api
  // More info can be found here: https://docs.opensea.io/docs/metadata-standards
  res.status(200).json({
    name: "Baker NFT #" + tokenId,
    description: "Baker NFT is a collection of real estate nfts",
    image: image_url,
    attributes: [
      {
        trait_type: "Building Type",
        value: "4 Bedroom Flat",
      },
      {
        trait_type: "Land Use",
        value: "Residential",
      },
    ],
  });
}
