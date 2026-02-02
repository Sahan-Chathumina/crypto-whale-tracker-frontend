import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, DollarSign, Activity, ExternalLink, Code } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function WhaleTrackerDemo() {
  const [whales, setWhales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [stats, setStats] = useState(null);
  const [marketMovers, setMarketMovers] = useState([]);

  const cryptos = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { id: 'bnb', name: 'BNB', symbol: 'BNB', color: '#F3BA2F' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', color: '#14F195' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', color: '#C2A633' },
  ];

  const fetchWhales = async (crypto = selectedCrypto) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/crypto-whales?crypto=${crypto}&limit=10`);
      const data = await response.json();
      
      if (data.success && data.trades) {
        setWhales(data.trades);
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching whales:', error);
    }
    setLoading(false);
  };

  const fetchMarketMovers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/market-movers?limit=5`);
      const data = await response.json();
      if (data.success) {
        setMarketMovers(data.top_movers || []);
      }
    } catch (error) {
      console.error('Error fetching movers:', error);
    }
  };

  useEffect(() => {
    fetchWhales();
    fetchMarketMovers();
  }, []);

  const formatUSD = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(value);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                🐋 Crypto Whale Tracker
                <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-normal">
                  Live API Demo
                </span>
              </h1>
              <p className="text-blue-200 mt-2">Track large cryptocurrency transactions in real-time</p>
            </div>
            <a
              href="https://crypto-whale-tracker-api.onrender.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <Code size={20} />
              View API Docs
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-200 text-sm font-medium">Total Volume</span>
                <DollarSign className="text-blue-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-white">{formatUSD(stats.total_volume_usd)}</div>
              <div className="text-blue-300 text-sm mt-1">Last 10 whales</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-200 text-sm font-medium">Average Trade</span>
                <TrendingUp className="text-purple-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-white">{formatUSD(stats.average_trade_usd)}</div>
              <div className="text-purple-300 text-sm mt-1">Per whale</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-200 text-sm font-medium">Largest Trade</span>
                <Activity className="text-green-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-white">{formatUSD(stats.largest_trade_usd)}</div>
              <div className="text-green-300 text-sm mt-1">Biggest whale</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Whale Feed */}
          <div className="lg:col-span-2">
            {/* Crypto Selector */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Select Cryptocurrency</h2>
                <button
                  onClick={() => fetchWhales(selectedCrypto)}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {cryptos.map((crypto) => (
                  <button
                    key={crypto.id}
                    onClick={() => {
                      setSelectedCrypto(crypto.id);
                      fetchWhales(crypto.id);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedCrypto === crypto.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-blue-500/50'
                    }`}
                  >
                    <div className="text-2xl mb-1" style={{ color: crypto.color }}>
                      {crypto.symbol}
                    </div>
                    <div className="text-sm text-gray-300">{crypto.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Whale Transactions */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-blue-500/20">
                <h2 className="text-xl font-bold text-white">Recent Whale Movements</h2>
                <p className="text-blue-200 text-sm mt-1">Large transactions over $50,000</p>
              </div>

              <div className="divide-y divide-blue-500/10">
                {loading ? (
                  <div className="p-8 text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-blue-400" size={32} />
                    <div className="text-gray-400">Loading whale activity...</div>
                  </div>
                ) : whales.length > 0 ? (
                  whales.map((whale, idx) => (
                    <div key={idx} className="p-6 hover:bg-blue-500/5 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              whale.direction === 'buy' 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-red-500/20 text-red-300'
                            }`}>
                              {whale.direction.toUpperCase()}
                            </span>
                            <span className="text-gray-400 text-sm">{getTimeAgo(whale.timestamp)}</span>
                          </div>
                          <div className="text-white font-mono text-sm mb-1">
                            {whale.symbol}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white mb-1">
                            {formatUSD(whale.value_usd)}
                          </div>
                          <div className="text-blue-300 text-sm">
                            {formatNumber(whale.quantity)} @ ${formatNumber(whale.price)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <span className="bg-slate-700/50 px-2 py-1 rounded">
                          {whale.exchange}
                        </span>
                        <span className="truncate">{whale.tx_hash}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    No whale activity detected for {selectedCrypto}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Info */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🚀 API Access</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Integrate this whale tracker into your own applications with our powerful API.
              </p>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>14+ Cryptocurrencies</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Real-time Data</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Free Tier Available</span>
                </div>
              </div>
              <a
                href="https://rapidapi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-blue-600 text-center py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                Get API Access →
              </a>
            </div>

            {/* Market Movers */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🔥 Market Movers</h3>
              <div className="space-y-3">
                {marketMovers.slice(0, 5).map((mover, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <div className="text-white font-semibold">{mover.symbol}</div>
                      <div className="text-xs text-gray-400">{mover.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        ${formatNumber(mover.price)}
                      </div>
                      <div className={`text-xs font-semibold ${
                        mover.price_change_percent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {mover.price_change_percent >= 0 ? '+' : ''}
                        {mover.price_change_percent?.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Example */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">💻 Quick Start</h3>
              <pre className="bg-slate-900 p-4 rounded-lg text-xs text-green-400 overflow-x-auto">
{`fetch('${API_BASE}/api/v1/crypto-whales?crypto=bitcoin')
  .then(res => res.json())
  .then(data => console.log(data))`}
              </pre>
              <a
                href="https://crypto-whale-tracker-api.onrender.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                Full Documentation
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Ready to Track Whales?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of developers using our API to track crypto whale movements, 
            build trading bots, and analyze market sentiment.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://rapidapi.com"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all"
            >
              Start Free Trial
            </a>
            <a
              href="https://crypto-whale-tracker-api.onrender.com/docs"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-all"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}