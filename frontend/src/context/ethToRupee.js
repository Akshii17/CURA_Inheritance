export const fetchEthPriceINR = async () => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
  );

  const data = await res.json();
  return data.ethereum.inr;
};  