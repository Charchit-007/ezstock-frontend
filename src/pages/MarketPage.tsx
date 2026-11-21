import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { MarketChart } from "../features/market/MarketChart";
import { useMarketChart, useMarketQuote, useMarketSearch } from "../features/market/useMarket";
import { useTrade } from "../features/trading/useTrading";
import { formatCurrency } from "../utils/currency";
import { getErrorMessage } from "../utils/errors";

const DEFAULT_SYMBOLS = [
  { symbol: "^NSEI", label: "Nifty 50" },
  { symbol: "^BSESN", label: "Sensex" },
  { symbol: "RELIANCE.NS", label: "Reliance" },
  { symbol: "TCS.NS", label: "TCS" },
  { symbol: "HDFCBANK.NS", label: "HDFC Bank" },
  { symbol: "INFY.NS", label: "Infosys" },
  { symbol: "AAPL", label: "Apple" },
];
const TIMEFRAMES = [
  { label: "1D", interval: "5m", range: "1d" },
  { label: "5D", interval: "15m", range: "5d" },
  { label: "1M", interval: "1h", range: "1mo" },
  { label: "6M", interval: "1d", range: "6mo" },
  { label: "1Y", interval: "1d", range: "1y" },
];

export default function MarketPage() {
  const [searchParams] = useSearchParams();
  const requestedSymbol = searchParams.get("symbol");
  const [selected, setSelected] = useState<string>(requestedSymbol ?? DEFAULT_SYMBOLS[0].symbol);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[0]);
  const [chartMode, setChartMode] = useState<"candlestick" | "line">("candlestick");
  const [quantity, setQuantity] = useState("1");
  const [tradeError, setTradeError] = useState<string | null>(null);
  const quote = useMarketQuote(selected);
  const chart = useMarketChart(selected, timeframe.interval, timeframe.range);
  const search = useMarketSearch(searchQuery);
  const buy = useTrade("BUY");
  const sell = useTrade("SELL");

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const addSymbol = (symbol: string) => {
    setSelected(symbol);
    setQuery("");
    setSearchQuery("");
  };
  const selectedLabel = DEFAULT_SYMBOLS.find((item) => item.symbol === selected)?.label ?? selected.replace("^", "");
  const periodChange = chart.data?.candles.length
    ? chart.data.candles[chart.data.candles.length - 1].close - chart.data.candles[0].close
    : null;
  const periodChangePercent = periodChange !== null && chart.data?.candles.length
    ? periodChange * 100 / chart.data.candles[0].close
    : null;
  const trade = async (type: "BUY" | "SELL") => {
    const amount = Number(quantity);
    if (!Number.isFinite(amount) || amount <= 0) {
      setTradeError("Enter a quantity greater than zero.");
      return;
    }
    setTradeError(null);
    try {
      await (type === "BUY" ? buy : sell).mutateAsync({ symbol: selected, quantity: amount });
      setQuantity("1");
    } catch (error) {
      setTradeError(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Market</h1>
        <p className="mt-1 text-muted">Live market quotes and price charts powered by Yahoo Finance.</p>
      </div>
      <div className="relative">
        <label htmlFor="market-search" className="sr-only">Search market symbols</label>
        <input id="market-search" className="input w-full" value={query} onChange={(event) => setQuery(event.target.value)}
          placeholder="Search stocks, ETFs, or indices (e.g. Apple, Nifty)" />
        {search.data && search.data.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-line bg-white p-2 shadow-lg">
            {search.data.slice(0, 8).map((result) => (
              <button type="button" key={`${result.symbol}-${result.exchange}`} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-canvas" onClick={() => addSymbol(result.symbol)}>
                <span><strong>{result.symbol}</strong><span className="ml-2 text-sm text-muted">{result.shortName || result.longName}</span></span>
                <span className="text-xs text-muted">{result.exchange}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {DEFAULT_SYMBOLS.map((item) => <button key={item.symbol} type="button" onClick={() => setSelected(item.symbol)}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${selected === item.symbol ? "bg-ink text-white" : "bg-canvas text-muted hover:text-ink"}`}>{item.label}</button>)}
      </div>
      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <p className="text-sm text-muted">{selectedLabel}</p>
            {quote.isPending ? <div className="mt-2 h-9 w-40 animate-pulse rounded bg-canvas" /> :
              quote.isError ? <p className="mt-2 text-sm text-loss">{getErrorMessage(quote.error)}</p> :
              <div className="mt-1"><span className="money text-3xl font-extrabold">{formatCurrency(quote.data.price)}</span></div>}
            {periodChange !== null && periodChangePercent !== null && (
              <p className={`mt-1 text-sm font-semibold ${periodChange >= 0 ? "text-gain" : "text-loss"}`}>
                {timeframe.label} change: {periodChange >= 0 ? "+" : ""}{formatCurrency(periodChange)} ({periodChangePercent >= 0 ? "+" : ""}{periodChangePercent.toFixed(2)}%)
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <label htmlFor="market-quantity" className="text-sm font-semibold">Quantity</label>
              <input id="market-quantity" type="number" min="0.0001" step="0.0001" value={quantity}
                onChange={(event) => setQuantity(event.target.value)} className="input w-24" />
              <button type="button" className="btn-primary px-3 py-1.5 text-xs" onClick={() => trade("BUY")}
                disabled={buy.isPending || sell.isPending}>Buy</button>
              <button type="button" className="btn-danger px-3 py-1.5 text-xs" onClick={() => trade("SELL")}
                disabled={buy.isPending || sell.isPending}>Sell</button>
            </div>
            {tradeError && <p role="alert" className="mt-2 text-sm font-medium text-loss">{tradeError}</p>}
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <div className="flex gap-1 rounded-lg bg-canvas p-1">
              <button type="button" onClick={() => setChartMode("candlestick")}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${chartMode === "candlestick" ? "bg-white text-ink shadow" : "text-muted"}`}>Candles</button>
              <button type="button" onClick={() => setChartMode("line")}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${chartMode === "line" ? "bg-white text-ink shadow" : "text-muted"}`}>Line</button>
            </div>
            <div className="flex gap-2">{TIMEFRAMES.map((item) => <button key={item.label} type="button" onClick={() => setTimeframe(item)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${timeframe.label === item.label ? "bg-gain-soft text-gain" : "text-muted hover:bg-canvas"}`}>{item.label}</button>)}</div>
          </div>
        </div>
        {chart.isPending ? <LoadingState label="Loading price chart…" /> :
          chart.isError ? <div className="p-5"><ErrorState message={getErrorMessage(chart.error)} onRetry={() => chart.refetch()} /></div> :
          chart.data.candles.length === 0 ? <p className="p-6 text-center text-muted">No chart data is available for this symbol.</p> :
          <MarketChart candles={chart.data.candles} mode={chartMode} />}
      </section>
    </div>
  );
}
