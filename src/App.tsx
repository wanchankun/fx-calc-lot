import { useState, useEffect } from 'react';
import { 
  Container, Paper, Text, NumberInput, Select, 
  Slider, Stack, Group, Divider, Title, Box 
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks'; // 保存もMantineの機能で楽になります

function App() {
  // Mantineのhooksを使ってローカルストレージと同期
  const [balance, setBalance] = useLocalStorage({ key: 'fx-balance', defaultValue: 1000000 });
  const [risk, setRisk] = useLocalStorage({ key: 'fx-risk', defaultValue: 2.0 });
  const [entry, setEntry] = useLocalStorage({ key: 'fx-entry', defaultValue: 150.00 });
  const [sl, setSl] = useLocalStorage({ key: 'fx-sl', defaultValue: 149.80 });
  const [tp, setTp] = useLocalStorage({ key: 'fx-tp', defaultValue: 150.40 });
  const [pairType, setPairType] = useLocalStorage({ key: 'fx-pair', defaultValue: 'JPY' });

  // --- 計算ロジック ---
  const CONTRACT_SIZE = 1000;
  const multiplier = pairType === 'JPY' ? 100 : 10000;
  const slPips = Math.abs(entry - sl) * multiplier;
  const isLong = entry > sl;
  const tpPips = isLong ? (tp - entry) * multiplier : (entry - tp) * multiplier;
  
  const lot = slPips > 0 ? (balance * (risk / 100)) / (slPips * 0.01 * CONTRACT_SIZE) : 0;
  const fixedLot = Math.floor(lot);
  const expectedProfit = fixedLot * CONTRACT_SIZE * (tpPips * 0.01);
  const rrRatio = slPips > 0 ? (tpPips / slPips).toFixed(2) : "0.00";

  return (
    <Container size="xs" py="xl">
      <Stack gap="md">
        <Box ta="center">
          <Title order={2}>FX Lot Calculator</Title>
          <Text size="xs" c="dimmed">外為どっとコム仕様 (1Lot=1,000通貨)</Text>
        </Box>

        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <Group grow>
              <Select
                label="通貨型"
                data={[{ label: '円', value: 'JPY' }, { label: 'ドル', value: 'USD' }]}
                value={pairType}
                onChange={(val) => setPairType(val || 'JPY')}
              />
              <NumberInput
                label="口座残高"
                value={balance}
                onChange={(val) => setBalance(Number(val))}
                thousandSeparator=","
              />
            </Group>
            <Box>
              <Text size="sm" fw={500} mb={5}>許容リスク: {risk}%</Text>
              <Slider value={risk} onChange={setRisk} min={0.1} max={10} step={0.1} />
            </Box>
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <NumberInput label="エントリー価格" value={entry} onChange={(val) => setEntry(Number(val))} decimalScale={3} />
            <Group grow>
              <NumberInput label="損切 (SL)" value={sl} onChange={(val) => setSl(Number(val))} decimalScale={3} styles={{ input: { borderLeft: '4px solid red' } }} />
              <NumberInput label="利確 (TP)" value={tp} onChange={(val) => setTp(Number(val))} decimalScale={3} styles={{ input: { borderLeft: '4px solid green' } }} />
            </Group>
          </Stack>
        </Paper>

        <Paper withBorder p="xl" radius="lg" shadow="md" style={{ border: '2px solid #3b82f6' }}>
          <Stack align="center" gap="xs">
            <Group grow w="100%" ta="center">
              <Box>
                <Text size="xs" c="dimmed">損切幅</Text>
                <Text fw={700}>{slPips.toFixed(1)} pips</Text>
              </Box>
              <Box style={{ borderLeft: '1px solid #334155', borderRight: '1px solid #334155' }}>
                <Text size="xs" c="dimmed">利益幅</Text>
                <Text fw={700} c="green">+{tpPips.toFixed(1)} pips</Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">R/R比</Text>
                <Text fw={700}>{rrRatio}</Text>
              </Box>
            </Group>

            <Divider w="100%" my="sm" />

            <Text size="sm" c="dimmed">推奨発注数量</Text>
            <Title order={1} c="red" fz={48}>{fixedLot.toLocaleString()} <Text span fz={20} c="white">Lot</Text></Title>
            
            <Text size="xl" fw={700} c="green" mt="sm">
              想定利益: +{Math.floor(expectedProfit).toLocaleString()} 円
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default App;