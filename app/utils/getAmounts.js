import { Contract } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";

export const getEtherBalance = async (
  provider,
  address,
  isContract = false
) => {
  try {
    if (isContract) return await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);

    return await provider.getBalance(address);
  } catch (error) {
    console.error(error);
  }
};

export const getCDTokensBalance = async (provider, address) => {
  try {
    const tokenContract = new Contract(
      TOKEN_CONTRACT_ADDRESS,
      TOKEN_CONTRACT_ABI,
      provider
    );
    return await tokenContract.balanceOf(address);
  } catch (error) {
    console.error(error);
  }
};

export const getLPTokensBalance = async (provider, address) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );
    return await exchangeContract.balanceOf(address);
  } catch (error) {
    console.error(error);
  }
};

export const getReserveOfCDTokens = async (provider) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );
    return await exchangeContract.getReserve();
  } catch (error) {
    console.error(error);
  }
};
