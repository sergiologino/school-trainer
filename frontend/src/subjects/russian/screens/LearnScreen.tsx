import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { grammarRules, categories } from '../data/grammarRules';
import type { GrammarRule } from '../data/grammarRules';

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRule, setSelectedRule] = useState<GrammarRule | null>(null);

  const filtered = grammarRules.filter((r) => {
    const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 pt-12 pb-6 px-4 rounded-b-[2rem]">
        <h1 className="text-white text-2xl font-black mb-4">📚 Справочник правил</h1>
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Поиск правил..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white rounded-2xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-400 font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-4 mt-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Rules grid */}
      <div className="px-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-500 font-semibold">Ничего не найдено</p>
            <p className="text-gray-400 text-sm">Попробуй другой запрос</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((rule, i) => (
              <motion.button
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRule(rule)}
                className="w-full bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-100 flex items-start gap-3"
              >
                <span className="text-4xl">{rule.visual}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      {rule.categoryIcon} {rule.category}
                    </span>
                  </div>
                  <h3 className="font-black text-gray-800 mt-1">{rule.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{rule.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rule.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-gray-300 text-xl">›</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Rule detail modal */}
      <AnimatePresence>
        {selectedRule && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRule(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-4 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  {selectedRule.categoryIcon} {selectedRule.category}
                </span>
                <button
                  onClick={() => setSelectedRule(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-5">
                <div className="text-center mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-3"
                  >
                    {selectedRule.visual}
                  </motion.div>
                  <h2 className="text-2xl font-black text-gray-800">{selectedRule.title}</h2>
                </div>

                {/* Description */}
                <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                  <h3 className="font-black text-blue-800 mb-2">📖 Правило</h3>
                  <p className="text-blue-900 text-sm leading-relaxed">{selectedRule.description}</p>
                </div>

                {/* Mnemonic */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
                  <h3 className="font-black text-amber-800 mb-2">🧠 Как запомнить</h3>
                  <p className="text-amber-900 text-sm leading-relaxed">{selectedRule.mnemonic}</p>
                </div>

                {/* Examples */}
                <div className="bg-green-50 rounded-2xl p-4 mb-4">
                  <h3 className="font-black text-green-800 mb-3">✏️ Примеры</h3>
                  <div className="space-y-2">
                    {selectedRule.examples.map((ex, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-green-400 font-black mt-0.5">•</span>
                        <p className="text-green-900 text-sm font-semibold">{ex}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedRule.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
