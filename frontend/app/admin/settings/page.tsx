'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Toggle from '../../../components/ui/Toggle';
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
    <AdminShell title="Settings" subtitle="Adjust CGPA rounding and lab counting rules.">
      <Card className="space-y-4">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label">CGPA decimal precision</label>
            <input
              type="number"
              className="input mt-2"
              value={settings.cgpaPrecision}
              onChange={(e) => setSettings({ ...settings, cgpaPrecision: Number(e.target.value) })}
              min={0}
              max={12}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              checked={settings.labCountsTowardsCGPA}
              onChange={(next) => setSettings({ ...settings, labCountsTowardsCGPA: next })}
              label="Lab counts toward CGPA"
              description="Include lab grades when calculating CGPA."
            />
            <Toggle
              checked={settings.labCountsTowardsCredits}
              onChange={(next) => setSettings({ ...settings, labCountsTowardsCredits: next })}
              label="Lab counts toward credits"
              description="Include lab credits in graduation progress."
            />
          </div>
          {message && (
            <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-2 text-sm text-success-700">
              {message}
            </div>
          )}
          <Button type="submit">Save settings</Button>
        </form>
      </Card>
    </AdminShell>
  );
}
