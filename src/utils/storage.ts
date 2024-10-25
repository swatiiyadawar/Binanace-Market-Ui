import { CandlestickData } from '../types/binance';

const STORAGE_PREFIX = 'crypto_chart_';

// Generate a unique key for each symbol and interval combination
const getStorageKey = (symbol: string, interval: string): string => {
  return `${STORAGE_PREFIX}${symbol.toLowerCase()}_${interval}`;
};

// Store candlestick data in localStorage
export const storeCandlesticks = (
  symbol: string,
  interval: string,
  data: CandlestickData[]
): void => {
  try {
    const key = getStorageKey(symbol, interval);
    localStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data,
    }));
  } catch (error) {
    console.error('Failed to store candlestick data:', error);
  }
};

// Retrieve candlestick data from localStorage
export const getStoredCandlesticks = (
  symbol: string,
  interval: string
): CandlestickData[] => {
  try {
    const key = getStorageKey(symbol, interval);
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return [];
    }

    const { timestamp, data } = JSON.parse(stored);
    
    // Clear data older than 24 hours
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(key);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Failed to retrieve candlestick data:', error);
    return [];
  }
};