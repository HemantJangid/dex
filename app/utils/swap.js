import { Contract } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";

export const getAmountOfTokensReceivedFromSwap = async (
  swapAmountWei,
  provider,
  ethSelected,
  exConEthBalance,
  exConCDTokenReserve
) => {
  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    provider
  );
  let amountOfTokens;
  if (ethSelected) {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      swapAmountWei,
      exConEthBalance,
      exConCDTokenReserve
    );
  } else {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      swapAmountWei,
      exConCDTokenReserve,
      exConEthBalance
    );
  }

  return amountOfTokens;
};

export const swapTokens = async (
  signer,
  swapAmountWei,
  tokenToBeReceivedAfterSwap,
  ethSelected
) => {
  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    signer
  );
  const tokenContract = new Contract(
    TOKEN_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    signer
  );

  let txn;

  if (ethSelected) {
    txn = await exchangeContract.ethToCryptoDevToken(
      tokenToBeReceivedAfterSwap,
      { value: swapAmountWei }
    );
  } else {
    txn = await tokenContract.approve(
      EXCHANGE_CONTRACT_ADDRESS,
      swapAmountWei.toString()
    );
    await txn.wait();

    txn = await exchangeContract.cyrptoDevTokenToEth(
      swapAmountWei,
      tokenToBeReceivedAfterSwap
    );
  }

  await txn.wait();
};
