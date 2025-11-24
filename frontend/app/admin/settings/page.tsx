'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Settings } from '../../../types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getSettings().then((data) => setSettings(data.settings));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await api.admin.settings(settings);
    setMessage('Settings saved');
  };

  if (!settings) return <p>Loading settings…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Adjust CGPA rounding and lab counting rules.</p>
      </div>
      <form onSubmit={save} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">CGPA decimal precision</label>
          <input
            type="number"
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={settings.cgpaPrecision}
            onChange={(e) => setSettings({ ...settings, cgpaPrecision: Number(e.target.value) })}
            min={0}
            max={12}
          />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={settings.labCountsTowardsCGPA}
              onChange={(e) =>
                setSettings({ ...settings, labCountsTowardsCGPA: e.target.checked })
              }
            />
            Lab counts toward CGPA
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={settings.labCountsTowardsCredits}
              onChange={(e) =>
                setSettings({ ...settings, labCountsTowardsCredits: e.target.checked })
              }
            />
            Lab counts toward credits
          </label>
        </div>
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
