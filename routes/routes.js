const express = require("express");
const router = express.Router();
const request = require("request");
const Web3 = require("web3");
const converter = require("@hanchon/ethermint-address-converter");
const axios = require("axios");

router.get("/", (req, res) => {
  res.status(200).json({
    body: "Hello from the server!",
  });
});

router.get("/ethBalance/:address", (req, res) => {
  var headers = {
    "Content-Type": "application/json",
  };

  console.log(req.params.address);

  const address = req.params.address;

  var dataString =
    '{"jsonrpc":"2.0","method":"eth_getBalance","params":["' +
    address +
    '", "latest"],"id":1}';

  var options = {
    url: "http://arsiamons.rpc.evmos.org:8545",
    method: "POST",
    headers: headers,
    body: dataString,
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      let weiBalance = JSON.parse(body)["result"];
      let ethBalance = web3.utils.fromWei(weiBalance, "ether");
      res.status(200).json({ amount: ethBalance });
    } else {
      res.status(400).json(response);
    }
  }

  request(options, callback);
});

router.get("/ethTransactions", (req, res) => {
  var headers = {
    "Content-Type": "application/json",
  };

  var dataString =
    '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}';

  var options = {
    url: "http://arsiamons.rpc.evmos.org:8545",
    method: "POST",
    headers: headers,
    body: dataString,
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      let lastBlockNumber = JSON.parse(body)["result"];
      console.log(lastBlockNumber);

      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  }

  request(options, callback);
});

router.get("/ethToEthermint/:address", (req, res) => {
  let address = req.params.address;
  let evmosAddress = converter.ethToEvmos(address);

  res.status(200).json({ address: evmosAddress });
});

router.get("/ethermintToEth/:address", (req, res) => {
  let address = req.params.address;
  let ethAddress = converter.evmosToEth(address);

  res.status(200).json({ address: ethAddress });
});

router.get("/getCosmosCoins/:evmosAddress", (req, res, next) => {
  let evmosAddress = req.params.evmosAddress;

  axios
    .get("http://localhost:1317/cosmos/bank/v1beta1/balances/" + evmosAddress)
    .then((body) => res.status(200).json(body.data.balances))
    .catch((err) => res.status(400).json(err));
});

router.get(
  "/getERC20Token/:ethAddress/:tokenAddress",
  async (req, res, next) => {
    try {
      let ethAddress = req.params.ethAddress;
      let tokenAddress = req.params.tokenAddress;

      // ABI to get ERC20 Token balance and auxiliary fields
      let ABI = [
        // balanceOf
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        },
        // decimals
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ name: "", type: "uint8" }],
          type: "function",
        },
        // name
        {
          constant: true,
          inputs: [],
          name: "name",
          outputs: [{ name: "", type: "string" }],
          type: "function",
        },
        // symbol
        {
          constant: true,
          inputs: [],
          name: "symbol",
          outputs: [{ name: "", type: "string" }],
          type: "function",
        },
      ];

      var web3 = new Web3(
        new Web3.providers.HttpProvider(
          "https://mainnet.infura.io/v3/fe692c00cc5c4400a2c551d02752ec4e"
        )
      );

      let contract = new web3.eth.Contract(ABI, tokenAddress);

      let balance = await contract.methods.balanceOf(ethAddress).call();
      let decimals = await contract.methods.decimals().call();
      let adjustedBalance = balance / Math.pow(10, decimals);

      let tokenName = await contract.methods.name().call();

      let tokenSymbol = await contract.methods.symbol().call();

      res.status(200).json({
        name: tokenName,
        symbol: tokenSymbol,
        amount: adjustedBalance,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
);

module.exports = router;
