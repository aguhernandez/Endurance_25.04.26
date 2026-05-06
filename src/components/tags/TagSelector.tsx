import { useState, useEffect, useRef } from 'react';
import { X, Plus, Tag, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Tag as TagType, TagCategory } from '../../types/workout';

interface TagSelectorProps {
  selectedTags: TagType[];
  onChange: (tags: TagType[]) => void;
  createdBy?: string;
}

const CATEGORY_COLORS: Record<TagCategory, string> = {
  training: '#3b82f6',
  nutrition: '#10b981',
  recovery: '#6366f1',
  performance: '#f59e0b',
  mindset: '#ec4899',
  methodology: '#8b5cf6',
  other: '#6b7280',
};

const CATEGORY_LABELS: Record<TagCategory, string> = {
  training: 'Training',
  nutrition: 'Nutrition',
  recovery: 'Recovery',
  performance: 'Performance',
  mindset: 'Mindset',
  methodology: 'Methodology',
  other: 'Other',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a2e' : '#ffffff';
}

export default function TagSelector({ selectedTags, onChange, createdBy }: TagSelectorProps) {
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagNameEs, setNewTagNameEs] = useState('');
  const [newTagCategory, setNewTagCategory] = useState<TagCategory>('training');
  const [newTagColor, setNewTagColor] = useState('#fdda36');
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadTags() {
    const { data } = await supabase.from('tags').select('*').order('name');
    if (data) setAllTags(data as TagType[]);
  }

  const selectedIds = new Set(selectedTags.map(t => t.id));

  const filtered = allTags.filter(t => {
    if (selectedIds.has(t.id)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.name_es || '').toLowerCase().includes(q) ||
      t.slug.includes(q)
    );
  });

  function addTag(tag: TagType) {
    onChange([...selectedTags, tag]);
    setSearch('');
    inputRef.current?.focus();
  }

  function removeTag(tagId: string) {
    onChange(selectedTags.filter(t => t.id !== tagId));
  }

  async function createTag() {
    if (!newTagName.trim()) return;
    setSaving(true);
    const slug = slugify(newTagName) || `tag-${Date.now()}`;
    const insertData: any = {
      name: newTagName.trim(),
      name_es: newTagNameEs.trim() || null,
      slug,
      category: newTagCategory,
      color: newTagColor,
    };
    if (createdBy) insertData.created_by = createdBy;

    const { data, error } = await supabase
      .from('tags')
      .insert(insertData)
      .select()
      .maybeSingle();

    setSaving(false);
    if (!error && data) {
      const newTag = data as TagType;
      setAllTags(prev => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)));
      addTag(newTag);
      setCreating(false);
      setNewTagName('');
      setNewTagNameEs('');
      setNewTagCategory('training');
      setNewTagColor('#fdda36');
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-body">
        Tags
      </label>

      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-body transition"
            style={{ backgroundColor: tag.color, color: contrastColor(tag.color) }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-0.5 rounded-full hover:opacity-70 transition"
              style={{ color: contrastColor(tag.color) }}
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-text"
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        >
          <Tag size={14} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search or add tags..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none font-body"
          />
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-72 overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 && !creating && (
                <div className="px-4 py-3 text-sm text-gray-400 font-body text-center">
                  {search ? `No tags found for "${search}"` : 'No more tags available'}
                </div>
              )}

              {filtered.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 font-body flex-1">
                    {tag.name}
                    {tag.name_es && (
                      <span className="ml-1.5 text-xs text-gray-400">({tag.name_es})</span>
                    )}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-body"
                    style={{
                      backgroundColor: CATEGORY_COLORS[tag.category as TagCategory] + '20',
                      color: CATEGORY_COLORS[tag.category as TagCategory],
                    }}
                  >
                    {CATEGORY_LABELS[tag.category as TagCategory]}
                  </span>
                </button>
              ))}
            </div>

            {!creating && (
              <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                <button
                  type="button"
                  onClick={() => { setCreating(true); setNewTagName(search); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition font-body font-medium"
                >
                  <Plus size={14} />
                  Create new tag{search ? ` "${search}"` : ''}
                </button>
              </div>
            )}

            {creating && (
              <div className="border-t border-gray-100 dark:border-gray-700 p-3 space-y-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-body flex items-center gap-1.5">
                  <Plus size={12} /> New Tag
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-body">Name (EN) *</label>
                    <input
                      type="text"
                      value={newTagName}
                      onChange={e => setNewTagName(e.target.value)}
                      placeholder="e.g., Aerobic Base"
                      className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-body"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-body">Name (ES)</label>
                    <input
                      type="text"
                      value={newTagNameEs}
                      onChange={e => setNewTagNameEs(e.target.value)}
                      placeholder="e.g., Base Aeróbica"
                      className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-body"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-body">Category</label>
                    <select
                      value={newTagCategory}
                      onChange={e => setNewTagCategory(e.target.value as TagCategory)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-body"
                    >
                      {(Object.keys(CATEGORY_LABELS) as TagCategory[]).map(cat => (
                        <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-body">Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newTagColor}
                        onChange={e => setNewTagColor(e.target.value)}
                        className="w-8 h-8 rounded border border-gray-200 dark:border-gray-600 cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 font-body font-mono">{newTagColor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setCreating(false); setNewTagName(''); setNewTagNameEs(''); }}
                    className="flex-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition font-body"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={createTag}
                    disabled={!newTagName.trim() || saving}
                    className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-body font-medium"
                  >
                    {saving ? 'Creating...' : 'Create Tag'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {allTags.length > 0 && selectedTags.length === 0 && !open && (
        <div className="flex flex-wrap gap-1 pt-0.5">
          {allTags.slice(0, 6).map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body border transition hover:opacity-80"
              style={{
                borderColor: tag.color,
                color: tag.color,
                backgroundColor: tag.color + '15',
              }}
            >
              <Plus size={10} />
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
