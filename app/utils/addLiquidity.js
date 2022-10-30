import { Contract, utils } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";

export const addLiquidity = async (
  signer,
  addCDTokenAmountWei,
  addEthAmountWei
) => {
  try {
    const tokenContract = new Contract(
      TOKEN_CONTRACT_ADDRESS,
      TOKEN_CONTRACT_ABI,
      signer
    );
    const exchangeContranct = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      signer
    );

    let txn = await tokenContract.approve(
      EXCHANGE_CONTRACT_ADDRESS,
      addCDTokenAmountWei.toString()
    );
    await txn.wait();

    txn = await exchangeContranct.addLiquidity(addCDTokenAmountWei, {
      value: addEthAmountWei,
    });

    await txn.wait();
  } catch (error) {
    console.error(error);
  }
};

export const calculateCD = (
  addEther = "0",
  exConEthBalance,
  exConCDTokenReserve
) => {
  const addEthAmountWei = utils.parseEther(addEther);
  const cryptoDevTokenAmount = addEthAmountWei
    .mul(exConCDTokenReserve)
    .div(exConEthBalance);
  return cryptoDevTokenAmount;
};
