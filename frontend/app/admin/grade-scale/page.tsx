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
  const [editing, setEditing] = useState<GradeScaleEntry | null>(null);

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
                <td className="py-2 font-semibold text-slate-800">
                  {editing?._id === e._id ? (
                    <input
                      className="w-20 rounded border border-slate-200 px-2 py-1 uppercase"
                      value={editing.letter}
                      onChange={(ev) => setEditing({ ...editing, letter: ev.target.value.toUpperCase() })}
                    />
                  ) : (
                    e.letter
                  )}
                </td>
                <td>
                  {editing?._id === e._id ? (
                    <input
                      type="number"
                      className="w-20 rounded border border-slate-200 px-2 py-1"
                      value={editing.minPercentage}
                      onChange={(ev) =>
                        setEditing({ ...editing, minPercentage: Number(ev.target.value) })
                      }
                    />
                  ) : (
                    e.minPercentage
                  )}
                </td>
                <td>
                  {editing?._id === e._id ? (
                    <input
                      type="number"
                      className="w-20 rounded border border-slate-200 px-2 py-1"
                      value={editing.maxPercentage}
                      onChange={(ev) =>
                        setEditing({ ...editing, maxPercentage: Number(ev.target.value) })
                      }
                    />
                  ) : (
                    e.maxPercentage
                  )}
                </td>
                <td>
                  {editing?._id === e._id ? (
                    <input
                      type="number"
                      step="0.1"
                      className="w-20 rounded border border-slate-200 px-2 py-1"
                      value={editing.gradePoint}
                      onChange={(ev) => setEditing({ ...editing, gradePoint: Number(ev.target.value) })}
                    />
                  ) : (
                    e.gradePoint
                  )}
                </td>
                <td>
                  {editing?._id === e._id ? (
                    <input
                      type="checkbox"
                      checked={editing.isSpecial}
                      onChange={(ev) => setEditing({ ...editing, isSpecial: ev.target.checked })}
                    />
                  ) : (
                    e.isSpecial ? 'Yes' : 'No'
                  )}
                </td>
                <td className="space-x-2 whitespace-nowrap">
                  {editing?._id === e._id ? (
                    <>
                      <button
                        className="text-xs font-semibold text-primary"
                        onClick={async () => {
                          if (!editing) return;
                          await api.admin.gradeScale.update(e._id, editing);
                          setEditing(null);
                          load();
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="text-xs font-semibold text-slate-500"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-xs font-semibold text-primary"
                        onClick={() => setEditing(e)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs font-semibold text-red-600"
                        onClick={async () => {
                          await api.admin.gradeScale.remove(e._id);
                          load();
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
