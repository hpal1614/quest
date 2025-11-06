// Quest History Page

'use client';

import { useRouter } from 'next/navigation';
import { useQuestStore } from '@/store/questStore';
import { getQuestById } from '@/data/quests';
import { formatDate, formatDuration } from '@/lib/utils/dateUtils';
import { motion } from 'framer-motion';

export default function HistoryPage() {
  const router = useRouter();
  const { activeQuests, completedQuests } = useQuestStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex-1">
              Quest History
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Active Quests */}
        {activeQuests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">In Progress</h2>
            <div className="space-y-3">
              {activeQuests.map((progress) => {
                const quest = getQuestById(progress.questId);
                if (!quest) return null;

                return (
                  <motion.div
                    key={progress.questId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/quest/${quest.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{quest.theme.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{quest.title}</h3>
                        <p className="text-sm text-gray-600">
                          {progress.completedLocationIds.length}/{quest.locations.length} locations
                        </p>
                        <p className="text-xs text-gray-500">
                          Started {formatDate(progress.startedAt)}
                        </p>
                      </div>
                      <div className="text-blue-600">
                        <span className="text-2xl">▶</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Quests */}
        {completedQuests.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Completed</h2>
            <div className="space-y-3">
              {completedQuests.map((completed) => {
                const quest = getQuestById(completed.questId);
                if (!quest) return null;

                return (
                  <motion.div
                    key={completed.questId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{quest.theme.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{quest.title}</h3>
                          <span className="text-green-500 text-lg">✓</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Completed {formatDate(completed.completedAt)}</p>
                          <p>Time: {formatDuration(completed.duration)}</p>
                          <p>Hints used: {completed.totalHintsUsed}</p>
                        </div>
                      </div>
                    </div>

                    {/* Voucher Info */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Voucher: {completed.voucherCode}
                        </span>
                        <button
                          onClick={() => {
                            // Handle voucher download/view
                            alert('Voucher download feature coming soon!');
                          }}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Voucher →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : activeQuests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Start Your Journey
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t completed any quests yet.<br/>
              Ready to begin your adventure?
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-gray-900 font-bold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              VIEW QUESTS
            </button>
          </div>
        ) : null}

        {/* Clear History Button (for testing) */}
        {(activeQuests.length > 0 || completedQuests.length > 0) && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all quest history? This cannot be undone.')) {
                  localStorage.clear();
                  router.push('/');
                }
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear History (Privacy)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}


