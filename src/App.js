import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [jobsPrice, setJobsPrice] = useState(null);

  const contractAddresses = {
    "FARTHER": "0x8ad5b9007556749DE59E088c88801a3Aaa87134B",
    "TYBG": "0x0d97F261b1e88845184f678e2d1e7a98D9FD38dE",
    "OPN": "0x9A6d24c02eC35ad970287eE8296D4D6552a31DbE",
    "MIGGLES": "0xB1a03EdA10342529bBF8EB700a06C60441fEf25d",
    "WTW": "0x88E2dA7B5dE075d4Cf4414e2D8162b51491461F8",
    "TERMINAL": "0xb488fCB23333e7bAA28D1dFd7B69a5D3a8BfeB3a",
    "TN100x": "0x5B5dee44552546ECEA05EDeA01DCD7Be7aa6144A",
    "BORED": "0x70737489DFDf1A29b7584d40500d3561bD4Fe196",
    "TREE": "0x6888c2409D48222E2CB738eB5a805A522a96CE80",
    "BUILD": "0x3C281A39944a2319aA653D81Cfd93Ca10983D234",
    "REFI": "0x7dbdBF103Bb03c6bdc584c0699AA1800566f0F84",
    "BLEU": "0xBf4Db8b7A679F89Ef38125d5F84dd1446AF2ea3B",
    "HIGHER": "0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe"
  };

  const jobsContractAddress = "0xd21111c0e32df451eb61A23478B438e3d71064CB";

  useEffect(() => {
    fetch('/calculate_all')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });

    fetch(`https://api.dexscreener.com/latest/dex/tokens/${jobsContractAddress}`)
      .then((response) => response.json())
      .then((priceData) => {
        const price = priceData.pairs[0]?.priceUsd || null;
        setJobsPrice(price);
      })
      .catch((error) => console.error("Error fetching JOBS price:", error));
  }, []);

  return (
    <div className="App">
      <h1 className="centered-text">Quick Math (by capy)</h1>
      <p className="calculation-note">All calculations are made with the amount of tokens equivalent to 10$ spent on them right now.</p>
      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Buy</th>
            <th>$JOBS per hour</th>
            <th>$JOBS in USD</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coinData, index) => (
            <tr key={coinData.coin} style={{ backgroundColor: getGradientColor(index, data.length) }}>
              <td>{coinData.coin}</td>
              <td><a href={`https://dexscreener.com/base/${contractAddresses[coinData.coin]}`} target="_blank" rel="noopener noreferrer">click to buy</a></td>
              <td className="bold-text">{coinData.jobs_per_hour.toFixed(6)}</td>
              <td>
                {jobsPrice 
                  ? (coinData.jobs_per_hour * jobsPrice).toFixed(6)
                  : 'Loading...'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="footer-note">
        Keep in mind, after your purchase the profitability drops immediately.<br/>
        Also consider the price impact on low-liquidity coins.
      </p>
      <p className="footer-note delay-note">
        The page is not loading - don't worry. The author has no money for the server. Wait 20 seconds.
      </p>
    </div>
  );
}

function getGradientColor(index, total) {
  const ratio = index / total;

  const startColor = { r: 0, g: 255, b: 0 };  // Зеленый
  const middleColor = { r: 255, g: 255, b: 0 };  // Желтый
  const endColor = { r: 255, g: 0, b: 0 };  // Красный

  let r, g, b;

  if (ratio <= 0.5) {
    const halfRatio = ratio * 2;
    r = Math.round(startColor.r + (middleColor.r - startColor.r) * halfRatio);
    g = Math.round(startColor.g + (middleColor.g - startColor.g) * halfRatio);
    b = Math.round(startColor.b + (middleColor.b - startColor.b) * halfRatio);
  } else {
    const halfRatio = (ratio - 0.5) * 2;
    r = Math.round(middleColor.r + (endColor.r - middleColor.r) * halfRatio);
    g = Math.round(middleColor.g + (endColor.g - middleColor.g) * halfRatio);
    b = Math.round(middleColor.b + (endColor.b - middleColor.b) * halfRatio);
  }

  return `rgb(${r}, ${g}, ${b}, 0.6)`;
}

export default App;
