interface PeriodParameters
{
  from:number;
  to:number;
  vs_currency:string;
}

enum PeriodType
{
  Weekly = "weekly",
  Daily = "daily",
  Hourly = "hourly",
  Minute = "minute"
}

const periods = new Map<PeriodType, {period:number, from:number}>([
  [PeriodType.Weekly, {
    period: 60 * 60 * 24 * (7 * 60),
    from: 60 * 60 * 24 * (7 * 60)
  }],
  [PeriodType.Daily, {
    period: 60 * 60 * 24 * 60,
    from: 60 * 60 * 24 * 100
  }],
  [PeriodType.Hourly, {
    period: 60 * 60 * 48,
    from: 60 * 60 * 48
  }],
  [PeriodType.Minute, {
    period: 60 * 60 * 2,
    from: 60 * 60 * 2
  }]
]);

export function getPeriodParams(period:string, currency:string):PeriodParameters|undefined
{
  const res = periods.get(period as PeriodType);

  if (!res)
    return (undefined);
  return ({
    from: ~~(Date.now() / 1000) - res.from,
    to: ~~(Date.now() / 1000),
    vs_currency: currency
  });
}

export function filterPrices(prices:number[][], period:string)
{
  const res = periods.get(period as PeriodType);
  const date = Date.now();

  if (!res)
    return (prices);
  prices = prices.filter((price) => price[0] > date - res.period * 1000);
  return (prices.map((price) => {
    price[0] = ~~(price[0] / 1000);
    return (price);
  }));
}