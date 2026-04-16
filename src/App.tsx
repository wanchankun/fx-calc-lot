import { useState } from 'react'

function App() {
  const [balance, setBalance] = useState(1000000);
  const [risk, setRisk] = useState(2);
  const [entryPrice, setEntryPrice] = useState(150.00);
  const [stopLossPrice, setStopLossPrice] = useState(149.80);
  const [pairType, setPairType] = useState<'JPY' | 'USD'>('JPY');

  const CONTRACT_SIZE = 1000;

  const multiplier = pairType === 'JPY' ? 100 : 10000;
  const pips = Math.abs(entryPrice - stopLossPrice) * multiplier;

  const lot = pips > 0 
    ? (balance * (risk / 100)) / (pips * (pairType === 'JPY' ? 0.01 : 0.0001) * (pairType === 'JPY' ? CONTRACT_SIZE : CONTRACT_SIZE * 150))
    : 0;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.2rem', textAlign: 'center' }}>FXロット計算機</h1>
      
      <div style={{ marginBottom: '10px' }}>
        <label>通貨形式: </label>
        <select value={pairType} onChange={e => setPairType(e.target.value as 'JPY' | 'USD')} style={{ width: '100%', padding: '5px' }}>
          <option value="JPY">クロス円</option>
          <option value="USD">ドルストレート</option>
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>残高: </label>
        <input type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} style={{ width: '100%', padding: '5px' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>リスク (%): </label>
        <input type="number" value={risk} onChange={e => setRisk(Number(e.target.value))} style={{ width: '100%', padding: '5px' }} />
      </div>

      <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <label>エントリー: </label>
        <input type="number" step="0.001" value={entryPrice} onChange={e => setEntryPrice(Number(e.target.value))} style={{ width: '100%', padding: '5px' }} />
        <label>損切価格: </label>
        <input type="number" step="0.001" value={stopLossPrice} onChange={e => setStopLossPrice(Number(e.target.value))} style={{ width: '100%', padding: '5px' }} />
      </div>

      <div style={{ textAlign: 'center', borderTop: '1px solid #eee', marginTop: '10px' }}>
        <p>損切り幅: {pips.toFixed(1)} pips</p>
        <div style={{ backgroundColor: '#fff4f4', padding: '10px' }}>
          <h2 style={{ color: '#d32f2f' }}>{Math.floor(lot).toLocaleString()} Lot</h2>
          <p style={{ fontSize: '0.7rem' }}>外為どっとコム仕様</p>
        </div>
      </div>
    </div>
  )
}

export default App