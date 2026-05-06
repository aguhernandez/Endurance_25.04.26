import { useState } from 'react';
import { Sparkles, X, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Zap, TrendingUp, Calendar, AlertTriangle, CalendarPlus, Loader2, Bike, PersonStanding, Waves, Trophy } from 'lucide-react';
import { useAIBlock, AIGeneratedBlock, AIBlockWeek, GenerateBlockOptions } from '../../hooks/useAIBlock';

const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SPORT_COLORS: Record<string, string> = {
  cycling: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  running: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  swimming: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  triathlon: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
};

const MICROCYCLE_LABELS: Record<string, { label: string; color: string }> = {
  load: { label: 'Build', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  load_peak: { label: 'Peak Load', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  deload: { label: 'Deload', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
};

const CATEGORY_COLORS: Record<string, string> = {
  endurance: 'text-blue-600 dark:text-blue-400',
  threshold: 'text-amber-600 dark:text-amber-400',
  vo2max: 'text-red-600 dark:text-red-400',
  sprint: 'text-rose-600 dark:text-rose-400',
  recovery: 'text-emerald-600 dark:text-emerald-400',
  strength: 'text-gray-600 dark:text-gray-400',
  other: 'text-gray-500 dark:text-gray-400',
};

const SPORTS = [
  { value: 'cycling', label: 'Cycling', icon: Bike },
  { value: 'running', label: 'Running', icon: PersonStanding },
  { value: 'swimming', label: 'Swimming', icon: Waves },
  { value: 'triathlon', label: 'Triathlon', icon: Trophy },
];

const SUB_DISCIPLINES: Record<string, { value: string; label: string }[]> = {
  cycling: [
    { value: 'road', label: 'Road' },
    { value: 'mtb', label: 'MTB' },
    { value: 'tt', label: 'Time Trial' },
    { value: 'gravel', label: 'Gravel' },
    { value: 'track', label: 'Track' },
  ],
  running: [
    { value: 'road', label: 'Road' },
    { value: 'trail', label: 'Trail' },
    { value: 'track', label: 'Track' },
    { value: 'ultra', label: 'Ultra' },
  ],
  swimming: [
    { value: 'pool', label: 'Pool' },
    { value: 'open_water', label: 'Open Water' },
  ],
  triathlon: [
    { value: 'sprint', label: 'Sprint' },
    { value: 'olympic', label: 'Olympic' },
    { value: '70.3', label: '70.3 / Half' },
    { value: '140.6', label: 'Ironman' },
  ],
};

const FOCUS_OPTIONS = [
  { value: 'general', label: 'General Fitness' },
  { value: 'base', label: 'Aerobic Base' },
  { value: 'threshold', label: 'Threshold / FTP' },
  { value: 'vo2max', label: 'VO2max Power' },
  { value: 'race_prep', label: 'Race Preparation' },
  { value: 'recovery', label: 'Recovery Block' },
];

interface AIBlockGeneratorProps {
  athleteId: string;
  athleteName?: string;
  coachId?: string;
  requestedByRole: 'athlete' | 'coach';
  onClose: () => void;
}

function SelectChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
        selected
          ? 'border-primary-yellow bg-primary-yellow text-gray-900 shadow-sm'
          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
    >
      {children}
    </button>
  );
}

function BlockWeekCard({ week, index }: { week: AIBlockWeek; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const mc = MICROCYCLE_LABELS[week.microcycle_type] || MICROCYCLE_LABELS.load;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900 dark:text-white text-sm">Week {week.week_number}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mc.color}`}>{mc.label}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{week.week_start_date}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{week.sessions.length}</span> sessions ·{' '}
            <span className="font-semibold text-gray-800 dark:text-gray-200">{week.target_impulse}</span> impulse
          </span>
          {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-3 bg-white dark:bg-gray-800">
          {week.weekly_notes && (
            <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 italic">
              {week.weekly_notes}
            </div>
          )}
          <div className="space-y-2">
            {week.sessions.map((session, si) => (
              <div key={si} className="flex gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                <div className="flex-shrink-0 w-10 text-center">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{DAY_NAMES[session.day_of_week] || `D${session.day_of_week}`}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{session.session_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SPORT_COLORS[session.sport] || 'bg-gray-100 text-gray-600'}`}>
                      {session.sport}
                    </span>
                    <span className={`text-xs font-medium capitalize ${CATEGORY_COLORS[session.category] || 'text-gray-500'}`}>
                      {session.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{session.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {session.estimated_duration_minutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={10} />
                      Impulse {session.estimated_impulse}
                    </span>
                    {session.target_percent_ftp && (
                      <span>~{session.target_percent_ftp}% FTP</span>
                    )}
                    {session.target_zone && !session.target_percent_ftp && (
                      <span>Z{session.target_zone}</span>
                    )}
                  </div>
                  {session.key_points?.length > 0 && (
                    <ul className="space-y-0.5">
                      {session.key_points.map((pt, pi) => (
                        <li key={pi} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                          <span className="mt-0.5 flex-shrink-0 w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BlockCard({
  block, onAccept, onReject, onApplyToCalendar, applying, applyResult, isCoach,
}: {
  block: AIGeneratedBlock;
  onAccept: (id: string, feedback?: string) => void;
  onReject: (id: string, feedback?: string) => void;
  onApplyToCalendar: (id: string) => void;
  applying: boolean;
  applyResult: { success: boolean; insertedCount: number; errors: string[] } | null;
  isCoach: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [confirmApply, setConfirmApply] = useState(false);

  const statusConfig = {
    pending: { icon: <Clock size={13} />, label: 'Pending review', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
    accepted: { icon: <CheckCircle size={13} />, label: 'Accepted', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' },
    applied: { icon: <CheckCircle size={13} />, label: 'Applied', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' },
    rejected: { icon: <XCircle size={13} />, label: 'Rejected', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
  };
  const sc = statusConfig[block.status];
  const totalSessions = block.weeks.reduce((sum, w) => sum + w.sessions.length, 0);
  const totalImpulse = block.weeks.reduce((sum, w) => sum + w.target_impulse, 0);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Sparkles size={14} className="text-primary-yellow flex-shrink-0" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{block.block_name}</h4>
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${sc.color}`}>
                {sc.icon} {sc.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {block.block_start_date} → {block.block_end_date}
              </span>
              <span>{block.block_weeks} weeks · {totalSessions} sessions · {totalImpulse} total impulse</span>
              {block.requested_by_role === 'coach' && (
                <span className="text-blue-600 dark:text-blue-400 font-medium">Sent by coach</span>
              )}
            </div>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex-shrink-0 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
          >
            {expanded ? 'Collapse' : 'View block'}
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4 bg-white dark:bg-gray-800">
          {(block as AIGeneratedBlock & { rationale?: string }).rationale && (
            <div className="bg-primary-yellow/10 border border-primary-yellow/30 rounded-xl px-4 py-3">
              <div className="flex items-start gap-2">
                <Sparkles size={14} className="text-primary-yellow mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {(block as AIGeneratedBlock & { rationale?: string }).rationale}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {block.weeks.map((week, i) => (
              <BlockWeekCard key={week.week_number} week={week} index={i} />
            ))}
          </div>

          {block.athlete_feedback && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">Feedback: </span>
              {block.athlete_feedback}
            </div>
          )}

          {applyResult && (
            <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${applyResult.success ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50'}`}>
              {applyResult.success
                ? <CheckCircle size={15} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                : <AlertTriangle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />}
              <p className={`text-sm ${applyResult.success ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-400'}`}>
                {applyResult.success
                  ? `${applyResult.insertedCount} session${applyResult.insertedCount !== 1 ? 's' : ''} added to the calendar.`
                  : applyResult.errors[0] || 'Failed to apply block to calendar.'}
              </p>
            </div>
          )}

          {(block.status === 'pending' || block.status === 'accepted') && block.status !== 'applied' && (
            <div className="space-y-3">
              {showFeedback ? (
                <div className="space-y-2">
                  <textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder={isCoach ? "Add coaching notes (optional)..." : "Add feedback or notes (optional)..."}
                    rows={2}
                    className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-yellow resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAccept(block.id, feedback || undefined)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                    >
                      <CheckCircle size={14} />
                      Accept Block
                    </button>
                    <button
                      onClick={() => onReject(block.id, feedback || undefined)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-sm font-medium transition-colors"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {block.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAccept(block.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                      >
                        <CheckCircle size={14} />
                        Accept Block
                      </button>
                      <button
                        onClick={() => setShowFeedback(true)}
                        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
                      >
                        Add feedback
                      </button>
                      <button
                        onClick={() => onReject(block.id)}
                        className="px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-sm font-medium transition-colors"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  )}

                  {!confirmApply ? (
                    <button
                      onClick={() => setConfirmApply(true)}
                      disabled={applying}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-white disabled:opacity-50 text-white dark:text-gray-900 text-sm font-medium transition-colors"
                    >
                      <CalendarPlus size={14} />
                      Apply to Calendar
                    </button>
                  ) : (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-3 space-y-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Apply {totalSessions} sessions to the calendar?</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Sessions will be created as planned workouts from {block.block_start_date} to {block.block_end_date}.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { onApplyToCalendar(block.id); setConfirmApply(false); }}
                          disabled={applying}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 text-white dark:text-gray-900 text-sm font-medium transition-colors"
                        >
                          {applying ? <Loader2 size={14} className="animate-spin" /> : <CalendarPlus size={14} />}
                          {applying ? 'Applying...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setConfirmApply(false)}
                          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {block.status === 'applied' && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl px-4 py-3">
              <CheckCircle size={14} />
              This block has been applied to the athlete calendar.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AIBlockGenerator({
  athleteId,
  athleteName,
  coachId,
  requestedByRole,
  onClose,
}: AIBlockGeneratorProps) {
  const { blocks, settings, loading, generating, error, generateBlock, updateBlockStatus, applyBlockToCalendar } = useAIBlock(athleteId);

  const [showForm, setShowForm] = useState(false);

  const [blockLength, setBlockLength] = useState<'single' | 1 | 2 | 4>(4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(4);
  const [sport, setSport] = useState('cycling');
  const [subDisciplines, setSubDisciplines] = useState<string[]>([]);
  const [focus, setFocus] = useState('general');
  const [additionalContext, setAdditionalContext] = useState('');
  const [sessionDurationHours, setSessionDurationHours] = useState(1.5);
  const [weeklyHours, setWeeklyHours] = useState(8);

  const [blockStartDate, setBlockStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + (7 - d.getDay() + 1) % 7 || 7);
    return d.toISOString().split('T')[0];
  });

  const [generatedBlock, setGeneratedBlock] = useState<AIGeneratedBlock | null>(null);
  const [applyingBlockId, setApplyingBlockId] = useState<string | null>(null);
  const [applyResults, setApplyResults] = useState<Record<string, { success: boolean; insertedCount: number; errors: string[] }>>({});

  const toggleSubDiscipline = (val: string) => {
    setSubDisciplines(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };

  const handleSportChange = (s: string) => {
    setSport(s);
    setSubDisciplines([]);
  };

  const handleGenerate = async () => {
    const options: GenerateBlockOptions = {
      athlete_id: athleteId,
      coach_id: coachId,
      requested_by_role: requestedByRole,
      block_weeks: blockLength === 'single' ? 1 : blockLength,
      block_start_date: blockStartDate,
      focus,
      additional_context: additionalContext || undefined,
      sessions_per_week: sessionsPerWeek,
      sport,
      sub_disciplines: subDisciplines.length > 0 ? subDisciplines : undefined,
      session_duration_hours: blockLength === 'single' ? sessionDurationHours : undefined,
      weekly_hours: blockLength !== 'single' ? weeklyHours : undefined,
    };
    const block = await generateBlock(options);
    if (block) {
      setGeneratedBlock(block);
      setShowForm(false);
    }
  };

  const handleAccept = async (blockId: string, feedback?: string) => {
    await updateBlockStatus(blockId, 'accepted', feedback);
  };

  const handleReject = async (blockId: string, feedback?: string) => {
    await updateBlockStatus(blockId, 'rejected', feedback);
  };

  const handleApplyToCalendar = async (blockId: string) => {
    setApplyingBlockId(blockId);
    const result = await applyBlockToCalendar(blockId, coachId);
    setApplyResults(prev => ({ ...prev, [blockId]: result }));
    setApplyingBlockId(null);
  };

  const pendingBlocks = blocks.filter(b => b.status === 'pending');
  const historyBlocks = blocks.filter(b => b.status !== 'pending');

  const subDiscs = SUB_DISCIPLINES[sport] || [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-yellow flex items-center justify-center shadow-sm">
              <Sparkles size={17} className="text-gray-900" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white font-heading">AI Training Block</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-body">
                {athleteName ? `For ${athleteName}` : 'Powered by Banister model + training library'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {error && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3">
              <AlertTriangle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400 font-body">{error}</p>
            </div>
          )}

          {!settings?.ai_enabled && (
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3">
              <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400 font-body">
                AI block generation is currently disabled by the administrator.
              </p>
            </div>
          )}

          {!showForm && !generating && (
            <button
              onClick={() => setShowForm(true)}
              disabled={!settings?.ai_enabled}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary-yellow hover:bg-amber-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-900 font-semibold text-sm shadow-md shadow-primary-yellow/20 transition-all active:scale-[0.99] font-body"
            >
              <Sparkles size={16} />
              Generate New Training Block with AI
            </button>
          )}

          {showForm && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-5 space-y-6">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm font-heading">Block Configuration</h3>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 font-body">Sport</label>
                <div className="grid grid-cols-4 gap-2">
                  {SPORTS.map(s => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => handleSportChange(s.value)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all font-body text-xs font-medium ${
                          sport === s.value
                            ? 'border-primary-yellow bg-primary-yellow text-gray-900'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={18} />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {subDiscs.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-body">Discipline (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {subDiscs.map(d => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => toggleSubDiscipline(d.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all font-body ${
                          subDisciplines.includes(d.value)
                            ? 'border-primary-yellow bg-primary-yellow text-gray-900'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 font-body">Block Length</label>
                <div className="flex gap-2 flex-wrap">
                  {(['single', 1, 2, 4] as const).map(opt => (
                    <SelectChip key={String(opt)} selected={blockLength === opt} onClick={() => setBlockLength(opt)}>
                      {opt === 'single' ? '1 Session' : opt === 1 ? '1 Week' : `${opt} Weeks`}
                    </SelectChip>
                  ))}
                </div>
              </div>

              {blockLength === 'single' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 font-body">
                      Session Duration
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[0.5, 1, 1.5, 2, 2.5, 3].map(h => (
                        <SelectChip key={h} selected={sessionDurationHours === h} onClick={() => setSessionDurationHours(h)}>
                          {h < 1 ? `${h * 60}m` : `${h}h`}
                        </SelectChip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 font-body">Session Date</label>
                    <input
                      type="date"
                      value={blockStartDate}
                      onChange={e => setBlockStartDate(e.target.value)}
                      className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-yellow font-body"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 font-body">
                    Weekly Training Volume
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[4, 6, 8, 10, 12, 15].map(h => (
                      <SelectChip key={h} selected={weeklyHours === h} onClick={() => setWeeklyHours(h)}>
                        {h}h / week
                      </SelectChip>
                    ))}
                  </div>
                </div>
              )}

              {blockLength !== 'single' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 font-body">
                    Training Frequency
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7].map(n => (
                      <SelectChip key={n} selected={sessionsPerWeek === n} onClick={() => setSessionsPerWeek(n)}>
                        {n}x
                      </SelectChip>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-body">Training Focus</label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_OPTIONS.map(f => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFocus(f.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all font-body ${
                        focus === f.value
                          ? 'border-primary-yellow bg-primary-yellow text-gray-900'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {blockLength !== 'single' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 font-body">Start Date</label>
                  <input
                    type="date"
                    value={blockStartDate}
                    onChange={e => setBlockStartDate(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-yellow font-body"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 font-body">
                  {requestedByRole === 'coach' ? 'Coaching Notes' : 'Additional Context'} (optional)
                </label>
                <textarea
                  value={additionalContext}
                  onChange={e => setAdditionalContext(e.target.value)}
                  placeholder={requestedByRole === 'coach'
                    ? "e.g. Athlete is preparing for a 70.3 in 8 weeks. Focus on bike power..."
                    : "e.g. I've been feeling extra fatigued and have a race in 6 weeks..."}
                  rows={2}
                  className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-yellow resize-none font-body"
                />
              </div>

              <div className="bg-primary-yellow/10 border border-primary-yellow/30 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-body flex items-start gap-2">
                  <Sparkles size={12} className="text-primary-yellow mt-0.5 flex-shrink-0" />
                  Sessions will be selected from the training library ({sport} workouts) and matched to the athlete's physiology and training history.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-yellow hover:bg-amber-400 text-gray-900 font-semibold text-sm shadow-sm transition-all font-body"
                >
                  <Sparkles size={15} />
                  {blockLength === 'single' ? 'Generate Session' : 'Generate Block'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {generating && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary-yellow flex items-center justify-center shadow-lg">
                  <Sparkles size={28} className="text-gray-900 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-primary-yellow animate-ping opacity-25" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 dark:text-white mb-1 font-heading">Analyzing your training data...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-body">Selecting workouts from library and designing your block</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                  <TrendingUp size={14} className="mx-auto mb-1 text-blue-500" />
                  Banister model
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                  <Zap size={14} className="mx-auto mb-1 text-primary-yellow" />
                  Training library
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                  <Calendar size={14} className="mx-auto mb-1 text-emerald-500" />
                  Athlete history
                </div>
              </div>
            </div>
          )}

          {pendingBlocks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2 font-heading">
                <Clock size={14} className="text-primary-yellow" />
                Pending Review ({pendingBlocks.length})
              </h3>
              {pendingBlocks.map(block => (
                <BlockCard
                  key={block.id}
                  block={block}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onApplyToCalendar={handleApplyToCalendar}
                  applying={applyingBlockId === block.id}
                  applyResult={applyResults[block.id] ?? null}
                  isCoach={requestedByRole === 'coach'}
                />
              ))}
            </div>
          )}

          {historyBlocks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm font-heading">Previous Blocks</h3>
              {historyBlocks.map(block => (
                <BlockCard
                  key={block.id}
                  block={block}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onApplyToCalendar={handleApplyToCalendar}
                  applying={applyingBlockId === block.id}
                  applyResult={applyResults[block.id] ?? null}
                  isCoach={requestedByRole === 'coach'}
                />
              ))}
            </div>
          )}

          {!loading && blocks.length === 0 && !showForm && !generating && (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-primary-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Sparkles size={22} className="text-primary-yellow" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto font-body">
                No AI blocks yet. Generate your first block using workouts from the training library, tailored to this athlete.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
