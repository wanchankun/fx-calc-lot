import { useState } from 'react'

function App() {
  // --- 状態管理 ---
  const [balance, setBalance] = useState(1000000);
  const [risk, setRisk] = useState(2);
  const [entryPrice, setEntryPrice] = useState(150.00);
  const [stopLossPrice, setStopLossPrice] = useState(149.80);
  const [pairType, setPairType] = useState<'JPY' | 'USD'>('JPY');

  // --- 計算ロジック (外為どっとコム仕様) ---
  const CONTRACT_SIZE = 1000;
  const multiplier = pairType === 'JPY' ? 100 : 10000;
  const pips = Math.abs(entryPrice - stopLossPrice) * multiplier;
  
  // ドルストレートの場合は厳密にはドル円換算が必要だが、
  // 簡易版としてクロス円と同じ損益計算(1pips=10円)として扱う
  const lot = pips > 0 
    ? (balance * (risk / 100)) / (pips * 0.01 * CONTRACT_SIZE)
    : 0;

  // --- 統一デザインの定義 (テーマ) ---
  const theme = {
    bg: '#121418',       // 全体の背景色 (ダークグレー)
    cardBg: '#1e2229',   // 入力・結果エリアの背景色
    border: '#343a46',   // 枠線の色
    text: '#ffffff',     // メインの文字色
    textMuted: '#94a3b8',// 薄い文字色 (ラベル用)
    primary: '#3b82f6',  // アクセントカラー (青)
    danger: '#ef4444',   // ロット数の赤色
  };

  // --- 共通のスタイル部品 ---
  const commonInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    backgroundColor: theme.bg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    fontSize: '16px', // スマホでズームされないサイズ
    boxSizing: 'border-box',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: theme.textMuted,
    fontSize: '14px',
    marginBottom: '6px',
    fontWeight: '500',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.cardBg,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${theme.border}`,
    marginBottom: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  return (
    // 全体のコンテナ (ダーク背景)
    <div style={{
      backgroundColor: theme.bg,
      color: theme.text,
      minHeight: '100vh', // 画面いっぱいに広げる
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // 中央寄せ
    }}>
      
      {/* ヘッダーエリア */}
      <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
          FXロット計算機
        </h1>
        <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>
          外為どっとコム仕様 (1Lot=1,000通貨)
        </p>
      </div>

      {/* メインエリア (入力フォーム群) */}
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        {/* 通貨形式 & 残高セクション */}
        <div style={cardStyle}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>通貨ペア形式</label>
            <select 
              value={pairType} 
              onChange={e => setPairType(e.target.value as 'JPY' | 'USD')} 
              style={{...commonInputStyle, ...{ color: theme.primary, fontWeight: '600' } }} // プルダウン文字を青に
            >
              <option value="JPY">クロス円 (USD/JPY, EUR/JPYなど)</option>
              <option value="USD">ドルストレート (EUR/USDなど)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>口座残高 (円)</label>
            <input 
              type="number" 
              value={balance} 
              onChange={e => setBalance(Number(e.target.value))} 
              style={commonInputStyle} 
              placeholder="1,000,000"
            />
          </div>
        </div>

        {/* リスク & 価格設定セクション */}
        <div style={cardStyle}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>許容リスク (%)</label>
            <input 
              type="number" 
              value={risk} 
              onChange={e => setRisk(Number(e.target.value))} 
              style={commonInputStyle}
              placeholder="2"
            />
          </div>
          
          {/* 価格入力エリア (少し区切りを入れる) */}
          <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>エントリー価格</label>
              <input 
                type="number" 
                step="0.001" 
                value={entryPrice} 
                onChange={e => setEntryPrice(Number(e.target.value))} 
                style={commonInputStyle} 
                placeholder="150.000"
              />
            </div>
            <div>
              <label style={labelStyle}>損切価格</label>
              <input 
                type="number" 
                step="0.001" 
                value={stopLossPrice} 
                onChange={e => setStopLossPrice(Number(e.target.value))} 
                style={commonInputStyle} 
                placeholder="149.800"
              />
            </div>
          </div>
        </div>

        {/* --- 計算結果セクション (ここが一番大事！) --- */}
        <div style={{...cardStyle, ...{ border: `2px solid ${theme.primary}` }}}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: theme.textMuted, fontSize: '14px', margin: '0 0 16px 0' }}>
              損切り幅: <strong style={{color: theme.text, fontSize: '16px'}}>{pips.toFixed(1)} pips</strong>
            </p>
            
            {/* Lot数表示エリア */}
            <div style={{ backgroundColor: theme.bg, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
              <span style={{ fontSize: '13px', color: theme.textMuted }}>推奨ロット数</span>
              <h2 style={{ 
                color: theme.danger, 
                fontSize: '40px', // 特大サイズ
                fontWeight: '800', 
                margin: '4px 0', 
                letterSpacing: '-1px' 
              }}>
                {Math.floor(lot).toLocaleString()}
                <span style={{ fontSize: '20px', color: theme.text, fontWeight: '500', marginLeft: '4px' }}>Lot</span>
              </h2>
              <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>
                ({ (Math.floor(lot) * CONTRACT_SIZE).toLocaleString() } 通貨)
              </p>
            </div>

            {/* リスク額 */}
            <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '12px', marginBottom: 0 }}>
              リスク許容額: { (balance * (risk / 100)).toLocaleString() } 円
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App