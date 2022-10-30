//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
    address public cryptoDevTokenAddress;

    constructor(address _cryptoDevToken) ERC20("CryptoDev LP Token", "CDLP") {
        require(
            _cryptoDevToken != address(0),
            "Token address passed is a null address"
        );
        cryptoDevTokenAddress = _cryptoDevToken;
    }

    function getReserve() public view returns (uint256) {
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }

    function addLiquidity(uint256 _amount) public payable returns (uint256) {
        uint256 liquidity;
        uint256 ethBalance = address(this).balance;
        uint256 cryptoDevTokenReserve = getReserve();
        ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);

        if (cryptoDevTokenReserve == 0) {
            cryptoDevToken.transferFrom(msg.sender, address(this), _amount);
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        } else {
            uint256 ethReserve = ethBalance - msg.value;
            uint256 cryptoDevTokenAmount = (msg.value * cryptoDevTokenReserve) /
                ethReserve;
            require(
                _amount >= cryptoDevTokenAmount,
                "Amount of tokens sent is less than the minimum tokens required"
            );
            cryptoDevToken.transferFrom(
                msg.sender,
                address(this),
                cryptoDevTokenAmount
            );
            liquidity = (totalSupply() * msg.value) / ethReserve;
            _mint(msg.sender, liquidity);
        }
        return liquidity;
    }

    function removeLiquidity(uint256 _amount)
        public
        returns (uint256, uint256)
    {
        require(_amount >= 0, "_amount should be greater than zero");
        uint256 ethReserve = address(this).balance;
        uint256 totalSupplyOfLPTokens = totalSupply();

        uint256 ethAmount = (_amount * ethReserve) / totalSupplyOfLPTokens;
        uint256 cryptoDevTokenAmount = (_amount * getReserve()) /
            totalSupplyOfLPTokens;
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(ethAmount);
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount);
        return (ethAmount, cryptoDevTokenAmount);
    }

    function getAmountOfTokens(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        uint256 inputAmountAfterFee = inputAmount * 99;
        uint256 numerator = inputAmountAfterFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountAfterFee;
        return numerator / denominator;
    }

    function ethToCryptoDevToken(uint256 _mintTokens) public payable {
        uint256 tokenReserve = getReserve();
        uint256 tokensCouldBeBought = getAmountOfTokens(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );

        require(
            tokensCouldBeBought >= _mintTokens,
            "insufficient output amount"
        );
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, tokensCouldBeBought);
    }

    function cyrptoDevTokenToEth(uint256 _tokenSold, uint256 _minEth) public {
        uint256 tokenReserve = getReserve();
        uint256 ethCouldBeBought = getAmountOfTokens(
            _tokenSold,
            tokenReserve,
            address(this).balance
        );
        require(ethCouldBeBought >= _minEth, "insufficient output amount");
        ERC20(cryptoDevTokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokenSold
        );
        payable(msg.sender).transfer(ethCouldBeBought);
    }
}
