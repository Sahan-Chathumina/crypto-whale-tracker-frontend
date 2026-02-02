import { useEffect, useState } from "react";
import {RefreshCw,TrendingUp,DollarSign,Activity,ExternalLink,Code,Sun,Moon,} from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function WhaleTrackerDemo() {
  const { theme, toggleTheme } = useTheme();

  const [whales, setWhales] = useState([]);
  const [marketMovers, setMarketMovers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [error, setError] = useState("");

  const cryptos = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", color: "#F7931A" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "#627EEA" },
    { id: "bnb", name: "BNB", symbol: "BNB", color: "#F3BA2F" },
    { id: "solana", name: "Solana", symbol: "SOL", color: "#14F195" },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", color: "#C2A633" },
  ];

  /* API  */

  const fetchWhales = async (crypto) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/crypto-whales?crypto=${crypto}&limit=10`,
      );
      const data = await res.json();

      if (!data.success) throw new Error("Failed to fetch whale data");

      setWhales(data.trades || []);
      setStats(data.statistics || null);
    } catch (err) {
      setError("Unable to load whale activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketMovers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/market-movers?limit=5`);
      const data = await res.json();
      if (data.success) setMarketMovers(data.top_movers || []);
    } catch {
      /* silent fail – sidebar data */
    }
  };

  useEffect(() => {
    fetchWhales(selectedCrypto);
    fetchMarketMovers();
  }, []);

  /*  HELPERS  */

  const formatUSD = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 8,
    }).format(value);

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  /*  UI  */

  return (
    <div className="min-h-screen">
      {/*  HEADER  */}
      <header
        className="border-b backdrop-blur-xl"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              🐋 Crypto Whale Tracker
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                Live
              </span>
            </h1>
            <p className="text-sm opacity-80 mt-1">
              Monitor large crypto transactions in real time
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`${API_BASE}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700"
            >
              <Code size={16} />
              API Docs
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border hover:bg-blue-500/10"
              style={{ borderColor: "var(--border-color)" }}
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-blue-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/*  CONTENT  */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/*  STATS  */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                label: "Total Volume",
                value: formatUSD(stats.total_volume_usd),
                icon: <DollarSign />,
              },
              {
                label: "Average Trade",
                value: formatUSD(stats.average_trade_usd),
                icon: <TrendingUp />,
              },
              {
                label: "Largest Trade",
                value: formatUSD(stats.largest_trade_usd),
                icon: <Activity />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border backdrop-blur-xl"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center justify-between text-sm opacity-80">
                  {item.label}
                  {item.icon}
                </div>
                <div className="text-2xl font-bold mt-2">{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {/*  LAYOUT  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*  MAIN  */}
          <section className="lg:col-span-2 space-y-6">
            {/* Crypto selector */}
            <div
              className="rounded-2xl p-6 border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Select Cryptocurrency</h2>
                <button
                  onClick={() => fetchWhales(selectedCrypto)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {cryptos.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCrypto(c.id);
                      fetchWhales(c.id);
                    }}
                    className={`p-4 rounded-xl border transition ${
                      selectedCrypto === c.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "hover:border-blue-500/50"
                    }`}
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div
                      className="text-xl font-bold"
                      style={{ color: c.color }}
                    >
                      {c.symbol}
                    </div>
                    <div className="text-xs opacity-80">{c.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Whale list */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className="p-6 border-b"
                style={{ borderColor: "var(--border-color)" }}
              >
                <h2 className="text-lg font-bold">Recent Whale Movements</h2>
                <p className="text-sm opacity-70">Transactions above $50,000</p>
              </div>

              {error && <div className="p-6 text-red-500 text-sm">{error}</div>}

              {loading ? (
                <div className="p-10 text-center opacity-70">
                  <RefreshCw className="animate-spin mx-auto mb-3" />
                  Loading whale activity...
                </div>
              ) : whales.length ? (
                whales.map((w, i) => (
                  <div
                    key={i}
                    className="p-6 border-b last:border-b-0"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div className="flex justify-between">
                      <div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            w.direction === "buy"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {w.direction.toUpperCase()}
                        </span>
                        <span className="ml-3 text-xs opacity-70">
                          {timeAgo(w.timestamp)}
                        </span>
                        <div className="font-mono text-sm mt-1">{w.symbol}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {formatUSD(w.value_usd)}
                        </div>
                        <div className="text-xs opacity-70">
                          {formatNumber(w.quantity)} @ ${formatNumber(w.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center opacity-70">
                  No whale activity detected
                </div>
              )}
            </div>
          </section>

          {/*  SIDEBAR  */}
          <aside className="space-y-6">
            <div
              className="rounded-2xl p-6 border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <h3 className="font-bold mb-4">🔥 Market Movers</h3>
              {marketMovers.map((m, i) => (
                <div key={i} className="flex justify-between mb-3">
                  <div>
                    <div className="font-semibold">{m.symbol}</div>
                    <div className="text-xs opacity-70">{m.name}</div>
                  </div>
                  <div className="text-right">
                    <div>${formatNumber(m.price)}</div>
                    <div
                      className={`text-xs ${
                        m.price_change_percent >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {m.price_change_percent?.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-6 border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <h3 className="font-bold mb-3">💻 Quick Start</h3>
              <pre className="text-xs bg-black/50 p-4 rounded-lg overflow-x-auto">
                {`fetch('${API_BASE}/api/v1/crypto-whales?crypto=bitcoin')
  .then(res => res.json())
  .then(console.log)`}
              </pre>
              <a
                href={`${API_BASE}/docs`}
                target="_blank"
                className="text-sm text-blue-400 flex items-center gap-1 mt-3"
              >
                Full Documentation
                <ExternalLink size={14} />
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
