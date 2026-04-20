import { useState, useEffect } from 'react'

function App() {
  // --- データの復元機能 ---
  const getSavedValue = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  };

  const [balance, setBalance] = useState(() => getSavedValue('fx_balance', 1000000));
  const [risk, setRisk] = useState(() => getSavedValue('fx_risk', 2));
  const [entryPrice, setEntryPrice] = useState(() => getSavedValue('fx_entry', 150.00));
  const [stopLossPrice, setStopLossPrice] = useState(() => getSavedValue('fx_stop', 149.80));
  const [exitPrice, setExitPrice] = useState(() => getSavedValue('fx_exit', 150.40));
  const [pairType, setPairType] = useState<'JPY' | 'USD'>(() => getSavedValue('fx_pair', 'JPY'));

  // --- 自動保存 ---
  useEffect(() => {
    localStorage.setItem('fx_balance', JSON.stringify(balance));
    localStorage.setItem('fx_risk', JSON.stringify(risk));
    localStorage.setItem('fx_entry', JSON.stringify(entryPrice));
    localStorage.setItem('fx_stop', JSON.stringify(stopLossPrice));
    localStorage.setItem('fx_exit', JSON.stringify(exitPrice));
    localStorage.setItem('fx_pair', JSON.stringify(pairType));
  }, [balance, risk, entryPrice, stopLossPrice, exitPrice, pairType]);

  // --- 計算ロジック (外為どっとコム: 1Lot=1000通貨) ---
  const CONTRACT_SIZE = 1000;
  const multiplier = pairType === 'JPY' ? 100 : 10000;
  
  // 1. 損切り幅(pips)
  const slPips = Math.abs(entryPrice - stopLossPrice) * multiplier;
  
  // 2. 買い・売りの自動判定
  const isLong = entryPrice > stopLossPrice;
  
  // 3. 利益幅(pips)
  const tpPips = isLong 
    ? (exitPrice - entryPrice) * multiplier 
    : (entryPrice - exitPrice) * multiplier;

  // 4. 推奨ロット (リスク許容額 ÷ 損切時の1Lotあたり損失額)
  const lot = slPips > 0 
    ? (balance * (risk / 100)) / (slPips * 0.01 * CONTRACT_SIZE)
    : 0;
  const fixedLot = Math.floor(lot);

  // 5. 想定利益額
  const expectedProfit = fixedLot * CONTRACT_SIZE * (tpPips * 0.01);

  // 6. リスクリワード比 (利益幅 / 損切幅)
  const rrRatio = slPips > 0 ? (tpPips / slPips).toFixed(2) : "0.00";

  // --- スタイル定義 ---
  const theme = {
    bg: '#0f172a', cardBg: '#1e293b', border: '#334155',
    text: '#f8fafc', textMuted: '#94a3b8',
    primary: '#3b82f6', danger: '#ef4444', success: '#22c55e',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px', backgroundColor: '#0f172a', color: '#fff',
    border: `1px solid ${theme.border}`, borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: theme.textMuted, fontSize: '12px', marginBottom: '4px', fontWeight: 'bold'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', padding: '16px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <header style={{ width: '100%', maxWidth: '450px', textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '18px', margin: 0 }}>FX ロット & 利益計算機</h1>
        <div style={{ fontSize: '11px', color: theme.textMuted }}>外為どっとコム(1Lot=1000通貨) / 設定自動保存中</div>
      </header>

      <main style={{ width: '100%', maxWidth: '450px' }}>
        {/* 基本設定エリア */}
        <div style={{ backgroundColor: theme.cardBg, padding: '16px', borderRadius: '12px', marginBottom: '12px', border: `1px solid ${theme.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>通貨型</label>
              <select value={pairType} onChange={e => setPairType(e.target.value as 'JPY' | 'USD')} style={inputStyle}>
                <option value="JPY">円</option>
                <option value="USD">ドル</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>口座残高 (円)</label>
              <input type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>許容リスク ({risk}%)</label>
            <input type="range" min="0.1" max="10" step="0.1" value={risk} onChange={e => setRisk(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
        </div>

        {/* 価格入力エリア */}
        <div style={{ backgroundColor: theme.cardBg, padding: '16px', borderRadius: '12px', marginBottom: '12px', border: `1px solid ${theme.border}` }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>エントリー価格</label>
            <input type="number" step="0.001" value={entryPrice} onChange={e => setEntryPrice(Number(e.target.value))} style={{ ...inputStyle, borderLeft: `4px solid ${theme.primary}` }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>損切 (SL)</label>
              <input type="number" step="0.001" value={stopLossPrice} onChange={e => setStopLossPrice(Number(e.target.value))} style={{ ...inputStyle, borderLeft: `4px solid ${theme.danger}` }} />
            </div>
            <div>
              <label style={labelStyle}>利確 (TP)</label>
              <input type="number" step="0.001" value={exitPrice} onChange={e => setExitPrice(Number(e.target.value))} style={{ ...inputStyle, borderLeft: `4px solid ${theme.success}` }} />
            </div>
          </div>
        </div>

        {/* 結果表示エリア */}
        <div style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '16px', border: `2px solid ${theme.primary}`, textAlign: 'center' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>損切幅</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{slPips.toFixed(1)} <span style={{fontSize: '12px'}}>pips</span></div>
            </div>
            <div style={{ flex: 1, borderLeft: `1px solid ${theme.border}`, borderRight: `1px solid ${theme.border}` }}>
              <div style={labelStyle}>利益幅</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.success }}>+{tpPips.toFixed(1)} <span style={{fontSize: '12px'}}>pips</span></div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>R/R比</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: Number(rrRatio) >= 2 ? theme.success : '#fff' }}>{rrRatio}</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
            <div style={labelStyle}>推奨ロット数</div>
            <div style={{ color: theme.danger, fontSize: '42px', fontWeight: '900', lineHeight: 1 }}>
              {fixedLot.toLocaleString()}
              <span style={{ fontSize: '20px', color: '#fff', marginLeft: '4px' }}>Lot</span>
            </div>
            <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>({(fixedLot * CONTRACT_SIZE).toLocaleString()} 通貨)</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={labelStyle}>許容損失</div>
              <div style={{ color: theme.danger }}>-{(balance * (risk/100)).toLocaleString()}円</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={labelStyle}>想定利益</div>
              <div style={{ color: theme.success, fontSize: '20px', fontWeight: 'bold' }}>+{Math.floor(expectedProfit).toLocaleString()}円</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App