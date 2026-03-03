import { useState } from 'react';
import { motion } from 'framer-motion';

const VOICES = ['Echo (Abena)', 'Kwame', 'Amara'];
const LANGUAGES = ['English', 'Twi', 'French', 'Swahili'];

export default function Voice() {
  const [voice, setVoice] = useState(VOICES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [volume, setVolume] = useState(80);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Voice</h1>
        <p className="text-secondary text-sm mt-1">
          AI voice confirmation per payment. Voice selector, language, volume, quiet hours, test button.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-xl border border-white/10 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Voice</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full rounded-xl bg-tertiary border border-white/10 px-4 py-2.5 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            >
              {VOICES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl bg-tertiary border border-white/10 px-4 py-2.5 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="font-medium text-primary">Volume</label>
              <span className="text-secondary">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-3 rounded-full bg-tertiary appearance-none accent-accent-green cursor-pointer"
            />
          </div>
        </div>
        <div className="bg-secondary rounded-xl border border-white/10 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-primary">Quiet hours</h2>
          <p className="text-sm text-secondary">No voice announcements during this period.</p>
          <div className="flex items-center gap-3">
            <input
              type="time"
              value={quietStart}
              onChange={(e) => setQuietStart(e.target.value)}
              className="rounded-xl bg-tertiary border border-white/10 px-4 py-2.5 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            />
            <span className="text-secondary">to</span>
            <input
              type="time"
              value={quietEnd}
              onChange={(e) => setQuietEnd(e.target.value)}
              className="rounded-xl bg-tertiary border border-white/10 px-4 py-2.5 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-xl bg-accent-green px-4 py-3 text-sm font-semibold text-white hover:bg-accent-green-hover transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.076L4 12H2a1 1 0 01-1-1V9a1 1 0 011-1h2l4.383-4.924a1 1 0 011.617.076z"
                clipRule="evenodd"
              />
            </svg>
            Test voice
          </button>
        </div>
      </div>
    </motion.div>
  );
}
