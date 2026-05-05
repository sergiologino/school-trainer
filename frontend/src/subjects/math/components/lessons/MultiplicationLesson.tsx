import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TABLE_DATA = [2,3,4,5,6,7,8,9];

export const MultiplicationLesson: React.FC<{ lessonId: string; onComplete: () => void }> = ({ lessonId, onComplete }) => {
  const [selectedNum, setSelectedNum] = useState(2);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  if (lessonId === 'mult-table') {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
          <h3 className="font-black text-lg text-amber-800 mb-2">📋 Таблица умножения</h3>
          <p className="text-amber-700 text-sm">Выбери число, чтобы увидеть его столбик!</p>
        </div>

        {/* Number selector */}
        <div className="flex gap-2 flex-wrap">
          {TABLE_DATA.map(n => (
            <motion.button
              key={n}
              onClick={() => setSelectedNum(n)}
              className={`w-10 h-10 rounded-xl font-black text-lg transition-all ${selectedNum === n ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-gray-700 shadow border border-gray-200'}`}
              whileTap={{ scale: 0.95 }}
            >
              {n}
            </motion.button>
          ))}
        </div>

        {/* Multiplication table for selected number */}
        <div className="space-y-2">
          {TABLE_DATA.map((n, i) => {
            const result = selectedNum * n;
            const fruits = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝'];
            return (
              <motion.div
                key={n}
                className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-24 text-sm font-black text-gray-700">
                  {selectedNum} × {n} = <span className="text-amber-600 text-base">{result}</span>
                </div>
                <div className="flex-1 flex flex-wrap gap-1">
                  {Array.from({ length: Math.min(result, 20) }).map((_, idx) => (
                    <span key={idx} className="text-xs">{fruits[i % fruits.length]}</span>
                  ))}
                  {result > 20 && <span className="text-xs text-gray-400">...+{result - 20}</span>}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full multiplication table */}
        <div className="bg-white rounded-2xl p-3 shadow-md overflow-x-auto">
          <h4 className="font-black text-gray-700 mb-3 text-sm">🗂️ Полная таблица умножения</h4>
          <table className="text-center text-xs w-full">
            <thead>
              <tr>
                <th className="w-8 h-8 bg-gray-100 rounded"></th>
                {TABLE_DATA.map(n => (
                  <th key={n} className="w-8 h-8 bg-amber-100 text-amber-800 font-black rounded">{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_DATA.map(row => (
                <tr key={row}>
                  <td className="bg-amber-100 text-amber-800 font-black rounded">{row}</td>
                  {TABLE_DATA.map(col => {
                    const key = `${row}-${col}`;
                    const isSelected = row === selectedNum || col === selectedNum;
                    const isHovered = hoveredCell === key;
                    return (
                      <td
                        key={col}
                        className={`w-8 h-8 rounded cursor-pointer font-bold transition-all ${isSelected ? 'bg-amber-400 text-white' : 'bg-gray-50 text-gray-700'} ${isHovered ? 'bg-orange-400 text-white scale-110' : ''}`}
                        onMouseEnter={() => setHoveredCell(key)}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => setSelectedNum(row)}
                      >
                        {row * col}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-4 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ✅ Запомнил таблицу!
        </motion.button>
      </div>
    );
  }

  // Theory lesson
  const steps = [
    {
      title: '🍎 Умножение — это быстрое сложение!',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <p className="text-gray-700 mb-3">Представь, что у тебя <strong>3 тарелки</strong>, и на каждой по <strong>4 яблока</strong>.</p>
            <div className="flex justify-center gap-4 text-4xl mb-3">
              <div className="bg-white rounded-xl p-3 shadow">🍎🍎🍎🍎</div>
              <div className="bg-white rounded-xl p-3 shadow">🍎🍎🍎🍎</div>
              <div className="bg-white rounded-xl p-3 shadow">🍎🍎🍎🍎</div>
            </div>
            <p className="text-gray-600 mb-2">Можно сложить: <strong>4 + 4 + 4 = 12</strong></p>
            <div className="bg-amber-100 rounded-xl p-3">
              <p className="text-amber-800 font-black text-xl">А можно умножить: <span className="text-2xl">3 × 4 = 12</span></p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-blue-800 font-bold text-center">💡 Умножение = быстрое сложение одинаковых чисел!</p>
          </div>
        </div>
      ),
    },
    {
      title: '🔢 Части умножения',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-2xl p-4">
            <div className="text-center mb-4">
              <div className="text-4xl font-black text-purple-800 mb-2">5 × 3 = 15</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: '5', name: 'Множитель', desc: 'первый', color: 'bg-blue-100 text-blue-800' },
                { label: '3', name: 'Множитель', desc: 'второй', color: 'bg-green-100 text-green-800' },
                { label: '15', name: 'Произведение', desc: 'результат', color: 'bg-orange-100 text-orange-800' },
              ].map((part, i) => (
                <div key={i} className={`${part.color} rounded-xl p-3`}>
                  <div className="font-black text-2xl mb-1">{part.label}</div>
                  <div className="text-xs font-bold">{part.name}</div>
                  <div className="text-xs opacity-70">{part.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-yellow-800 font-bold text-center">🔄 Порядок не важен: 5 × 3 = 3 × 5 = 15</p>
          </div>
        </div>
      ),
    },
    {
      title: '🎯 Трюки для запоминания',
      content: (
        <div className="space-y-3">
          {[
            { rule: '× 2', trick: 'Просто удвой число!', example: '7 × 2 = 7 + 7 = 14', color: 'bg-blue-50 border-blue-200' },
            { rule: '× 5', trick: 'Последняя цифра: 0 или 5!', example: '6 × 5 = 30, 7 × 5 = 35', color: 'bg-green-50 border-green-200' },
            { rule: '× 10', trick: 'Добавь ноль в конце!', example: '8 × 10 = 80', color: 'bg-amber-50 border-amber-200' },
            { rule: '× 9', trick: 'Сумма цифр ответа = 9!', example: '4 × 9 = 36 (3+6=9)', color: 'bg-purple-50 border-purple-200' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={`${item.color} border rounded-xl p-3`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="font-black text-lg text-gray-800 w-12">{item.rule}</div>
                <div>
                  <div className="font-bold text-sm text-gray-700">{item.trick}</div>
                  <div className="text-xs text-gray-500">{item.example}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        {steps.map((_, i) => (
          <div key={i} className={`flex-1 h-2 rounded-full transition-all ${i <= step ? 'bg-amber-500' : 'bg-gray-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <h3 className="font-black text-xl text-gray-800">{steps[step].title}</h3>
          {steps[step].content}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl"
          >
            ← Назад
          </button>
        )}
        {step < steps.length - 1 ? (
          <motion.button
            onClick={() => setStep(s => s + 1)}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-2xl"
            whileTap={{ scale: 0.98 }}
          >
            Далее →
          </motion.button>
        ) : (
          <motion.button
            onClick={onComplete}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-2xl"
            whileTap={{ scale: 0.98 }}
          >
            ✅ Понял! Далее
          </motion.button>
        )}
      </div>
    </div>
  );
};
