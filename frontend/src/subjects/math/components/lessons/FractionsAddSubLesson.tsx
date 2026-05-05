import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FractionCircle, FractionBar } from './FractionVisual';

export const FractionsAddSubLesson: React.FC<{ lessonId: string; onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '🍕 Что такое дробь?',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-2xl p-4">
            <p className="text-gray-700 mb-3 text-center">Представь пиццу, разрезанную на <strong>4 части</strong>. Ты съел <strong>3 части</strong>.</p>
            <div className="flex justify-center gap-6 items-center mb-4">
              <FractionCircle numerator={3} denominator={4} color="#8b5cf6" size={100} />
              <div className="text-center">
                <div className="text-4xl font-black text-purple-700 mb-1">3/4</div>
                <p className="text-sm text-gray-600">три четвёртых</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 text-center border-2 border-purple-200">
                <div className="font-black text-3xl text-purple-700 mb-1">3</div>
                <div className="text-xs text-gray-600">ЧИСЛИТЕЛЬ<br/><em>сколько частей взяли</em></div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border-2 border-blue-200">
                <div className="font-black text-3xl text-blue-700 mb-1">4</div>
                <div className="text-xs text-gray-600">ЗНАМЕНАТЕЛЬ<br/><em>на сколько частей делим</em></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[[1,2],[1,3],[2,3],[1,4],[2,4],[3,4]].map(([n,d]) => (
              <div key={`${n}/${d}`} className="bg-white rounded-xl p-2 text-center shadow-sm border border-gray-100">
                <FractionCircle numerator={n} denominator={d} color="#6366f1" size={50} />
                <div className="text-xs font-black text-gray-700 mt-1">{n}/{d}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '➕ Сложение дробей с одинаковым знаменателем',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">
              Паша съел <span className="font-black text-blue-700">2/7</span> пиццы, Маша — ещё <span className="font-black text-green-700">3/7</span>. Сколько вместе?
            </p>
            <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
              <div className="text-center">
                <FractionBar numerator={2} denominator={7} color="#3b82f6" width={180} showLabel={false} />
                <div className="font-black text-blue-700 text-lg mt-1">2/7</div>
              </div>
              <div className="text-2xl font-black text-gray-600">+</div>
              <div className="text-center">
                <FractionBar numerator={3} denominator={7} color="#10b981" width={180} showLabel={false} />
                <div className="font-black text-green-700 text-lg mt-1">3/7</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Знаменатель <strong>одинаковый</strong> — просто складываем числители!</p>
                <div className="text-3xl font-black text-purple-700">2/7 + 3/7 = 5/7</div>
              </div>
            </div>
            <div className="mt-3">
              <FractionBar numerator={5} denominator={7} color="#8b5cf6" width={180} />
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
            <p className="font-black text-yellow-800 text-center">📏 Правило:</p>
            <p className="text-center text-gray-700 mt-1">
              <span className="font-black">a/c + b/c = (a+b)/c</span>
            </p>
            <p className="text-sm text-gray-600 text-center">Складываем только числители, знаменатель НЕ меняем!</p>
          </div>
        </div>
      ),
    },
    {
      title: '➖ Вычитание с одинаковым знаменателем',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">
              Было <span className="font-black text-red-700">5/8</span> торта, съели <span className="font-black text-orange-700">2/8</span>. Сколько осталось?
            </p>
            <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
              <div className="text-center">
                <FractionBar numerator={5} denominator={8} color="#ef4444" width={200} showLabel={false} />
                <div className="font-black text-red-700 text-lg mt-1">5/8</div>
              </div>
              <div className="text-2xl font-black text-gray-600">−</div>
              <div className="text-center">
                <FractionBar numerator={2} denominator={8} color="#f97316" width={200} showLabel={false} />
                <div className="font-black text-orange-700 text-lg mt-1">2/8</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-green-200 text-center">
              <div className="text-3xl font-black text-green-700">5/8 − 2/8 = 3/8</div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-center">
            <p className="font-black text-yellow-800">📏 Правило:</p>
            <p className="font-black text-gray-700 mt-1">a/c − b/c = (a−b)/c</p>
            <p className="text-sm text-gray-600">Вычитаем только числители, знаменатель НЕ меняем!</p>
          </div>
        </div>
      ),
    },
    {
      title: '🔢 Разные знаменатели — нужен НОК!',
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-2">
              Как сложить <span className="font-black text-indigo-700">1/2</span> + <span className="font-black text-pink-700">1/3</span>?
            </p>
            <p className="text-center text-sm text-gray-600 mb-3">Нужно привести к одному знаменателю!</p>
            
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3">
                <p className="font-bold text-sm text-gray-700 mb-2">Шаг 1: Найдём НОК(2, 3) = 6</p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Кратные 2:</div>
                    <div className="flex gap-1">
                      {[2,4,6,8,10].map(n => (
                        <span key={n} className={`text-xs px-1.5 py-0.5 rounded font-bold ${n === 6 ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>{n}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Кратные 3:</div>
                    <div className="flex gap-1">
                      {[3,6,9,12].map(n => (
                        <span key={n} className={`text-xs px-1.5 py-0.5 rounded font-bold ${n === 6 ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>{n}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-center text-green-700 font-black text-sm mt-2">Наименьшее общее = 6 ✓</p>
              </div>

              <div className="bg-white rounded-xl p-3">
                <p className="font-bold text-sm text-gray-700 mb-2">Шаг 2: Приводим дроби</p>
                <div className="flex justify-center items-center gap-3 flex-wrap">
                  <div className="text-center">
                    <div className="text-indigo-700 font-black">1/2 = ?/6</div>
                    <div className="text-xs text-gray-500">6÷2=3, умножаем на 3</div>
                    <div className="text-indigo-700 font-black">= 3/6</div>
                    <FractionBar numerator={3} denominator={6} color="#6366f1" width={120} showLabel={false} />
                  </div>
                  <div className="text-2xl font-black">+</div>
                  <div className="text-center">
                    <div className="text-pink-700 font-black">1/3 = ?/6</div>
                    <div className="text-xs text-gray-500">6÷3=2, умножаем на 2</div>
                    <div className="text-pink-700 font-black">= 2/6</div>
                    <FractionBar numerator={2} denominator={6} color="#ec4899" width={120} showLabel={false} />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-3 text-center border-2 border-green-300">
                <div className="text-xl font-black text-green-700">3/6 + 2/6 = 5/6 ✓</div>
                <FractionBar numerator={5} denominator={6} color="#10b981" width={180} />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '✂️ Сокращение дробей',
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">Иногда дробь можно упростить — <strong>сократить</strong>!</p>
            <div className="space-y-3">
              {[
                { from: [4,8], to: [1,2], gcd: 4, example: '4÷4=1, 8÷4=2' },
                { from: [6,9], to: [2,3], gcd: 3, example: '6÷3=2, 9÷3=3' },
                { from: [10,15], to: [2,3], gcd: 5, example: '10÷5=2, 15÷5=3' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-xl p-3 flex items-center gap-3 border border-orange-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="font-black text-orange-700 text-lg">{item.from[0]}/{item.from[1]}</div>
                  <div className="flex-1 text-center">
                    <div className="text-xs text-gray-500">÷ {item.gcd}</div>
                    <div className="text-gray-400">───────→</div>
                    <div className="text-xs text-gray-500">{item.example}</div>
                  </div>
                  <div className="font-black text-green-700 text-lg">{item.to[0]}/{item.to[1]}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="font-black text-blue-800">💡 Делим числитель и знаменатель на их НОД!</p>
            <p className="text-sm text-gray-600 mt-1">НОД = Наибольший Общий Делитель</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 mb-2">
        {steps.map((_, i) => (
          <div key={i} className={`flex-1 h-2 rounded-full transition-all ${i <= step ? 'bg-violet-500' : 'bg-gray-200'}`} />
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
          <button onClick={() => setStep(s => s - 1)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl">
            ← Назад
          </button>
        )}
        {step < steps.length - 1 ? (
          <motion.button onClick={() => setStep(s => s + 1)} className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-3 rounded-2xl" whileTap={{ scale: 0.98 }}>
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
