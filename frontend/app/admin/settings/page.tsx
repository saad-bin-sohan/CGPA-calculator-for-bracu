'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Button from '../../../components/ui/Button';
import Switch from '../../../components/ui/Switch';
import { Settings } from '../../../types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getSettings().then((data) => setSettings(data.settings));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);
    try {
      await api.admin.settings(settings);
      setMessage('Settings saved.');
    } finally {
      setLoading(false);
    }
  };

  if (!settings) {
    return (
      <AdminShell title="Settings" subtitle="Adjust CGPA rounding and lab counting rules.">
        <p className="text-sm text-stone-400">Loading settings…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Settings"
      subtitle="Adjust CGPA rounding precision and lab credit counting rules."
    >
      <form onSubmit={save} className="max-w-md space-y-8">
        <div>
          <label htmlFor="cgpa-precision" className="label mb-2 block">
            CGPA decimal precision
          </label>
          <input
            id="cgpa-precision"
            type="number"
            className="input w-24 font-mono"
            value={settings.cgpaPrecision}
            onChange={(e) =>
              setSettings({ ...settings, cgpaPrecision: Number(e.target.value) })
            }
            min={0}
            max={12}
          />
          <p className="mt-1.5 text-xs text-stone-500">
            Number of decimal places shown in CGPA calculations. Range: 0–12.
          </p>
        </div>

        <hr className="border-stone-200" />

        <div className="space-y-6">
          <h2 className="text-sm font-semibold text-stone-700">Lab course rules</h2>

          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.labCountsTowardsCGPA}
                onChange={(next) =>
                  setSettings({ ...settings, labCountsTowardsCGPA: next })
                }
                id="lab-cgpa"
              />
              <span className="text-sm font-medium text-stone-700">
                Lab courses count toward CGPA
              </span>
            </div>
            <p className="pl-11 text-xs text-stone-500">
              When enabled, lab course grades are included in CGPA calculations.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.labCountsTowardsCredits}
                onChange={(next) =>
                  setSettings({ ...settings, labCountsTowardsCredits: next })
                }
                id="lab-credits"
              />
              <span className="text-sm font-medium text-stone-700">
                Lab courses count toward graduation credits
              </span>
            </div>
            <p className="pl-11 text-xs text-stone-500">
              When enabled, lab course credits contribute to graduation progress tracking.
            </p>
          </div>
        </div>

        <hr className="border-stone-200" />

        <div className="flex items-center gap-4">
          <Button type="submit" loading={loading}>
            Save settings
          </Button>
          {message && <p className="text-sm font-semibold text-success-700">{message}</p>}
        </div>
      </form>
    </AdminShell>
  );
}
