import { useState } from 'react'

function App() {
  const [balance, setBalance] = useState(1000000); // 口座残高
  const [risk, setRisk] = useState(2);           // 許容リスク(%)
  const [entryPrice, setEntryPrice] = useState(150.00); // エントリー価格
  const [stopLossPrice, setStopLossPrice] = useState(149.80); // 損切価格

  // 外為どっとコムの1ロット単位（1,000通貨）
  const CONTRACT_SIZE = 1000;

  // pipsの計算 (クロス円想定: 価格差 × 100)
  const pips = Math.abs(entryPrice - stopLossPrice) * 100;

  // ロット計算 (外為どっとコム仕様: 1ロット=1,000通貨)
  // リスク許容額 ÷ (pips単位の損失額 × 1ロットあたりの通貨数)
  const lot = pips > 0 
    ? (balance * (risk / 100)) / (pips * 0.01 * CONTRACT_SIZE) 
    : 0;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', textAlign: 'center' }}>FXロット計算機</h1>
      <p style={{ fontSize: '0.8rem', textAlign: 'center', color: '#666' }}>※外為どっとコム仕様 (1Lot=1,000通貨)</p>
      
      <div style={{ marginBottom: '15px' }}>
        <label>口座残高 (円): </label>
        <input type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>許容リスク (%): </label>
        <input type="number" value={risk} onChange={e => setRisk(Number(e.target.value))} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>エントリー価格: </label>
          <input type="number" step="0.001" value={entryPrice} onChange={e => setEntryPrice(Number(e.target.value))} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label>損切価格: </label>
          <input type="number" step="0.001" value={stopLossPrice} onChange={e => setStopLossPrice(Number(e.target.value))} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', padding: '15px', borderTop: '2px solid #eee' }}>
        <p style={{ margin: '5px 0' }}>損切り幅: <strong>{pips.toFixed(1)} pips</strong></p>
        <p style={{ margin: '5px 0' }}>リスク許容額: <strong>{ (balance * (risk / 100)).toLocaleString() } 円</strong></p>
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff4f4', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.9rem' }}>推奨発注数量</span>
          <h2 style={{ color: '#d32f2f', margin: '5px 0' }}>{Math.floor(lot).toLocaleString()} Lot</h2>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>({ (Math.floor(lot) * CONTRACT_SIZE).toLocaleString() } 通貨)</span>
        </div>
      </div>
    </div>
  )
}

export default App