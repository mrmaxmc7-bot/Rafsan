import React, { useEffect, useState } from 'react';
import { APP_NAME, APP_LOGO_SRC } from '../assets/logo';
import { X, ShieldAlert, KeyRound, Users, Clock, Terminal, CheckCircle2 } from 'lucide-react';

interface OwnerPortalModalProps {
  onClose: () => void;
}

interface VisitorRecord {
  id: string;
  timestamp: string;
  name: string;
  authMethod: string;
  userAgent: string;
  storiesGenerated: number;
}

export const OwnerPortalModal: React.FC<OwnerPortalModalProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [logs, setLogs] = useState<VisitorRecord[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);

  // Authenticate owner
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Owner credentials: passkey "sksumon2026" or "owner" or matching email
    if (passkey.toLowerCase() === 'sksumon2026' || passkey.toLowerCase() === 'owner' || passkey.includes('mrmaxmc7')) {
      setIsAuthenticated(true);
      setErrorMsg('');
      fetchLogs();
    } else {
      setErrorMsg('ভুল পাসকোড! শুধুমাত্র ওয়েবসাইটের মালিক SKSUMONXHIKDER এর প্রবেশের অধিকার রয়েছে।');
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/visitors');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalVisitors(data.totalVisitors || (data.logs ? data.logs.length : 0));
      }
    } catch {
      // Local fallback logs if offline
      setLogs([
        {
          id: 'log-local-1',
          timestamp: new Date().toISOString(),
          name: 'SKSUMONXHIKDER (Admin Master)',
          authMethod: 'Master Owner Terminal',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          storiesGenerated: 12,
        },
      ]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-red-800 rounded-2xl p-5 md:p-6 shadow-[0_0_50px_rgba(239,68,68,0.35)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-red-950 pb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.7)] flex-shrink-0">
            <img src={APP_LOGO_SRC} alt="logo" className="w-full h-full object-cover scale-110" />
          </div>
          <div>
            <h2 className="text-lg font-black font-cyber text-red-500 tracking-wider">
              {APP_NAME} // OWNER AUDIT PORTAL
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              গোপন মালিক ড্যাশবোর্ড • শুধুমাত্র সাইট ওনারের জন্য সংরক্ষিত
            </p>
          </div>
        </div>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="py-6 max-w-md mx-auto text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-950/80 border border-red-700 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              <KeyRound className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-zinc-100 font-bangla mb-1">
              মালিক যাচাইকরণ (Owner Security Check)
            </h3>
            <p className="text-xs text-zinc-400 font-bangla mb-4">
              কে কে এবং কোন কোন আইডি দিয়ে প্রবেশ করেছে তা দেখতে সিকিউরিটি কোড দিন।
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="মাস্টার পাসকোড দিন (যেমন: sksumon2026)"
                  className="w-full px-4 py-2.5 bg-black/80 border border-red-900 rounded-xl text-center text-white text-sm font-mono focus:outline-none focus:border-red-500 shadow-inner"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-bangla">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold font-mono text-sm shadow transition-all"
              >
                আনলক করুন / VERIFY OWNER
              </button>
            </form>

            <div className="mt-4 text-[11px] text-zinc-600 font-mono">
              *Master Hint: sksumon2026
            </div>
          </div>
        ) : (
          /* Audit Logs Table for Owner */
          <div className="space-y-4">
            {/* Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-black/60 rounded-xl border border-red-950">
                <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-red-400" />
                  মোট পরিদর্শক
                </div>
                <div className="text-2xl font-bold font-mono text-red-500 mt-1">
                  {totalVisitors}
                </div>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-red-950">
                <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-red-400" />
                  সার্ভার প্রোটোকল
                </div>
                <div className="text-xs font-bold font-mono text-green-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ONLINE (24kHz)
                </div>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-red-950 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  রিয়েল-টাইম ট্র্যাকিং
                </div>
                <div className="text-xs font-mono text-zinc-300 mt-2 truncate">
                  সক্রিয় ট্র্যাকিং লাইভ
                </div>
              </div>
            </div>

            {/* Visitors Log Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-red-500" />
                  পরিদর্শকদের তালিকা ও আইডি বিস্তারিত:
                </h4>
                <button
                  onClick={fetchLogs}
                  className="text-[11px] font-mono text-red-400 hover:text-red-300 underline"
                >
                  রিফ্রেশ
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-red-950 max-h-72">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-red-950/40 text-red-300 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">সময় (Time)</th>
                      <th className="p-2.5">নাম / পরিচয় (Identity)</th>
                      <th className="p-2.5">লগইন মাধ্যম (Method)</th>
                      <th className="p-2.5">ডিভাইস / ব্রাউজার</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-950/60 bg-black/40 text-zinc-300">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-red-950/20 transition-colors">
                        <td className="p-2.5 whitespace-nowrap text-zinc-500 text-[11px]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="p-2.5 font-bold text-red-400">
                          {log.name}
                        </td>
                        <td className="p-2.5">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                            {log.authMethod}
                          </span>
                        </td>
                        <td className="p-2.5 text-zinc-400 truncate max-w-[200px]" title={log.userAgent}>
                          {log.userAgent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-xs font-mono text-zinc-300 border border-zinc-800"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
