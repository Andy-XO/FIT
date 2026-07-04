import { useCallback, useEffect, useMemo, useState } from 'react';
import { checklist, healthFlags } from '../data/profile';

const STORAGE_KEY = 'fit-checklist-v1';

// Every tickable line across all groups, with a stable id.
const allGroups = [...checklist, healthFlags];
export const totalItems = allGroups.reduce((n, g) => n + g.items.length, 0);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function useChecklist() {
  const [checked, setChecked] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [checked]);

  const toggle = useCallback((id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const isChecked = useCallback((id) => checked.has(id), [checked]);

  const reset = useCallback(() => setChecked(new Set()), []);

  const completion = useMemo(
    () => (totalItems ? checked.size / totalItems : 0),
    [checked]
  );

  return { isChecked, toggle, reset, completion, count: checked.size, totalItems };
}
