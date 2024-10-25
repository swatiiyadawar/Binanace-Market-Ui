import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface TradingPair {
  symbol: string;
  name: string;
  icon: string;
}

interface Props {
  pairs: TradingPair[];
  selectedPair: TradingPair;
  onSelect: (pair: TradingPair) => void;
}

const PairSelector: React.FC<Props> = ({ pairs, selectedPair, onSelect }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <ArrowUpDown className="w-5 h-5 text-gray-400" />
        <span className="text-gray-400 font-medium">Trading Pair</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {pairs.map((pair) => (
          <button
            key={pair.symbol}
            onClick={() => onSelect(pair)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
              ${selectedPair.symbol === pair.symbol
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-900/25'
              }
            `}
          >
            <span>{pair.icon}</span>
            <span>{pair.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PairSelector;