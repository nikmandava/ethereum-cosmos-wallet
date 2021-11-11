const express = require("express");
const router = express.Router();
const request = require("request");
const web3 = require("web3");
const converter = require("@hanchon/ethermint-address-converter");

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

module.exports = router;
