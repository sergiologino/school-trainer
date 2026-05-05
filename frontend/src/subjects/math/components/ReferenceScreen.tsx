import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  {
    id: 'multiplication',
    title: 'Таблица умножения',
    emoji: '✖️',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'fractions',
    title: 'Обыкновенные дроби',
    emoji: '🍕',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'decimals',
    title: 'Десятичные дроби',
    emoji: '🔢',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'rules',
    title: 'Все правила кратко',
    emoji: '📋',
    color: 'from-green-500 to-emerald-600',
  },
];

const TABLE_DATA = [2,3,4,5,6,7,8,9];

export const ReferenceScreen: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [selectedMult, setSelectedMult] = useState(2);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-black text-center mb-1">📚 Справочник</h1>
        <p className="text-white/80 text-sm text-center">Все правила и формулы в одном месте</p>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {SECTIONS.map((section, i) => (
          <motion.div
            key={section.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="w-full flex items-center gap-3 p-4"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-2xl`}>
                {section.emoji}
              </div>
              <div className="flex-1 text-left">
                <div className="font-black text-gray-800">{section.title}</div>
              </div>
              <div className={`text-gray-400 transition-transform ${openSection === section.id ? 'rotate-90' : ''}`}>›</div>
            </button>

            <AnimatePresence>
              {openSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                    {section.id === 'multiplication' && (
                      <div className="space-y-3">
                        <div className="flex gap-2 flex-wrap">
                          {TABLE_DATA.map(n => (
                            <button
                              key={n}
                              onClick={() => setSelectedMult(n)}
                              className={`w-9 h-9 rounded-xl font-black ${selectedMult === n ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {TABLE_DATA.map(n => (
                            <div key={n} className={`flex items-center gap-2 rounded-xl p-2 ${n % 2 === 0 ? 'bg-amber-50' : 'bg-white border border-gray-100'}`}>
                              <span className="text-sm text-gray-600">{selectedMult}×{n}=</span>
                              <span className="font-black text-amber-700 text-lg">{selectedMult * n}</span>
                            </div>
                          ))}
                        </div>
                        {/* Full table */}
                        <div className="overflow-x-auto">
                          <table className="text-center text-xs w-full">
                            <thead>
                              <tr>
                                <th className="w-7 h-7 bg-amber-100">×</th>
                                {TABLE_DATA.map(n => <th key={n} className="w-7 h-7 bg-amber-50 font-black">{n}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              {TABLE_DATA.map(row => (
                                <tr key={row}>
                                  <td className="bg-amber-50 font-black">{row}</td>
                                  {TABLE_DATA.map(col => (
                                    <td
                                      key={col}
                                      className={`h-7 font-bold ${row === selectedMult || col === selectedMult ? 'bg-amber-200 text-amber-800' : 'bg-white text-gray-700'}`}
                                    >
                                      {row * col}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {section.id === 'fractions' && (
                      <div className="space-y-3">
                        {[
                          {
                            title: '📖 Что такое дробь',
                            content: (
                              <div>
                                <div className="text-center mb-2">
                                  <span className="text-2xl font-black text-purple-700">a/b</span>
                                </div>
                                <div className="flex gap-2">
                                  <div className="flex-1 bg-purple-50 rounded-xl p-2 text-center">
                                    <div className="font-black text-purple-700">a</div>
                                    <div className="text-xs text-gray-600">числитель</div>
                                  </div>
                                  <div className="flex-1 bg-blue-50 rounded-xl p-2 text-center">
                                    <div className="font-black text-blue-700">b</div>
                                    <div className="text-xs text-gray-600">знаменатель</div>
                                  </div>
                                </div>
                              </div>
                            ),
                          },
                          {
                            title: '➕ Сложение (одинак. знаменатель)',
                            content: <div className="font-mono text-center bg-violet-50 rounded-xl p-3"><span className="text-violet-700 font-black">a/c + b/c = (a+b)/c</span><br/><span className="text-xs text-gray-500">1/5 + 2/5 = 3/5</span></div>,
                          },
                          {
                            title: '➕ Сложение (разные знаменатели)',
                            content: (
                              <div className="bg-violet-50 rounded-xl p-3 space-y-1 text-sm">
                                <div>1. Найди НОК знаменателей</div>
                                <div>2. Приведи дроби к НОК</div>
                                <div>3. Сложи числители</div>
                                <div className="font-black text-violet-700 mt-2">1/2 + 1/3 = 3/6 + 2/6 = 5/6</div>
                              </div>
                            ),
                          },
                          {
                            title: '✖️ Умножение',
                            content: <div className="font-mono text-center bg-pink-50 rounded-xl p-3"><span className="text-pink-700 font-black">a/b × c/d = (a×c)/(b×d)</span><br/><span className="text-xs text-gray-500">2/3 × 3/4 = 6/12 = 1/2</span></div>,
                          },
                          {
                            title: '➗ Деление',
                            content: <div className="font-mono text-center bg-orange-50 rounded-xl p-3"><span className="text-orange-700 font-black">a/b ÷ c/d = a/b × d/c</span><br/><span className="text-xs text-gray-500">3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2</span></div>,
                          },
                          {
                            title: '✂️ Сокращение',
                            content: <div className="bg-green-50 rounded-xl p-3 text-sm text-center">Делим числитель и знаменатель на НОД<br/><span className="font-black text-green-700">6/8 ÷ 2/2 = 3/4</span></div>,
                          },
                        ].map((item, i) => (
                          <div key={i} className="border border-gray-100 rounded-xl p-3">
                            <div className="font-bold text-gray-700 text-sm mb-2">{item.title}</div>
                            {item.content}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.id === 'decimals' && (
                      <div className="space-y-3">
                        {[
                          {
                            title: '🔢 Разряды',
                            content: (
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-center">
                                  <thead>
                                    <tr className="bg-cyan-50">
                                      {['Тыс.', 'Сотни', 'Дес.', 'Ед.', ',', 'Дес.', 'Сот.', 'Тыс.'].map((h, i) => (
                                        <th key={i} className={`p-1 font-bold ${i === 4 ? 'bg-gray-200' : ''}`}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      {['1', '2', '3', '4', ',', '5', '6', '7'].map((d, i) => (
                                        <td key={i} className={`p-2 font-black text-lg ${i < 4 ? 'text-blue-700' : i === 4 ? 'bg-gray-100 text-gray-800' : 'text-pink-700'}`}>{d}</td>
                                      ))}
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            ),
                          },
                          {
                            title: '🔄 Перевод дроби в десятичную',
                            content: (
                              <div className="space-y-1 text-sm">
                                <div className="bg-cyan-50 rounded-xl p-2 font-black text-center text-cyan-700">числитель ÷ знаменатель</div>
                                {[['1/2','0,5'],['1/4','0,25'],['3/4','0,75'],['1/5','0,2'],['1/10','0,1']].map(([f,d]) => (
                                  <div key={f} className="flex justify-between bg-white border border-gray-100 rounded-lg p-1.5 px-3">
                                    <span className="font-bold text-teal-700">{f}</span>
                                    <span className="text-gray-400">→</span>
                                    <span className="font-black text-blue-700">{d}</span>
                                  </div>
                                ))}
                              </div>
                            ),
                          },
                          {
                            title: '➕➖ Сложение и вычитание',
                            content: <div className="bg-emerald-50 rounded-xl p-3 text-sm"><div className="font-black text-emerald-700 text-center text-lg mb-1">Запятая под запятой!</div><div className="font-mono text-center">2,5 + 1,3 = 3,8<br/>5,6 − 2,4 = 3,2</div></div>,
                          },
                          {
                            title: '✖️ Умножение',
                            content: (
                              <div className="bg-rose-50 rounded-xl p-3 text-sm space-y-1">
                                <div>1. Умножай как целые числа</div>
                                <div>2. Считай знаки после запятой</div>
                                <div>3. Столько же знаков в ответе</div>
                                <div className="font-black text-rose-700 mt-1">1,2 × 3 = 3,6 (1 знак)</div>
                                <div className="font-black text-rose-700">0,3 × 0,2 = 0,06 (2 знака)</div>
                              </div>
                            ),
                          },
                          {
                            title: '➗ Деление',
                            content: (
                              <div className="bg-orange-50 rounded-xl p-3 text-sm space-y-1">
                                <div className="font-bold">÷ 10, 100, 1000: сдвиг запятой влево</div>
                                <div>5,6 ÷ 10 = <span className="font-black text-orange-700">0,56</span></div>
                                <div className="font-bold mt-1">÷ десятичное: умножай до целого</div>
                                <div>1,5 ÷ 0,5 → 15 ÷ 5 = <span className="font-black text-orange-700">3</span></div>
                              </div>
                            ),
                          },
                        ].map((item, i) => (
                          <div key={i} className="border border-gray-100 rounded-xl p-3">
                            <div className="font-bold text-gray-700 text-sm mb-2">{item.title}</div>
                            {item.content}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.id === 'rules' && (
                      <div className="space-y-2">
                        {[
                          { emoji: '✖️', rule: 'Умножение', text: 'a × b = b × a (порядок не важен)' },
                          { emoji: '➗', rule: 'Деление дробей', text: 'a/b ÷ c/d = a/b × d/c (переворачиваем!)' },
                          { emoji: '📏', rule: 'НОД', text: 'Наибольший общий делитель — для сокращения дробей' },
                          { emoji: '📐', rule: 'НОК', text: 'Наименьшее общее кратное — для приведения дробей' },
                          { emoji: '⚖️', rule: 'Основное свойство дроби', text: 'a/b = (a×k)/(b×k) при любом k≠0' },
                          { emoji: '🔄', rule: 'Перевод в десятичную', text: 'Числитель ÷ Знаменатель = десятичная дробь' },
                          { emoji: '📍', rule: 'Запятая × 10', text: '0,1 × 10 = 1 (сдвиг вправо на 1)' },
                          { emoji: '📍', rule: 'Запятая ÷ 10', text: '1 ÷ 10 = 0,1 (сдвиг влево на 1)' },
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
                            <span className="text-xl">{item.emoji}</span>
                            <div>
                              <div className="font-black text-gray-800 text-sm">{item.rule}</div>
                              <div className="text-xs text-gray-600 mt-0.5">{item.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
