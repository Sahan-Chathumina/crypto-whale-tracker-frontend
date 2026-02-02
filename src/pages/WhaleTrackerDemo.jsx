import { useEffect, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ExternalLink,
  Code,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
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

  /* ================= API ================= */

  const fetchWhales = async (crypto) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/crypto-whales?crypto=${crypto}&limit=10`
      );
      const data = await res.json();
      if (!data.success) throw new Error();
      setWhales(data.trades || []);
      setStats(data.statistics || null);
    } catch {
      setError("Failed to load whale activity.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketMovers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/market-movers?limit=5`);
      const data = await res.json();
      if (data.success) setMarketMovers(data.top_movers || []);
    } catch {}
  };

  useEffect(() => {
    fetchWhales(selectedCrypto);
    fetchMarketMovers();
  }, []);

  /* ================= HELPERS ================= */

  const formatUSD = (v) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const formatNumber = (v) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(v);

  const timeAgo = (ts) => {
    const m = Math.floor((Date.now() - new Date(ts)) / 60000);
    if (m < 60) return `${m}m ago`;
    if (m < 1440) return `${Math.floor(m / 60)}h ago`;
    return `${Math.floor(m / 1440)}d ago`;
  };

  const getSelectedCrypto = () =>
    cryptos.find((c) => c.id === selectedCrypto);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* HEADER */}
      <header className="border-b sticky top-0 z-50 bg-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <span className="text-3xl">🐋</span>
                Crypto Whale Tracker
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Real-time institutional transaction monitoring
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`${API_BASE}/docs`}
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg btn-primary"
              >
                <Code size={16} />
                API Docs
              </a>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg btn-secondary"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* STATS */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                label: "Total Volume",
                value: formatUSD(stats.total_volume_usd),
                icon: <DollarSign className="w-8 h-8" />,
                color: "#10b981",
              },
              {
                label: "Avg Trade",
                value: formatUSD(stats.average_trade_usd),
                icon: <TrendingUp className="w-8 h-8" />,
                color: "#3b82f6",
              },
              {
                label: "Largest Trade",
                value: formatUSD(stats.largest_trade_usd),
                icon: <Activity className="w-8 h-8" />,
                color: "#8b5cf6",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="card p-6 flex items-center justify-between hover-lift"
              >
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                    {s.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {s.value}
                  </p>
                </div>
                <div className="stat-icon" style={{ color: s.color }}>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <section className="lg:col-span-2 space-y-6">
            {/* CRYPTO SELECTOR */}
            <div className="card p-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {cryptos.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCrypto(c.id);
                        fetchWhales(c.id);
                      }}
                      className={`crypto-btn ${selectedCrypto === c.id ? "active" : ""}`}
                      style={{
                        "--crypto-color": c.color,
                      }}
                    >
                      <span
                        className="crypto-dot"
                        style={{ backgroundColor: c.color }}
                      ></span>
                      {c.symbol}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => fetchWhales(selectedCrypto)}
                  disabled={loading}
                  className="btn-refresh"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {/* WHALE TABLE */}
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <h2 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                    Recent Whale Movements
                  </h2>
                </div>
                {getSelectedCrypto() && (
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium hidden sm:inline-block"
                    style={{
                      backgroundColor: `${getSelectedCrypto().color}20`,
                      color: getSelectedCrypto().color,
                    }}
                  >
                    {getSelectedCrypto().symbol}
                  </span>
                )}
              </div>

              {error && (
                <div className="p-6 text-sm text-red-500 bg-red-500/10 border-l-4 border-red-500">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="p-16 text-center">
                  <RefreshCw className="spin w-10 h-10 mx-auto mb-3 text-blue-500" />
                  <p style={{ color: "var(--text-muted)" }}>Loading whale activity...</p>
                </div>
              ) : whales.length ? (
                <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                  {whales.map((w, i) => (
                    <div
                      key={i}
                      className="whale-row px-6 py-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`whale-badge ${w.direction === "buy" ? "buy" : "sell"}`}
                          >
                            {w.direction === "buy" ? (
                              <ArrowUpRight className="w-5 h-5" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <span
                              className={`trade-type ${w.direction === "buy" ? "buy" : "sell"}`}
                            >
                              {w.direction.toUpperCase()}
                            </span>
                            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                              {timeAgo(w.timestamp)}
                            </div>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                            {formatUSD(w.value_usd)}
                          </div>
                          <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                            {formatNumber(w.quantity)} @ ${formatNumber(w.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p style={{ color: "var(--text-muted)" }}>No whale activity found</p>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT */}
          <aside className="space-y-6">
            {/* MARKET MOVERS */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                  Market Movers
                </h3>
              </div>
              <div className="space-y-4">
                {marketMovers.map((m, i) => (
                  <div
                    key={i}
                    className="market-mover flex justify-between items-center p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`mover-badge ${m.price_change_percent >= 0 ? "positive" : "negative"}`}
                      >
                        {m.symbol.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: "var(--text-primary)" }}>
                          {m.symbol}
                        </div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {m.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        ${formatNumber(m.price)}
                      </div>
                      <div
                        className={`text-sm font-bold flex items-center gap-1 justify-end ${
                          m.price_change_percent >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {m.price_change_percent >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {m.price_change_percent?.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK START */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                  Quick Start
                </h3>
              </div>
              <pre className="code-block text-xs p-4 rounded-lg overflow-x-auto">
{`fetch('${API_BASE}/api/v1/crypto-whales?crypto=bitcoin')
  .then(res => res.json())
  .then(console.log)`}
              </pre>
              <a
                href={`${API_BASE}/docs`}
                target="_blank"
                className="inline-flex items-center gap-2 mt-4 text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                View Documentation
                <ExternalLink size={14} />
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}