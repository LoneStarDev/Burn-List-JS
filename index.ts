import {
  Metaplex,
  Nft,
  NftError,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  ParsedAccountData,
  AccountInfo,
} from "@solana/web3.js";
import { AccountType, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import PromisePool from "@supercharge/promise-pool/dist";

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

  const tokenAccounts: {
    pubkey: PublicKey;
    account: AccountInfo<any>;
  }[] = await solana_connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters,
  });

  const unsafe_nft_array: Array<Sft | SftWithToken | Nft | NftWithToken> = [];
  const safe_nft_array: Array<Sft | SftWithToken | Nft | NftWithToken> = [];

  const re = /(https?:\/\/|www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#]\S*)?/g;

  const account_reducer = (
    acc: PublicKey[],
    accB: {
      pubkey: PublicKey;
      account: AccountInfo<any>;
    }
  ) => {
    if (Buffer.isBuffer(accB.account.data)) {
      return acc;
    }
    const newMintAddress = (accB.account.data as ParsedAccountData).parsed?.info
      ?.mint;
    if (!newMintAddress) {
      return acc;
    }
    acc.push(new PublicKey(newMintAddress));
    return acc;
  };

  const nft_accounts = tokenAccounts.reduce(account_reducer, []);

  await PromisePool.for(nft_accounts)
    .withConcurrency(10)
    .process(async (mintAddress) => {
      let nft = await metaplex.nfts().findByMint({ mintAddress });
      if (nft?.json?.description && re.test(nft.json.description)) {
        unsafe_nft_array.push(nft);
      } else {
        safe_nft_array.push(nft);
      }
    });

  console.log(unsafe_nft_array);
  console.log(safe_nft_array);
}

nft_Array_Sort();
