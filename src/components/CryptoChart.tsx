import React, { useEffect, useRef, useCallback } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData as TradingViewData } from 'lightweight-charts';
import { CandlestickData } from '../types/binance';

interface Props {
  symbol: string;
  data: CandlestickData[];
}

const CryptoChart: React.FC<Props> = ({ symbol, data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const initChart = useCallback(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Set initial data
    if (data.length > 0) {
      const formattedData: TradingViewData[] = data.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));
      
      seriesRef.current.setData(formattedData);
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  useEffect(() => {
    initChart();

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [initChart]);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      const lastCandle = data[data.length - 1];
      const formattedCandle: TradingViewData = {
        time: lastCandle.time,
        open: lastCandle.open,
        high: lastCandle.high,
        low: lastCandle.low,
        close: lastCandle.close,
      };
      
      // Update only the last candle for real-time updates
      seriesRef.current.update(formattedCandle);
    }
  }, [data]);

  return (
    <div className="w-full h-[600px] bg-[#1a1a1a] rounded-lg overflow-hidden">
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};

export default CryptoChart;