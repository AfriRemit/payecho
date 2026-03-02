import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';

const QR: React.FC = () => {
  const [mode, setMode] = useState<'open' | 'fixed'>('open');
  const [fixedAmount, setFixedAmount] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const qrImageRef = useRef<HTMLImageElement>(null);

  const vaultAddress =
    import.meta.env.VITE_MERCHANT_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000';

  useEffect(() => {
    let cancelled = false;
    const generate = async () => {
      try {
        setError(null);
        const payload = {
          v: 1,
          proto: 'payecho',
          chain: 'base',
          vault: vaultAddress,
          mode,
          amount: mode === 'fixed' && fixedAmount ? fixedAmount : null,
        };
        const text = JSON.stringify(payload);
        const url = await QRCode.toDataURL(text, {
          margin: 1,
          width: 512,
          errorCorrectionLevel: 'M',
        });
        if (!cancelled) setQrDataUrl(url);
      } catch (e) {
        if (!cancelled) {
          setError('Could not generate QR');
          setQrDataUrl(null);
        }
      }
    };
    generate();
    return () => { cancelled = true; };
  }, [mode, fixedAmount, vaultAddress]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `payecho-qr-${mode}${mode === 'fixed' && fixedAmount ? `-${fixedAmount}usdc` : ''}.png`;
    a.click();
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>PayEcho QR</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:sans-serif;background:#fff;}
      img{max-width:320px;height:auto;}
      p{color:#666;margin-top:1rem;font-size:14px;}</style></head>
      <body><img src="${qrDataUrl}" alt="PayEcho QR" /><p>Scan to pay USDC · Base</p></body></html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          to="/dashboard"
          className="text-sm text-secondary hover:text-accent-green transition-colors flex items-center gap-1.5 w-fit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>
        <h1 className="text-xl md:text-2xl font-semibold text-primary self-end sm:ml-auto">Create QR code</h1>
      </div>
      <p className="text-secondary text-sm -mt-2 mb-2">
        Customers scan to pay USDC on Base. Open or fixed amount.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR display — hero */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-secondary rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col items-center justify-center min-h-[280px]">
            {qrDataUrl && !error ? (
              <>
                <div className="rounded-2xl bg-white p-4 shadow-lg">
                  <img
                    ref={qrImageRef}
                    src={qrDataUrl}
                    alt="PayEcho payment QR"
                    className="w-44 h-44 md:w-52 md:h-52 object-contain"
                  />
                </div>
                <p className="text-sm text-secondary mt-4 font-medium">
                  Scan to pay USDC · Base
                </p>
                <p className="text-xs text-secondary mt-1">
                  {mode === 'open'
                    ? 'Customer enters amount'
                    : fixedAmount
                      ? `${fixedAmount} USDC`
                      : 'Set amount below'}
                </p>
              </>
            ) : (
              <div className="w-44 h-44 rounded-2xl bg-tertiary border border-white/10 flex items-center justify-center text-secondary text-sm">
                {error || 'Generating…'}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="order-1 lg:order-2">
          <div className="bg-secondary rounded-2xl border border-white/10 p-5 space-y-5">
            <div>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                Amount type
              </p>
              <div className="flex rounded-xl bg-tertiary/80 p-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => setMode('open')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                    mode === 'open'
                      ? 'bg-accent-green text-white shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  Open amount
                </button>
                <button
                  type="button"
                  onClick={() => setMode('fixed')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                    mode === 'fixed'
                      ? 'bg-accent-green text-white shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  Fixed amount
                </button>
              </div>
            </div>

            {mode === 'fixed' && (
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Amount (USDC)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={fixedAmount}
                  onChange={(e) => setFixedAmount(e.target.value)}
                  placeholder="e.g. 25.00"
                  className="w-full rounded-xl bg-tertiary border border-white/10 px-4 py-3 text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-green/50"
                />
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!qrDataUrl}
                className="w-full rounded-xl bg-accent-green px-4 py-3 text-sm font-medium text-white hover:bg-accent-green-hover disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PNG
              </button>
              <button
                type="button"
                onClick={handlePrint}
                disabled={!qrDataUrl}
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-primary hover:bg-white/5 disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>

            <div className="pt-3 border-t border-white/10">
              <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">Vault address</p>
              <p className="font-mono text-xs text-primary break-all">
                {vaultAddress.slice(0, 10)}…{vaultAddress.slice(-8)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QR;
