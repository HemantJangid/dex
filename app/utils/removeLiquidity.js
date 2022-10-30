import { Contract } from "ethers";
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS } from "../constants";

export const removeLiquidity = async (signer, removeLPTokensWei) => {
  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    signer
  );
  let txn = await exchangeContract.removeLiquidity(removeLPTokensWei);
  await txn.wait();
};

export const getTokensAfterRemove = async (
  provider,
  removeLPTokensWei,
  exConEthBalance,
  exConCDTokenReserve
) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      signer
    );
    const totalSupply = await exchangeContract.totalSupply();
    const ethAmountToBeReceived = exConEthBalance
      .mul(removeLPTokensWei)
      .div(totalSupply);
    const cdTokenToBeReceived = exConCDTokenReserve
      .mul(removeLPTokensWei)
      .div(totalSupply);
    return { ethAmountToBeReceived, cdTokenToBeReceived };
  } catch (error) {
    console.log(error);
  }
};
