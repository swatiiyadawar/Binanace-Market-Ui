import React, { useState } from 'react';
import { ArrowUpDown, Wallet, Activity, Clock, TrendingUp } from 'lucide-react';
import { useCryptoWebSocket } from './hooks/useCryptoWebSocket';
import CryptoChart from './components/CryptoChart';
import TimeframeSelector from './components/TimeframeSelector';
import PairSelector from './components/PairSelector';

const TRADING_PAIRS = [
  { symbol: 'ETHUSDT', name: 'ETH/USDT', icon: '⟠' },
  { symbol: 'BNBUSDT', name: 'BNB/USDT', icon: '⟡' },
  { symbol: 'DOTUSDT', name: 'DOT/USDT', icon: '◉' },
];

const TIMEFRAMES = [
  { value: '1m', label: '1m' },
  { value: '3m', label: '3m' },
  { value: '5m', label: '5m' },
];

function App() {
  const [selectedPair, setSelectedPair] = useState(TRADING_PAIRS[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[0]);
  const { candlesticks, isConnected, error } = useCryptoWebSocket(selectedPair.symbol, selectedTimeframe.value);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Crypto Live Charts</h1>
                <p className="text-sm text-gray-400">Real-time market data</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="bg-gray-700/50 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <PairSelector
            pairs={TRADING_PAIRS}
            selectedPair={selectedPair}
            onSelect={setSelectedPair}
          />
          <TimeframeSelector
            timeframes={TIMEFRAMES}
            selectedTimeframe={selectedTimeframe}
            onSelect={setSelectedTimeframe}
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedPair.icon}</span>
                  <h2 className="text-2xl font-bold">{selectedPair.name}</h2>
                </div>
                <p className="text-gray-400 mt-1">
                  Real-time candlestick chart • {selectedTimeframe.label} timeframe
                </p>
              </div>
            </div>
            <CryptoChart 
              symbol={selectedPair.symbol} 
              data={candlesticks}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;