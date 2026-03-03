import { useEffect, useState, useMemo } from 'react';
import QRCode from 'qrcode';

export interface QRPayload {
  v: number;
  proto: string;
  chain: string;
  vault: string;
  mode: 'open' | 'fixed';
  amount: string | null;
}

export function useQRCode(vaultAddress: string, mode: 'open' | 'fixed', fixedAmount: string) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const payload: QRPayload = useMemo(
    () => ({
      v: 1,
      proto: 'payecho',
      chain: 'base',
      vault: vaultAddress,
      mode,
      amount: mode === 'fixed' && fixedAmount ? fixedAmount : null,
    }),
    [vaultAddress, mode, fixedAmount]
  );

  useEffect(() => {
    let cancelled = false;
    const generate = async () => {
      try {
        setError(null);
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
    return () => {
      cancelled = true;
    };
  }, [payload]);

  return { qrDataUrl, error };
}
