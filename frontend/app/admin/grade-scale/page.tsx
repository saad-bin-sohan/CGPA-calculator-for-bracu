'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { GradeScaleEntry } from '../../../types';

export default function GradeScalePage() {
  const [entries, setEntries] = useState<GradeScaleEntry[]>([]);
  const [form, setForm] = useState<Partial<GradeScaleEntry>>({
    letter: '',
    minPercentage: 0,
    maxPercentage: 100,
    gradePoint: 0,
    isSpecial: false
  });

  const load = async () => {
    const data = await api.getGradeScale();
    setEntries(data.entries || []);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.admin.gradeScale.create(form);
    setForm({ letter: '', minPercentage: 0, maxPercentage: 100, gradePoint: 0, isSpecial: false });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Grading scale</h1>
        <p className="text-slate-600">
          Configure letter grades, percentage bands, and grade points. Include W/I entries.
        </p>
      </div>
      <form onSubmit={save} className="card grid gap-3 md:grid-cols-6">
        <input
          className="rounded border border-slate-200 px-3 py-2 uppercase"
          placeholder="Letter"
          value={form.letter || ''}
          onChange={(e) => setForm({ ...form, letter: e.target.value.toUpperCase() })}
          required
        />
        <input
          type="number"
          className="rounded border border-slate-200 px-3 py-2"
          placeholder="Min %"
          value={form.minPercentage}
          onChange={(e) => setForm({ ...form, minPercentage: Number(e.target.value) })}
          required
        />
        <input
          type="number"
          className="rounded border border-slate-200 px-3 py-2"
          placeholder="Max %"
          value={form.maxPercentage}
          onChange={(e) => setForm({ ...form, maxPercentage: Number(e.target.value) })}
          required
        />
        <input
          type="number"
          step="0.1"
          className="rounded border border-slate-200 px-3 py-2"
          placeholder="Grade point"
          value={form.gradePoint}
          onChange={(e) => setForm({ ...form, gradePoint: Number(e.target.value) })}
          required
        />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isSpecial}
            onChange={(e) => setForm({ ...form, isSpecial: e.target.checked })}
          />
          Special (W/I)
        </label>
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white md:col-span-6"
        >
          Add entry
        </button>
      </form>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-slate-500">
              <th className="py-2">Letter</th>
              <th>Min %</th>
              <th>Max %</th>
              <th>Grade point</th>
              <th>Special</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((e) => (
              <tr key={e._id}>
                <td className="py-2 font-semibold text-slate-800">{e.letter}</td>
                <td>{e.minPercentage}</td>
                <td>{e.maxPercentage}</td>
                <td>{e.gradePoint}</td>
                <td>{e.isSpecial ? 'Yes' : 'No'}</td>
                <td>
                  <button
                    className="text-xs font-semibold text-red-600"
                    onClick={async () => {
                      await api.admin.gradeScale.remove(e._id);
                      load();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
