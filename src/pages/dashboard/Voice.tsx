import React, { useState } from 'react';
import { motion } from 'framer-motion';

const VOICES = ['Echo (Abena)', 'Kwame', 'Amara'];
const LANGUAGES = ['English', 'Twi', 'French', 'Swahili'];

const Voice: React.FC = () => {
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
              className="w-full rounded-lg bg-tertiary border border-white/10 px-4 py-2.5 text-primary text-sm"
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
              className="w-full rounded-lg bg-tertiary border border-white/10 px-4 py-2.5 text-primary text-sm"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-primary">Volume</label>
              <span className="text-secondary">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 rounded-full bg-tertiary appearance-none accent-accent-green"
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
              className="rounded-lg bg-tertiary border border-white/10 px-4 py-2.5 text-primary text-sm"
            />
            <span className="text-secondary">to</span>
            <input
              type="time"
              value={quietEnd}
              onChange={(e) => setQuietEnd(e.target.value)}
              className="rounded-lg bg-tertiary border border-white/10 px-4 py-2.5 text-primary text-sm"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-full bg-accent-green px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-green-hover"
          >
            Test voice
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Voice;
