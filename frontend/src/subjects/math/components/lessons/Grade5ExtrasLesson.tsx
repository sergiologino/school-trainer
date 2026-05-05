import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  lessonId: string;
  topicId: string;
  onComplete: () => void;
}

/** Интерактивные теория-карты для новых тем 5 класса (проценты, площадь, среднее). */
export const Grade5ExtrasLesson: React.FC<Props> = ({ lessonId, topicId, onComplete }) => {
  if (topicId === 'percent-intro') {
    if (lessonId === 'pct-theory') {
      return (
        <div className="space-y-4">
          <Card title="Процент — это сотая доля">
            Запись <strong>1%</strong> читается «один процент». Это ровно <strong>¹⁄₁₀₀</strong> часть целого.
          </Card>
          <Card title="Связь с долей">
            Если пиццу поделили на 100 одинаковых кусочков, то один кусочек — это <strong>1%</strong> пиццы, а все 100 —
            <strong> 100%</strong>.
          </Card>
          <TapReveal
            question="Чему равен 50% целого?"
            answer="Половине целого: ½ = 50%."
          />
          <CompleteButton onComplete={onComplete} />
        </div>
      );
    }
    if (lessonId === 'pct-convert') {
      return (
        <div className="space-y-4">
          <Card title="Из процентов в долю">
            <code className="block bg-gray-900 text-green-400 p-3 rounded-xl text-sm my-2">25% → 25/100 = ¼</code>
          </Card>
          <Card title="Из доли в проценты">
            Умножь долю на 100:<br />
            <code className="text-sm bg-indigo-50 px-2 py-1 rounded">¾ × 100% = 75%</code>
          </Card>
          <TapReveal question="Чему равен 10% дробью?" answer="10/100 = 1/10 часть." />
          <CompleteButton onComplete={onComplete} />
        </div>
      );
    }
  }

  if (topicId === 'area-perimeter' && lessonId === 'ap-theory') {
    return (
      <div className="space-y-4">
        <Card title="Периметр">
          Периметр прямоугольника со сторонами <em>a</em> и <em>b</em>:<br />
          <strong>P = 2(a + b)</strong>.
        </Card>
        <Card title="Площадь">
          Площадь прямоугольника: <strong>S = a × b</strong>.
        </Card>
        <TapReveal question="Если комната 4 м на 5 м, какова площадь пола?" answer="4 × 5 = 20 м²." />
        <CompleteButton onComplete={onComplete} />
      </div>
    );
  }

  if (topicId === 'mean-intro' && lessonId === 'mean-theory') {
    return (
      <div className="space-y-4">
        <Card title="Среднее арифметическое">
          Сложи все числа и <strong>раздели на их количество</strong>.
        </Card>
        <Card title="Пример">
          Оценки 4, 5 и 5: сумма <strong>14</strong>, чисел <strong>3</strong> → среднее <strong>14 ÷ 3 ≈ 4,67</strong>.
          В школе иногда округляют по правилам задачи.
        </Card>
        <TapReveal question="Среднее чисел 10 и 20?" answer="(10 + 20) ÷ 2 = 15." />
        <CompleteButton onComplete={onComplete} />
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-gray-500 text-sm">
      Откройте практику или тест по этой теме — здесь будет расширенная теория в следующих версиях.
      <motion.button type="button" onClick={onComplete} className="block mx-auto mt-6 w-full py-4 rounded-2xl bg-indigo-500 text-white font-black">
        Продолжить →
      </motion.button>
    </div>
  );
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow border border-gray-100 p-4"
    >
      <h4 className="font-black text-indigo-900 mb-2">{title}</h4>
      <div className="text-gray-700 leading-relaxed text-sm">{children}</div>
    </motion.div>
  );
}

function TapReveal({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="w-full text-left rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-4"
    >
      <p className="font-bold text-indigo-900 text-sm">{question}</p>
      {open ? <p className="mt-2 text-sm text-green-800">{answer}</p> : <p className="mt-2 text-xs text-indigo-500">Нажми, чтобы проверить ответ</p>}
    </button>
  );
}

function CompleteButton({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.button type="button" onClick={onComplete} className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black shadow-lg" whileTap={{ scale: 0.98 }}>
      Урок пройден — получить XP ✓
    </motion.button>
  );
}
