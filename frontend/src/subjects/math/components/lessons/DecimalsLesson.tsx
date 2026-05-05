import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';



export const DecimalsLesson: React.FC<{ lessonId: string; onComplete: () => void }> = ({ lessonId, onComplete }) => {
  const [step, setStep] = useState(0);


  const introSteps = [
    {
      title: '🔟 Что такое десятичная дробь?',
      content: (
        <div className="space-y-4">
          <div className="bg-cyan-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">
              Десятичная дробь — это способ записать <strong>часть числа</strong> через <strong>запятую</strong>!
            </p>
            <div className="flex justify-center gap-4 flex-wrap mb-4">
              {[
                { frac: '1/2', dec: '0,5', visual: '🍕' },
                { frac: '1/4', dec: '0,25', visual: '🎂' },
                { frac: '3/4', dec: '0,75', visual: '🍫' },
                { frac: '1/10', dec: '0,1', visual: '🥤' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-xl p-3 text-center shadow border border-cyan-200 min-w-[80px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-2xl mb-1">{item.visual}</div>
                  <div className="font-black text-cyan-700">{item.frac}</div>
                  <div className="text-gray-500 text-xs">↕</div>
                  <div className="font-black text-blue-700">{item.dec}</div>
                </motion.div>
              ))}
            </div>
            <div className="bg-blue-100 rounded-xl p-3 text-center">
              <p className="font-bold text-blue-800">Запятая отделяет целую часть от дробной!</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '📊 Разряды десятичных чисел',
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-50 rounded-2xl p-4">
            <p className="text-center font-bold text-gray-700 mb-3">Рассмотрим число 12,345</p>
            <div className="flex justify-center gap-1 flex-wrap">
              {['1', '2', ',', '3', '4', '5'].map((digit, i) => {
                const labels = ['десятки', 'единицы', ',', 'десятые', 'сотые', 'тысячные'];
                const colors = ['bg-amber-200', 'bg-green-200', 'bg-gray-100', 'bg-pink-200', 'bg-purple-200', 'bg-cyan-200'];
                return (
                  <motion.div
                    key={i}
                    className={`${colors[i]} rounded-xl p-2 text-center min-w-[50px]`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <div className="text-3xl font-black text-gray-800">{digit}</div>
                    <div className="text-xs text-gray-600 mt-1">{labels[i]}</div>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-4 space-y-2">
              {[
                { digit: '1', pos: 'десятки', val: '10', color: 'text-amber-700' },
                { digit: '2', pos: 'единицы', val: '2', color: 'text-green-700' },
                { digit: '3', pos: 'десятые', val: '3/10 = 0,3', color: 'text-pink-700' },
                { digit: '4', pos: 'сотые', val: '4/100 = 0,04', color: 'text-purple-700' },
                { digit: '5', pos: 'тысячные', val: '5/1000 = 0,005', color: 'text-cyan-700' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={`font-black text-lg w-6 ${item.color}`}>{item.digit}</span>
                  <span className="text-gray-500">— {item.pos} =</span>
                  <span className={`font-bold ${item.color}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '🔄 Перевод дроби в десятичную',
      content: (
        <div className="space-y-4">
          <div className="bg-teal-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">Чтобы перевести дробь, просто раздели числитель на знаменатель!</p>
            <div className="space-y-3">
              {[
                { frac: '1/2', calc: '1 ÷ 2 = 0,5', dec: '0,5', trick: 'Делим 1 на 2' },
                { frac: '1/4', calc: '1 ÷ 4 = 0,25', dec: '0,25', trick: 'Делим 1 на 4' },
                { frac: '3/5', calc: '3 ÷ 5 = 0,6', dec: '0,6', trick: 'Делим 3 на 5' },
                { frac: '7/10', calc: '7 ÷ 10 = 0,7', dec: '0,7', trick: 'Просто ставим запятую!' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-xl p-3 border border-teal-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-teal-700 text-lg w-16">{item.frac}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-600 text-sm flex-1">{item.calc}</span>
                    <span className="font-black text-blue-700">{item.dec}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3">
            <p className="font-black text-yellow-800 text-center">⚡ Быстрый способ</p>
            <p className="text-sm text-gray-700 text-center mt-1">Если знаменатель 10, 100, 1000 — просто перенеси запятую!</p>
            <div className="text-center mt-2 space-y-1">
              <div className="text-sm"><span className="font-bold text-teal-700">3/10</span> = 0,<span className="font-black text-blue-700">3</span></div>
              <div className="text-sm"><span className="font-bold text-teal-700">25/100</span> = 0,<span className="font-black text-blue-700">25</span></div>
              <div className="text-sm"><span className="font-bold text-teal-700">125/1000</span> = 0,<span className="font-black text-blue-700">125</span></div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const addSubSteps = [
    {
      title: '➕ Сложение десятичных чисел',
      content: (
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">
              Считаем <span className="font-black text-emerald-700">2,5 + 1,3</span>
            </p>
            <div className="bg-white rounded-xl p-4 shadow font-mono text-xl">
              <div className="text-right space-y-1">
                <div className="flex justify-end gap-4">
                  <span className="text-emerald-700 font-black">2,5</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="text-gray-400">+</span>
                  <span className="text-blue-700 font-black">1,3</span>
                </div>
                <div className="border-t-2 border-gray-400" />
                <div className="text-purple-700 font-black">3,8</div>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { step: '1', text: 'Записываем числа в столбик', detail: 'Запятые под запятыми!' },
                { step: '2', text: 'Складываем справа налево', detail: '5+3=8 (десятые)' },
                { step: '3', text: 'Считаем целые части', detail: '2+1=3' },
                { step: '4', text: 'Ставим запятую', detail: 'Под другими запятыми' },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{s.step}</span>
                  <div>
                    <span className="text-sm font-bold text-gray-700">{s.text}</span>
                    <span className="text-xs text-gray-500 ml-1">— {s.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="font-black text-blue-800 text-center">🔑 Главное правило</p>
            <p className="text-center text-gray-700 mt-1 font-bold">ЗАПЯТАЯ ПОД ЗАПЯТОЙ!</p>
            <div className="mt-2 space-y-1 text-sm text-center">
              <div><span className="font-bold text-emerald-700">1,25</span> + <span className="font-bold text-blue-700">0,5</span> = <span className="font-black text-purple-700">1,75</span></div>
              <div><span className="font-bold text-emerald-700">3,7</span> + <span className="font-bold text-blue-700">2,15</span> = <span className="font-black text-purple-700">5,85</span></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '➖ Вычитание десятичных чисел',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">
              Считаем <span className="font-black text-red-700">5,4 − 2,1</span>
            </p>
            <div className="bg-white rounded-xl p-4 shadow font-mono text-xl">
              <div className="text-right space-y-1">
                <div><span className="text-red-700 font-black">5,4</span></div>
                <div className="flex justify-end gap-2"><span className="text-gray-400">−</span><span className="text-orange-700 font-black">2,1</span></div>
                <div className="border-t-2 border-gray-400" />
                <div className="text-purple-700 font-black">3,3</div>
              </div>
            </div>
            <div className="mt-3 bg-yellow-50 rounded-xl p-3">
              <p className="font-black text-yellow-800 text-center mb-2">⚠️ Если нечего вычитать:</p>
              <div className="bg-white rounded-lg p-2 font-mono text-center">
                <div><span className="text-red-700">5,<span className="font-black">2</span>0</span></div>
                <div>- <span className="text-orange-700">1,<span className="font-black">3</span>5</span></div>
                <div className="border-t border-gray-400" />
                <div className="text-purple-700">3,85</div>
              </div>
              <p className="text-xs text-gray-600 text-center mt-1">5,2 = 5,20 — можно добавить ноль!</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const mulDivSteps = [
    {
      title: '✖️ Умножение десятичных',
      content: (
        <div className="space-y-4">
          <div className="bg-rose-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">Считаем <span className="font-black text-rose-700">1,2 × 3</span></p>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                  <p className="text-sm font-bold text-gray-700">Умножаем как целые числа (без запятой)</p>
                </div>
                <div className="text-center font-mono text-xl">
                  <span className="text-rose-700">12</span> × <span className="text-blue-700">3</span> = <span className="text-green-700">36</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-black">2</span>
                  <p className="text-sm font-bold text-gray-700">Считаем знаки после запятой</p>
                </div>
                <p className="text-sm text-gray-600 text-center">В 1,2 — <strong>1 знак</strong> после запятой</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-black">3</span>
                  <p className="text-sm font-bold text-gray-700">Ставим запятую</p>
                </div>
                <div className="text-center">
                  <span className="font-mono text-xl text-green-700">36</span>
                  <span className="text-gray-500 mx-2">→ ставим 1 знак →</span>
                  <span className="font-black text-xl text-green-700">3,6</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              ['0,5 × 2', '05×2=10', '1 знак', '1,0 = 1'],
              ['2,5 × 4', '25×4=100', '1 знак', '10,0 = 10'],
              ['0,3 × 0,2', '3×2=6', '2 знака', '0,06'],
            ].map(([expr, calc, signs, result], i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-2 text-sm flex items-center gap-2 flex-wrap">
                <span className="font-black text-rose-700">{expr}</span>
                <span className="text-gray-400">: {calc}, {signs}</span>
                <span className="ml-auto font-black text-green-700">= {result}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '➗ Деление десятичных',
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-center text-gray-700 mb-3">Считаем <span className="font-black text-orange-700">3,6 ÷ 3</span></p>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-gray-700 mb-2">Делим столбиком, не обращая внимания на запятую</p>
                <div className="font-mono text-lg">
                  <span className="text-orange-700">3,6</span> ÷ <span className="text-blue-700">3</span> = <span className="text-green-700 font-black">1,2</span>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3">
                <p className="font-black text-yellow-800 text-center mb-2">⚡ Деление на 10, 100, 1000</p>
                <div className="space-y-1 text-sm text-center">
                  <div><span className="font-bold">5,6 ÷ 10</span> = <span className="font-black text-green-700">0,56</span> (сдвиг влево на 1)</div>
                  <div><span className="font-bold">3,7 ÷ 100</span> = <span className="font-black text-green-700">0,037</span> (сдвиг влево на 2)</div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="font-black text-blue-800 text-center mb-2">⚡ Деление на десятичное</p>
                <p className="text-sm text-gray-700 text-center">Умножаем оба числа так, чтобы делитель стал целым!</p>
                <div className="text-center mt-2">
                  <span className="font-bold">1,5 ÷ 0,5</span>
                  <span className="text-gray-500 mx-2">→ × 10 →</span>
                  <span className="font-bold">15 ÷ 5</span>
                  <span className="mx-2">=</span>
                  <span className="font-black text-green-700">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  let currentSteps = introSteps;
  if (lessonId === 'decas-theory') currentSteps = addSubSteps;
  if (lessonId === 'decmd-mul' || lessonId === 'decmd-div') currentSteps = mulDivSteps;

  return (
    <div className="space-y-4">
      <div className="flex gap-1 mb-2">
        {currentSteps.map((_, i) => (
          <div key={i} className={`flex-1 h-2 rounded-full transition-all ${i <= step ? 'bg-cyan-500' : 'bg-gray-200'}`} />
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
          <motion.button onClick={() => setStep(s => s + 1)} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-2xl" whileTap={{ scale: 0.98 }}>
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
