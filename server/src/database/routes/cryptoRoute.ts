import express from "express";
import CoinGecko from "coingecko-api";
import { authJwt } from "./../middlewares/authJwtMiddleware";
import Crypto from "./../models/cryptoModel";
import { CryptoDataResponse, CryptoDataFailedResponse } from "./../CryptoCurrencyObjects";
import { getPeriodParams, filterPrices } from "./../CryptoPeriodUtils";

const router = express.Router();
const cgClient = new CoinGecko();
const reqParams = {
  localization: true,
  tickers: false,
  market_data: true,
  community_data: false,
  developer_data: false,
  sparkline: false
};

async function getCryptoData(code:string, currency:string):Promise<CryptoDataResponse|CryptoDataFailedResponse>
{
  const response = await cgClient.coins.fetch(code, reqParams);
  const marketData = response.data?.market_data;

  if (!response.success) {
    return (response);
  }
  return ({
    success: response.success,
    code: response.code,
    message: response.message,
    description: response.data.description.en,
    imageUrl: response.data.image.thumb,
    marketRank: response.data.market_cap_rank,
    creationDate: response.data.genesis_date,
    marketData: {
      current: marketData.current_price[currency],
      high: marketData.high_24h[currency],
      low: marketData.low_24h[currency],
      open: marketData.current_price[currency] + marketData.price_change_24h_in_currency[currency],
      price_change_percentage_24h: marketData.price_change_percentage_24h,
      lastUpdated: marketData.last_updated
    }
  });
}

router.get("/", async (req, res) =>
{
  const output:Array<CryptoDataResponse|CryptoDataFailedResponse> = [];
  const currency = (req.query["cur"] || req.query["currency"] || "eur") as string;
  const filter = (req.query["cmids"] || []) as string[];
  const cryptos = await Crypto.find({});

  try {
    for (let i = cryptos.length - 1; i >= 0; i--) {
      if (filter.find((code) => code === cryptos[i].code))
        output.push(await getCryptoData(cryptos[i].code, currency));
    }
    return (res.send({data: output}));
  }
  catch (err) {
    return (res.status(401).send({status: "error", message: "An unknown error occured."}));
  }
});

router.get("/:cmid", authJwt.verifyToken as any, async (req, res) =>
{
  const currency = (req.query["cur"] || req.query["currency"] || "eur") as string;
  const data = await getCryptoData(req.params.cmid, currency);
  const cryptos = await Crypto.find({code: req.params.cmid});

  if (cryptos.length === 0 || !data.success) {
    return (res.status(data.code).send({message: data.message}));
  }
  return (res.send({data}));
});

router.get("/:cmid/history/:period", authJwt.verifyToken as any, async (req, res) =>
{
  const currency = (req.query["cur"] || req.query["currency"] || "eur") as string;
  const params = getPeriodParams(req.params.period, currency);
  const cryptos = await Crypto.find({code: req.params.cmid});
  let response;

  if (!params)
    return res.status(404).send({message: "Period type not found."});
  if (cryptos.length === 0)
    return (res.status(404).send({message: "Cryptocurrency not found."}));
  response = await cgClient.coins.fetchMarketChartRange(req.params.cmid, params);
  if (!response.success)
    return (res.status(response.code).send({message: response.message}));
  return (res.send({
    prices: filterPrices(response.data.prices, req.params.period)
  }));
});

router.get("/all/codes", authJwt.isAdmin as any, async (req, res) =>
{
  req;
  res.send(await cgClient.coins.list());
});

router.get("/all/registered", authJwt.verifyToken as any, async (req, res) =>
{
  req;
  res.send({data: await Crypto.find({})});
});

router.post("/", authJwt.isAdmin as any, async (req, res) =>
{
  const crypto = new Crypto({
    code: req.body.code,
    name: req.body.name
  });
  const availableCryptos = await cgClient.coins.fetch(crypto.code, reqParams);
  let newCrypto;

  if (!availableCryptos.success)
    return (res.status(404).send({status: "error", message: "Currency code not found"}));
  try {
    newCrypto = await crypto.save();
    return (res.send({
      status: "ok",
      data: {
        _id: newCrypto.id,
        code: newCrypto.code,
        name: newCrypto.name
      }
    }));
  }
  catch(err) {
    return (res.status(401).send({status: "error", message: "Invalid name or code."}));
  }
});

router.delete("/:cmid", authJwt.isAdmin as any, async (req, res) =>
{
  try {
    await Crypto.deleteOne({code: req.params.cmid});
    return (res.status(204).send({}));
  }
  catch (err) {
    return (res.status(404).send({message: "Not found."}));
  }
});

export default router;