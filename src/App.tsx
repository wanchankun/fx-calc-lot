import { useState } from 'react'

function App() {
  const [balance, setBalance] = useState(1000000);
  const [risk, setRisk] = useState(2);
  const [entryPrice, setEntryPrice] = useState(150.00);
  const [stopLossPrice, setStopLossPrice] = useState(149.80);
  // 通貨ペアのタイプを選択 (JPY: クロス円, USD: ドルストレート)
  const [pairType, setPairType] = useState<'JPY' | 'USD'>('JPY');

  const CONTRACT_SIZE = 1000; // 外為どっとコム仕様

  // pipsの計算をペアによって切り替える
  const multiplier = pairType === 'JPY' ? 100 : 10000;
  const pips = Math.abs(entryPrice - stopLossPrice) * multiplier;

  // ロット計算
  // ※ドルストレートの場合は本来「その時のドル円レート」での換算が必要ですが、
  // 簡易版として1pips=10円(クロス円同等)として計算するか、厳密にするならドル円入力が必要です。
  const lot = pips > 0 
    ? (balance * (risk / 100)) / (pips * (pairType === 'JPY' ? 0.01 : 0.0001) * (pairType === 'JPY' ? CONTRACT_SIZE : CONTRACT_SIZE * 150)) // 150は仮のドル円
    : 0;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', textAlign: 'center' }}>FXロット計算機</h1>
      
      <div style={{ marginBottom: '15px' }}>
        <label>通貨ペア形式: </label>
        <select value={pairType} onChange={e => setPairType(e.target.value as 'JPY' | 'USD')} style={{ width: '100%', padding: '8px' }}>
          <option value="JPY">クロス円 (USD/JPY, EUR/JPYなど)</option>
          <option value="USD">ドルストレート (EUR/USDなど)</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>口座残高 (円): </label>
        <input type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
        <label>エントリー価格: </label>
        <input type="number" step="0.00001" value={entryPrice} onChange={e => setEntryPrice(Number(e.target.value))} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <label>損切価格: </label>
        <input type="number" step="0.00001" value={stopLossPrice} onChange={e => setStopLossPrice(Number(e.target.value))} style={{ width: '100%', padding: '8px' }} />
      </div>

      <div style={{ textAlign: 'center', padding: '15px', borderTop: '2px solid #eee' }}>
        <p>損切り幅: <strong>{pips.toFixed(1)} pips</strong></p>
        <div style={{ backgroundColor: '#fff4f4', padding: '10px', borderRadius: '8px' }}>
          <h2 style={{ color: '#d32f2f', margin: '5px 0' }}>{Math.floor(lot).toLocaleString()} Lot</h2>
          <p style={{ fontSize: '0.8rem' }}>外為どっとコム推奨数量</p>
        </div>
      </div>
    </div>
  )
}

export default App