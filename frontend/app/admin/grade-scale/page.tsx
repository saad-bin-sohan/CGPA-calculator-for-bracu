'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Switch from '../../../components/ui/Switch';
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
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<'letter' | 'minPercentage' | 'gradePoint'>('minPercentage');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

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

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const items = entries.filter(
      (e) =>
        !q ||
        e.letter.toLowerCase().includes(q) ||
        e.gradePoint.toString().includes(q) ||
        e.minPercentage.toString().includes(q)
    );
    const sorted = [...items].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'letter') return a.letter.localeCompare(b.letter) * dir;
      if (sortKey === 'gradePoint') return (a.gradePoint - b.gradePoint) * dir;
      return (a.minPercentage - b.minPercentage) * dir;
    });
    return sorted;
  }, [entries, query, sortKey, sortDir]);

  return (
    <AdminShell
      title="Grading scale"
      subtitle="Configure letter grades, percentage bands, grade points, and special W/I entries."
    >
      <Card>
        <form onSubmit={save} className="grid gap-3 md:grid-cols-6">
          <input
            className="input uppercase"
            placeholder="Letter"
            value={form.letter || ''}
            onChange={(e) => setForm({ ...form, letter: e.target.value.toUpperCase() })}
            required
          />
          <input
            type="number"
            className="input"
            placeholder="Min %"
            value={form.minPercentage}
            onChange={(e) => setForm({ ...form, minPercentage: Number(e.target.value) })}
            required
          />
          <input
            type="number"
            className="input"
            placeholder="Max %"
            value={form.maxPercentage}
            onChange={(e) => setForm({ ...form, maxPercentage: Number(e.target.value) })}
            required
          />
          <input
            type="number"
            step="0.1"
            className="input"
            placeholder="Grade point"
            value={form.gradePoint}
            onChange={(e) => setForm({ ...form, gradePoint: Number(e.target.value) })}
            required
          />
          <Switch
            checked={!!form.isSpecial}
            onChange={(next) => setForm({ ...form, isSpecial: next })}
            label="Special (W/I)"
          />
          <Button type="submit" className="md:col-span-6">
            Add entry
          </Button>
        </form>
      </Card>

      <Card className="space-y-4 overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Grade entries</h2>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search grades"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-slate-500">
              <th className="py-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1"
                  onClick={() => {
                    setSortKey('letter');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Letter <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="inline-flex items-center gap-1"
                  onClick={() => {
                    setSortKey('minPercentage');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Min % <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th>Max %</th>
              <th>
                <button
                  type="button"
                  className="inline-flex items-center gap-1"
                  onClick={() => {
                    setSortKey('gradePoint');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Grade point <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th>Special</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((e) => (
              <tr key={e._id}>
                <td className="py-2 font-semibold text-slate-800">
                  {editing?._id === e._id ? (
                    <input
                      className="input w-20 uppercase"
                      value={editing.letter}
                      onChange={(ev) =>
                        setEditing({ ...editing, letter: ev.target.value.toUpperCase() })
                      }
                    />
                  ) : (
                    e.letter
                  )}
                </td>
                <td>
                  {editing?._id === e._id ? (
                    <input
                      type="number"
                      className="input w-20"
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
                      className="input w-20"
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
                      className="input w-20"
                      value={editing.gradePoint}
                      onChange={(ev) =>
                        setEditing({ ...editing, gradePoint: Number(ev.target.value) })
                      }
                    />
                  ) : (
                    e.gradePoint
                  )}
                </td>
                <td>
                  {editing?._id === e._id ? (
                    <input
                      type="checkbox"
                      checked={!!editing.isSpecial}
                      onChange={(ev) => setEditing({ ...editing, isSpecial: ev.target.checked })}
                    />
                  ) : (
                    (e.isSpecial ? 'Yes' : 'No')
                  )}
                </td>
                <td className="whitespace-nowrap">
                  {editing?._id === e._id ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (!editing) return;
                          await api.admin.gradeScale.update(e._id, editing);
                          setEditing(null);
                          load();
                        }}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditing(e)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={async () => {
                          await api.admin.gradeScale.remove(e._id);
                          load();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}
