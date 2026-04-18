'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Button from '../../../components/ui/Button';
import Switch from '../../../components/ui/Switch';
import { GradeScaleEntry } from '../../../types';

type SortKey = 'letter' | 'minPercentage' | 'gradePoint';

export default function GradeScalePage() {
  const [entries, setEntries] = useState<GradeScaleEntry[]>([]);
  const [form, setForm] = useState<Partial<GradeScaleEntry>>({
    letter: '',
    minPercentage: 0,
    maxPercentage: 100,
    gradePoint: 0,
    isSpecial: false,
  });
  const [editing, setEditing] = useState<GradeScaleEntry | null>(null);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('minPercentage');
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
    setForm({
      letter: '',
      minPercentage: 0,
      maxPercentage: 100,
      gradePoint: 0,
      isSpecial: false,
    });
    await load();
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
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
    return [...items].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'letter') return a.letter.localeCompare(b.letter) * dir;
      if (sortKey === 'gradePoint') return (a.gradePoint - b.gradePoint) * dir;
      return (a.minPercentage - b.minPercentage) * dir;
    });
  }, [entries, query, sortKey, sortDir]);

  const SortBtn = ({ label, sk }: { label: string; sk: SortKey }) => (
    <button
      type="button"
      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-stone-500 transition-colors hover:text-stone-800"
      onClick={() => handleSort(sk)}
    >
      {label}
      <ArrowUpDown
        className={`h-3 w-3 transition-opacity ${
          sortKey === sk ? 'text-primary-700 opacity-100' : 'opacity-40'
        }`}
      />
    </button>
  );

  return (
    <AdminShell
      title="Grade scale"
      subtitle="Configure letter grades, percentage bands, grade points, and special W/I entries."
    >
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">Add grade entry</h2>
        <form onSubmit={save} className="grid gap-3 sm:grid-cols-6">
          <input
            className="input font-mono uppercase"
            placeholder="Letter"
            value={form.letter || ''}
            onChange={(e) => setForm({ ...form, letter: e.target.value.toUpperCase() })}
            required
          />
          <input
            type="number"
            className="input font-mono"
            placeholder="Min %"
            value={form.minPercentage}
            onChange={(e) => setForm({ ...form, minPercentage: Number(e.target.value) })}
            required
          />
          <input
            type="number"
            className="input font-mono"
            placeholder="Max %"
            value={form.maxPercentage}
            onChange={(e) => setForm({ ...form, maxPercentage: Number(e.target.value) })}
            required
          />
          <input
            type="number"
            step="0.1"
            className="input font-mono"
            placeholder="Grade point"
            value={form.gradePoint}
            onChange={(e) => setForm({ ...form, gradePoint: Number(e.target.value) })}
            required
          />
          <div className="flex items-center">
            <Switch
              checked={!!form.isSpecial}
              onChange={(next) => setForm({ ...form, isSpecial: next })}
              label="Special (W/I)"
            />
          </div>
          <Button type="submit" size="sm">
            Add entry
          </Button>
        </form>
      </div>

      <hr className="border-stone-200" />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-stone-700">
            All entries
            <span className="ml-2 font-normal text-stone-400">({filtered.length})</span>
          </h2>
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              className="input pl-9 text-xs"
              placeholder="Search grades"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="pb-2 pr-4">
                  <SortBtn label="Letter" sk="letter" />
                </th>
                <th className="pb-2 pr-4">
                  <SortBtn label="Min %" sk="minPercentage" />
                </th>
                <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
                  Max %
                </th>
                <th className="pb-2 pr-4">
                  <SortBtn label="Points" sk="gradePoint" />
                </th>
                <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
                  Special
                </th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((e) => (
                <tr key={e._id} className="text-sm">
                  <td className="py-2.5 pr-4 font-mono font-semibold text-stone-800">
                    {editing?._id === e._id ? (
                      <input
                        className="input w-16 font-mono uppercase"
                        value={editing.letter}
                        onChange={(ev) =>
                          setEditing({
                            ...editing,
                            letter: ev.target.value.toUpperCase(),
                          })
                        }
                      />
                    ) : (
                      e.letter
                    )}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-stone-600">
                    {editing?._id === e._id ? (
                      <input
                        type="number"
                        className="input w-16 font-mono"
                        value={editing.minPercentage}
                        onChange={(ev) =>
                          setEditing({
                            ...editing,
                            minPercentage: Number(ev.target.value),
                          })
                        }
                      />
                    ) : (
                      e.minPercentage
                    )}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-stone-600">
                    {editing?._id === e._id ? (
                      <input
                        type="number"
                        className="input w-16 font-mono"
                        value={editing.maxPercentage}
                        onChange={(ev) =>
                          setEditing({
                            ...editing,
                            maxPercentage: Number(ev.target.value),
                          })
                        }
                      />
                    ) : (
                      e.maxPercentage
                    )}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-stone-600">
                    {editing?._id === e._id ? (
                      <input
                        type="number"
                        step="0.1"
                        className="input w-16 font-mono"
                        value={editing.gradePoint}
                        onChange={(ev) =>
                          setEditing({
                            ...editing,
                            gradePoint: Number(ev.target.value),
                          })
                        }
                      />
                    ) : (
                      e.gradePoint
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-stone-500">
                    {editing?._id === e._id ? (
                      <input
                        type="checkbox"
                        className="accent-primary-700"
                        checked={!!editing.isSpecial}
                        onChange={(ev) =>
                          setEditing({
                            ...editing,
                            isSpecial: ev.target.checked,
                          })
                        }
                      />
                    ) : e.isSpecial ? (
                      <span className="font-mono text-xs text-stone-400">W/I</span>
                    ) : (
                      <span className="text-stone-200">—</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    {editing?._id === e._id ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            if (!editing) return;
                            await api.admin.gradeScale.update(e._id, editing);
                            setEditing(null);
                            await load();
                          }}
                        >
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditing(e)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={async () => {
                            await api.admin.gradeScale.remove(e._id);
                            await load();
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-sm text-stone-400">
                    No grade entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
