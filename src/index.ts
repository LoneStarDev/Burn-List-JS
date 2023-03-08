import { initializeKeypair } from "./initializeKeypair";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  NftWithToken,
} from "@metaplex-foundation/js";
import * as fs from "fs";

interface nftData_Unsafe {
  name: string;
  symbol: string;
  description: string;
  sellerFeeBasisPoints: number;
  imageFile: string;
}

interface nftData_Safe {
  name: string;
  symbol: string;
  description: string;
  sellerFeeBasisPoints: number;
  imageFile: string;
}

// example data for a new NFT
const nftData_Unsafe = {
  name: "SCAM YO'SELF!",
  symbol: "HACKERMAN",
  description:
    "Hello, go to https://www.scamyourselfnoob.com and connect your wallet, so we can drain your entire account and all your hard earned money and NFTS (just kidding, for testing). Good thing you have the Burn List!",
  sellerFeeBasisPoints: 0,
  imageFile: "SAFU.png",
};

const nftData_Safe = {
  name: "SCAM YO'SELF!",
  symbol: "HACKERMAN",
  description:
    "Hello, go to https://www.scamyourselfnoob.com and connect your wallet, so we can drain your entire account and all your hard earned money and NFTS (just kidding, for testing). Good thing you have the Burn List!",
  sellerFeeBasisPoints: 0,
  imageFile: "SAFU.png",
};

// example data for updating an existing NFT
const updateNftData = {
  name: "Update",
  symbol: "UPDATE",
  description: "Update Description",
  sellerFeeBasisPoints: 100,
  imageFile: "success.png",
};

async function main() {
  // create a new connection to the cluster's API
  const connection = new Connection(clusterApiUrl("devnet"));

  // initialize a keypair for the user
  const user = await initializeKeypair(connection);

  console.log("PublicKey:", user.publicKey.toBase58());

  // metaplex set up
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );
  // upload the NFT data and get the URI for the metadata
  const uri_Unsafe = await uploadMetadataUnsafe(metaplex, nftData_Unsafe);
  const uri_Safe = await uploadMetadataSafe(metaplex, nftData_Safe);

  // create an NFT using the helper function and the URI from the metadata
  const nft_Unsafe = await createNftUnsafe(
    metaplex,
    uri_Unsafe,
    nftData_Unsafe
  );
  const nft_Safe = await createNftSafe(metaplex, uri_Safe, nftData_Safe);
}

// helper function to upload image and metadata
async function uploadMetadataUnsafe(
  metaplex: Metaplex,
  nftData: nftData_Unsafe
): Promise<string> {
  // file to buffer
  const buffer = fs.readFileSync("src/" + nftData.imageFile);

  // buffer to metaplex file
  const file = toMetaplexFile(buffer, nftData.imageFile);

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file);
  console.log("image uri:", imageUri);

  // upload metadata and get metadata uri (off chain metadata)
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: nftData.name,
    symbol: nftData.symbol,
    description: nftData.description,
    image: imageUri,
  });

  console.log("metadata uri:", uri);
  return uri;
}

async function uploadMetadataSafe(
  metaplex: Metaplex,
  nftData: nftData_Safe
): Promise<string> {
  // file to buffer
  const buffer = fs.readFileSync("src/" + nftData.imageFile);

  // buffer to metaplex file
  const file = toMetaplexFile(buffer, nftData.imageFile);

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file);
  console.log("image uri:", imageUri);

  // upload metadata and get metadata uri (off chain metadata)
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: nftData.name,
    symbol: nftData.symbol,
    description: nftData.description,
    image: imageUri,
  });

  console.log("metadata uri:", uri);
  return uri;
}

// helper function create NFT
async function createNftUnsafe(
  metaplex: Metaplex,
  uri: string,
  nftData: nftData_Unsafe
): Promise<NftWithToken> {
  const { nft } = await metaplex.nfts().create(
    {
      uri: uri, // metadata URI
      name: nftData.name,
      sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
      symbol: nftData.symbol,
    },
    { commitment: "finalized" }
  );

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );

  return nft;
}

async function createNftSafe(
  metaplex: Metaplex,
  uri: string,
  nftData: nftData_Safe
): Promise<NftWithToken> {
  const { nft } = await metaplex.nfts().create(
    {
      uri: uri, // metadata URI
      name: nftData.name,
      sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
      symbol: nftData.symbol,
    },
    { commitment: "finalized" }
  );

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );

  return nft;
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
