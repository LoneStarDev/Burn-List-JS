import { Metaplex, NftError } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

async function nft_Array_Sort() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = new Metaplex(connection);

  const wallet = "F7wfhMExqYNdgTUZz9web8CtCZELxaHCAZXXrbQbrVED";

  const solana_connection = new Connection(
    "https://api.devnet.solana.com"
    // "https://special-responsive-dinghy.solana-mainnet.discover.quiknode.pro/5158345c25d3630b3f69ba4d4b524822351941b1/"
  );

  const filters = [
    {
      //limiting the size to 165 - filtering
      dataSize: 165,
    },

    {
      //memory comparison - in 165 bytes at byte 32 we start(wallets start at 32nd place)
      memcmp: {
        offset: 32,
        bytes: wallet,
      },
    },
  ];

  const tokenAccounts = await solana_connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    { filters }
  );

  let unsafe_nft_array = [];
  let safe_nft_array = [];

  tokenAccounts.forEach(async (account, i) => {
    const parsedAccountInfo = account.account.data;
    //@ts-ignore
    const mintAddress = parsedAccountInfo?.parsed?.info?.mint;
    const newMintAddress = new PublicKey(mintAddress);

    // returns the nft object
    const nft = await metaplex
      .nfts()
      .findByMint({ mintAddress: newMintAddress });

    if (nft.json.description.includes("www")) {
      unsafe_nft_array.push(nft);
    } else {
      safe_nft_array.push(nft);
    }
  });
}

nft_Array_Sort();
main();
