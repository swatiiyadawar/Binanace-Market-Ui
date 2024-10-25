import { useState, useEffect, useCallback } from 'react';
import { KlineData, CandlestickData } from '../types/binance';
import { getStoredCandlesticks, storeCandlesticks } from '../utils/storage';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';
const MAX_STORED_CANDLES = 1000; // Limit stored candles to prevent excessive storage

export const useCryptoWebSocket = (symbol: string, interval: string = '1m') => {
  const [candlesticks, setCandlesticks] = useState<CandlestickData[]>(() => {
    return getStoredCandlesticks(symbol, interval);
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processKlineData = useCallback((data: KlineData) => {
    const { k } = data;
    const candlestick: CandlestickData = {
      time: k.t / 1000,
      open: parseFloat(k.o),
      high: parseFloat(k.h),
      low: parseFloat(k.l),
      close: parseFloat(k.c),
    };

    setCandlesticks(prev => {
      const newData = [...prev];
      const existingIndex = newData.findIndex(c => c.time === candlestick.time);
      
      if (existingIndex >= 0) {
        newData[existingIndex] = candlestick;
      } else {
        newData.push(candlestick);
      }
      
      // Sort and limit the number of candles
      const sortedData = newData
        .sort((a, b) => a.time - b.time)
        .slice(-MAX_STORED_CANDLES);

      // Store the updated data
      storeCandlesticks(symbol, interval, sortedData);
      
      return sortedData;
    });
  }, [symbol, interval]);

  useEffect(() => {
    // Load initial data from storage when symbol or interval changes
    setCandlesticks(getStoredCandlesticks(symbol, interval));

    const ws = new WebSocket(`${BINANCE_WS_URL}/${symbol.toLowerCase()}@kline_${interval}`);

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data: KlineData = JSON.parse(event.data);
        processKlineData(data);
      } catch (err) {
        setError('Failed to process market data');
      }
    };

    ws.onerror = () => {
      setError('WebSocket connection error');
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol, interval, processKlineData]);

  return { candlesticks, isConnected, error };
};