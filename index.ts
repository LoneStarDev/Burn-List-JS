import { Metaplex, NftError } from "@metaplex-foundation/js";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  GetProgramAccountsFilter,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = new Metaplex(connection);

  const solana_connection = new Connection(
    "https://api.devnet.solana.com"
    // "https://special-responsive-dinghy.solana-mainnet.discover.quiknode.pro/5158345c25d3630b3f69ba4d4b524822351941b1/"
  );
}

async function sort_nft(metaplex: Metaplex) {
  const wallet = "F7wfhMExqYNdgTUZz9web8CtCZELxaHCAZXXrbQbrVED";
  const filters: GetProgramAccountsFilter[] = [
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

  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID, //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    { filters: filters }
  );
}

main();
