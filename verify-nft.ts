import {
  createNft,
  fetchDigitalAsset,
  findMetadataPda,
  mplTokenMetadata,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";

import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

console.log("got the user:", user.publicKey.toBase58());

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("setting up the Umi insatnce for the user");

const collectionAddress = publicKey(
  "Ag9FSPpxPfqBVSs5aJkzswBqv46vGjS6akyYJ7deJDjj"
);

const nftAddress = publicKey("BXHwmwdqGwX85AMJ1GGF2N3QyRw7ebHkS2ykEPCjHREd");

const transaction = await verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint: nftAddress }),
  collectionMint: collectionAddress,
  authority: umi.identity,
});

await transaction.sendAndConfirm(umi);

console.log(
  `✅ nft ${nftAddress} of collection${collectionAddress} is verified look at ${getExplorerLink(
    "address",
    nftAddress,
    "devnet"
  )} `
);
