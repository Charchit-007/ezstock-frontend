import { useEffect, useRef } from "react";
import { CandlestickSeries, ColorType, createChart, HistogramSeries, LineSeries, type CandlestickData, type IChartApi, type ISeriesApi, type HistogramData, type Time } from "lightweight-charts";
import type { MarketCandle } from "../../types/market";

interface MarketChartProps {
  candles: MarketCandle[];
  mode: "candlestick" | "line";
}

export function MarketChart({ candles, mode }: MarketChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height: 380,
      layout: { background: { type: ColorType.Solid, color: "#ffffff" }, textColor: "#667085" },
      grid: { vertLines: { color: "#eef0f2" }, horzLines: { color: "#eef0f2" } },
      rightPriceScale: { borderColor: "#d9dde2" },
      timeScale: { borderColor: "#d9dde2", timeVisible: true },
    });
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#16a34a", downColor: "#dc2626", borderVisible: false,
      wickUpColor: "#16a34a", wickDownColor: "#dc2626",
    });
    const lineSeries = chart.addSeries(LineSeries, {
      color: "#2563eb", lineWidth: 2, priceLineVisible: false,
    });
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" }, priceScaleId: "", color: "#93c5fd",
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    lineSeriesRef.current = lineSeries;
    volumeSeriesRef.current = volumeSeries;

    const resize = new ResizeObserver(() => chart.applyOptions({ width: containerRef.current?.clientWidth ?? 0 }));
    resize.observe(containerRef.current);
    return () => {
      resize.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    candleSeriesRef.current?.applyOptions({ visible: mode === "candlestick" });
    lineSeriesRef.current?.applyOptions({ visible: mode === "line" });
  }, [mode]);

  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || candles.length === 0) return;
    const candleData: CandlestickData<Time>[] = candles.map((candle) => ({
      time: candle.time as Time, open: candle.open, high: candle.high, low: candle.low, close: candle.close,
    }));
    const volumeData: HistogramData<Time>[] = candles.map((candle) => ({
      time: candle.time as Time, value: candle.volume, color: candle.close >= candle.open ? "#86efac" : "#fca5a5",
    }));
    candleSeriesRef.current.setData(candleData);
    lineSeriesRef.current?.setData(candleData.map((candle) => ({ time: candle.time, value: candle.close })));
    volumeSeriesRef.current.setData(volumeData);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  return <div ref={containerRef} className="min-h-[380px] w-full" aria-label="Market price chart" />;
}
