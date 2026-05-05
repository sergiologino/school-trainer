import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FractionCircle } from './FractionVisual';

export const FractionsMulDivLesson: React.FC<{ lessonId: string; onComplete: () => void }> = ({ lessonId, onComplete }) => {
  const [step, setStep] = useState(0);

  const isMul = lessonId === 'frac-mul-theory';

  const mulSteps = [
    {
      title: '✖️ Умножение дробей — легко!',
      content: (
        <div className="space-y-4">
          <div className="bg-pink-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">
              Найдём <span className="font-black text-pink-700">2/3</span> от <span className="font-black text-purple-700">3/4</span>
            </p>
            <div className="bg-white rounded-xl p-4 text-center border-2 border-pink-200">
              <p className="text-gray-600 mb-3">При умножении дробей:</p>
              <div className="flex justify-center items-center gap-2 text-2xl font-black mb-3">
                <div className="text-pink-700">2</div>
                <div className="flex flex-col items-center">
                  <div className="border-t-2 border-gray-800 w-4"></div>
                </div>
                <div className="text-pink-700">3</div>
                <span className="text-gray-600">×</span>
                <div className="text-purple-700">3</div>
                <div className="flex flex-col items-center">
                  <div className="border-t-2 border-gray-800 w-4"></div>
                </div>
                <div className="text-purple-700">4</div>
                <span className="text-gray-600">=</span>
                <div className="text-green-700">2×3</div>
                <div className="flex flex-col items-center">
                  <div className="border-t-2 border-gray-800 w-8"></div>
                </div>
                <div className="text-green-700">3×4</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <div className="text-2xl font-black text-green-700">= 6/12 = 1/2</div>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <FractionCircle numerator={1} denominator={2} color="#10b981" size={80} label="1/2" />
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
            <p className="font-black text-yellow-800 text-center text-lg">📏 Правило:</p>
            <div className="text-center mt-2 font-black text-gray-800">
              <span className="text-pink-700">a/b</span> × <span className="text-purple-700">c/d</span> = <span className="text-green-700">a×c / b×d</span>
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">Числители умножаем, знаменатели умножаем!</p>
          </div>
        </div>
      ),
    },
    {
      title: '🎨 Визуализация умножения',
      content: (
        <div className="space-y-4">
          <p className="text-center text-gray-700">
            <span className="font-black text-pink-700">1/2</span> × <span className="font-black text-purple-700">1/3</span> = <span className="font-black text-green-700">1/6</span>
          </p>
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="grid grid-cols-3 gap-1 border-2 border-gray-300 rounded-xl overflow-hidden">
              {Array.from({length: 6}).map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-16 flex items-center justify-center font-black border border-gray-200 ${i === 0 ? 'bg-purple-400 text-white' : i < 2 ? 'bg-pink-100' : 'bg-gray-100 text-gray-400'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {i === 0 ? '1/6' : ''}
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-pink-700 font-bold">← 1/2 →</span>
              <div className="text-purple-700 font-bold" style={{ writingMode: 'vertical-lr' }}>1/3</div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-black text-gray-700 text-center">Примеры:</p>
            {[
              ['1/3', '1/4', '1/12'],
              ['2/3', '3/4', '6/12 = 1/2'],
              ['1/2', '2/5', '2/10 = 1/5'],
            ].map(([a, b, res], i) => (
              <div key={i} className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl p-2">
                <span className="font-bold text-pink-700">{a}</span>
                <span>×</span>
                <span className="font-bold text-purple-700">{b}</span>
                <span>=</span>
                <span className="font-black text-green-700">{res}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const divSteps = [
    {
      title: '➗ Деление дробей — переворачиваем!',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">
              Задача: <span className="font-black text-blue-700">3/4 ÷ 1/2</span> = ?
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-black flex-shrink-0">1</span>
                  <p className="text-gray-700"><strong>Переворачиваем</strong> вторую дробь</p>
                </div>
                <div className="text-center mt-2">
                  <span className="text-blue-700 font-black">1/2</span>
                  <span className="text-gray-500 mx-2">→ перевернули →</span>
                  <span className="text-green-700 font-black">2/1</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-black flex-shrink-0">2</span>
                  <p className="text-gray-700"><strong>Заменяем ÷ на ×</strong></p>
                </div>
                <div className="text-center mt-2 font-black text-lg">
                  <span className="text-blue-700">3/4</span>
                  <span className="text-red-500 line-through mx-2">÷ 1/2</span>
                  <span className="text-green-700">× 2/1</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-black flex-shrink-0">3</span>
                  <p className="text-gray-700"><strong>Умножаем</strong></p>
                </div>
                <div className="text-center mt-2 font-black text-xl text-green-700">
                  3×2 / 4×1 = 6/4 = 3/2 = 1½
                </div>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-center">
            <p className="font-black text-yellow-800 text-lg">📏 Правило:</p>
            <p className="font-black text-gray-800 mt-1">a/b ÷ c/d = a/b × d/c</p>
            <p className="text-sm text-gray-600 mt-1">Делить на дробь = умножать на перевёрнутую!</p>
          </div>
        </div>
      ),
    },
    {
      title: '🔄 Обратная дробь',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">Обратная дробь — числитель и знаменатель меняются местами</p>
            <div className="space-y-2">
              {[
                ['1/2', '2/1 = 2'],
                ['3/4', '4/3'],
                ['2/5', '5/2'],
                ['7/3', '3/7'],
              ].map(([orig, inv], i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-xl p-3 flex items-center justify-around border border-purple-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="font-black text-purple-700 text-lg">{orig}</span>
                  <span className="text-2xl">↔️</span>
                  <span className="font-black text-pink-700 text-lg">{inv}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="font-black text-green-800">💡 Проверка: дробь × обратная = 1</p>
            <p className="text-sm text-gray-600 mt-1">2/3 × 3/2 = 6/6 = 1 ✓</p>
          </div>
          <div className="space-y-2">
            <p className="font-black text-gray-700 text-center">Примеры деления:</p>
            {[
              ['1/2', '1/4', '1/2 × 4/1 = 4/2 = 2'],
              ['3/5', '3/10', '3/5 × 10/3 = 30/15 = 2'],
            ].map(([a, b, res], i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-2 text-sm">
                <span className="font-bold text-blue-700">{a}</span>
                <span className="mx-1">÷</span>
                <span className="font-bold text-red-700">{b}</span>
                <span className="mx-1">=</span>
                <span className="font-black text-green-700">{res}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const currentSteps = isMul ? mulSteps : divSteps;

  return (
    <div className="space-y-4">
      <div className="flex gap-1 mb-2">
        {currentSteps.map((_, i) => (
          <div key={i} className={`flex-1 h-2 rounded-full transition-all ${i <= step ? 'bg-pink-500' : 'bg-gray-200'}`} />
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
          <h3 className="font-black text-xl text-gray-800">{currentSteps[step].title}</h3>
          {currentSteps[step].content}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl">
            ← Назад
          </button>
        )}
        {step < currentSteps.length - 1 ? (
          <motion.button onClick={() => setStep(s => s + 1)} className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-3 rounded-2xl" whileTap={{ scale: 0.98 }}>
            Далее →
          </motion.button>
        ) : (
          <motion.button onClick={onComplete} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-2xl" whileTap={{ scale: 0.98 }}>
            ✅ Понял! Далее
          </motion.button>
        )}
      </div>
    </div>
  );
};
