import React from 'react';
import { Clock } from 'lucide-react';

interface Timeframe {
  value: string;
  label: string;
}

interface Props {
  timeframes: Timeframe[];
  selectedTimeframe: Timeframe;
  onSelect: (timeframe: Timeframe) => void;
}

const TimeframeSelector: React.FC<Props> = ({ timeframes, selectedTimeframe, onSelect }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Clock className="w-5 h-5 text-gray-400" />
        <span className="text-gray-400 font-medium">Timeframe</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            onClick={() => onSelect(timeframe)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${selectedTimeframe.value === timeframe.value
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-900/25'
              }
            `}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeSelector;