import { useState } from 'react';
import { X, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { ProgramTemplate, useProgramTemplates } from '../../hooks/useProgramTemplates';

interface ApplyProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName?: string;
}

export default function ApplyProgramModal({
  isOpen,
  onClose,
  athleteId,
  athleteName
}: ApplyProgramModalProps) {
  const { programs, loading, applyProgram } = useProgramTemplates();
  const [selectedProgram, setSelectedProgram] = useState<ProgramTemplate | null>(null);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleApply = async () => {
    if (!selectedProgram) return;

    setApplying(true);
    setResult(null);

    const response = await applyProgram(
      athleteId,
      selectedProgram.id,
      new Date(startDate)
    );

    if (response.success) {
      setResult({
        success: true,
        message: `Successfully created ${response.created_count} workouts for ${response.program_name}`
      });
      setTimeout(() => {
        onClose();
        setResult(null);
        setSelectedProgram(null);
      }, 2000);
    } else {
      setResult({
        success: false,
        message: response.error || 'Failed to apply program'
      });
    }

    setApplying(false);
  };

  const getDisciplineColor = (discipline: string) => {
    switch (discipline) {
      case 'cycling':
        return 'bg-blue-100 text-blue-800';
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'swimming':
        return 'bg-cyan-100 text-cyan-800';
      case 'triathlon':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apply Training Program</h2>
            {athleteName && (
              <p className="text-sm text-gray-600 mt-1">For: {athleteName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {result && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {result.success ? (
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              ) : (
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              )}
              <p
                className={`text-sm ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.message}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline mr-2" size={16} />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading programs...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select a Program
              </h3>
              {programs.map((program) => (
                <div
                  key={program.id}
                  onClick={() => setSelectedProgram(program)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedProgram?.id === program.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {program.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {program.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getDisciplineColor(
                            program.discipline
                          )}`}
                        >
                          {program.discipline}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(
                            program.level
                          )}`}
                        >
                          {program.level}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {program.duration_weeks} weeks
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {program.sessions_per_week} sessions/week
                        </span>
                      </div>
                    </div>
                    {selectedProgram?.id === program.id && (
                      <CheckCircle className="text-blue-600 flex-shrink-0 ml-4" size={24} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedProgram || applying}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {applying ? 'Applying...' : 'Apply Program'}
          </button>
        </div>
      </div>
    </div>
  );
}
