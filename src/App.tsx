import { useState } from 'react'

function App() {
  const [balance, setBalance] = useState(1000000); // 口座残高
  const [risk, setRisk] = useState(2);           // 許容リスク(%)
  const [pips, setPips] = useState(20);          // 損切り幅(pips)

  // ロット計算 (1ロット=10万通貨、クロス円想定)
  const lot = (balance * (risk / 100)) / (pips * 0.01 * 100000);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>FX Lot Calculator</h1>
      <div>
        <label>口座残高 (円): </label>
        <input type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} />
      </div>
      <div>
        <label>許容リスク (%): </label>
        <input type="number" value={risk} onChange={e => setRisk(Number(e.target.value))} />
      </div>
      <div>
        <label>損切り幅 (pips): </label>
        <input type="number" value={pips} onChange={e => setPips(Number(e.target.value))} />
      </div>
      <hr />
      <h2>推奨ロット数: <span style={{ color: 'red' }}>{lot.toFixed(2)}</span> Lot</h2>
      <p>リスク許容額: {(balance * (risk / 100)).toLocaleString()} 円</p>
    </div>
  )
}

export default App