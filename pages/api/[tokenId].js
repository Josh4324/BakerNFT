import Cors from "cors";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  // get the tokenId from the query params
  // As all the images are uploaded on github, we can extract the images from github directly.
  const image_url =
    "https://ipfs.io/ipfs/bafybeiajth5t724atg7smq3ygkg6z4xkehpkyttwvhwa4givq6wpsmbbm4/estate1.gif";

  const tokenId = req.query.tokenId;
  const bakerList = {
    1: {
      name: "Baker NFT #" + tokenId,
      description: "Building 1 of Baker NFT Collection",
      image: image_url,
    },
    2: {
      name: "Baker NFT #" + tokenId,
      description: "Building 2 of Baker NFT Collection",
      image: image_url,
    },
    3: {
      name: "Baker NFT #" + tokenId,
      description: "Building 3 of Baker NFT Collection",
      image: image_url,
    },
    4: {
      name: "Baker NFT #" + tokenId,
      description: "Building 4 of Baker NFT Collection",
      image: image_url,
    },
    5: {
      name: "Baker NFT #" + tokenId,
      description: "Building 5 of Baker NFT Collection",
      image: image_url,
    },
  };

  // The api is sending back metadata for a Baker NFT
  // To make our collection compatible with Opensea, we need to follow some Metadata standards
  // when sending back the response from the api
  // More info can be found here: https://docs.opensea.io/docs/metadata-standards
  res.status(200).json({
    name: bakerList[tokenId].name,
    description: bakerList[tokenId].description,
    image: bakerList[tokenId].image,
  });
}
