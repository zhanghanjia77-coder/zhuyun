import { useMemo, useState } from 'react'
import type { QuizQuestion } from '../data/quiz'
import { quizQuestions } from '../data/quiz'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './pages.css'

const QUIZ_ROUND_SIZE = 10

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function makeRoundQuestions(all: QuizQuestion[]): QuizQuestion[] {
  const picked = shuffle(all).slice(0, Math.min(QUIZ_ROUND_SIZE, all.length))
  return picked
}

function correctAnswerLabel(q: QuizQuestion): string {
  if (q.kind === 'single' && q.options && q.answerIndex != null) {
    return q.options[q.answerIndex]
  }
  if (q.kind === 'bool') {
    return q.boolAnswer ? '正确' : '错误'
  }
  return '—'
}

type QuizFeedback =
  | { correct: boolean; pickedIndex: number }
  | { correct: boolean; boolChoice: boolean }

export function QuizPage() {
  const [roundQuestions, setRoundQuestions] = useState<QuizQuestion[]>(
    () => makeRoundQuestions(quizQuestions),
  )
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null)
  const [best, setBest] = useLocalStorage<{ score: number; at: string } | null>(
    'zhuyun:quizBest',
    null,
  )

  const q = roundQuestions[idx]
  const total = roundQuestions.length
  const isLast = idx + 1 >= total

  const progress = useMemo(
    () => `${Math.min(idx + 1, total)} / ${total}`,
    [idx, total],
  )

  const pickSingle = (optionIndex: number) => {
    if (feedback) return
    const ok = optionIndex === q.answerIndex
    if (ok) setScore((s) => s + 1)
    setFeedback({ correct: ok, pickedIndex: optionIndex })
  }

  const pickBool = (choice: boolean) => {
    if (feedback) return
    const ok = q.boolAnswer === choice
    if (ok) setScore((s) => s + 1)
    setFeedback({ correct: ok, boolChoice: choice })
  }

  const goNext = () => {
    if (!feedback) return
    if (isLast) {
      setFinished(true)
      setBest((prev) => {
        const at = new Date().toISOString()
        if (!prev || score > prev.score) return { score, at }
        return prev
      })
      return
    }
    setIdx((i) => i + 1)
    setFeedback(null)
  }

  const restart = () => {
    setRoundQuestions(makeRoundQuestions(quizQuestions))
    setIdx(0)
    setScore(0)
    setFinished(false)
    setFeedback(null)
  }

  if (finished) {
    return (
      <div className="page-quiz">
        <section className="card quiz-result">
          <h2 className="detail-h3">本轮得分</h2>
          <p className="quiz-score-big">
            {score} / {total}
          </p>
          <p className="muted">
            最佳记录：{best?.score ?? '—'} 分
            {best?.at
              ? `（${new Date(best.at).toLocaleString()}）`
              : ''}
          </p>
          <button type="button" className="btn-primary" onClick={restart}>
            再答一组
          </button>
        </section>
        <ul className="quiz-review">
          {roundQuestions.map((item) => (
            <li key={item.id} className="card">
              <p className="body-text">{item.question}</p>
              <p className="muted">{item.explain}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="page-quiz">
      <p className="muted quiz-meta">{progress}</p>
      <section className="card">
        <p className="body-text quiz-q">{q.question}</p>
        {q.kind === 'single' && q.options && (
          <div className="quiz-options">
            {q.options.map((opt, i) => {
              const show = !!feedback
              const isAnswer = i === q.answerIndex
              const userWrong =
                show &&
                'pickedIndex' in feedback &&
                feedback.pickedIndex === i &&
                !feedback.correct
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={show}
                  className={
                    'quiz-opt' +
                    (show && isAnswer ? ' quiz-opt--correct' : '') +
                    (userWrong ? ' quiz-opt--wrong' : '')
                  }
                  onClick={() => pickSingle(i)}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        )}
        {q.kind === 'bool' && (
          <div className="quiz-options">
            <button
              type="button"
              disabled={!!feedback}
              className={
                'quiz-opt' +
                (feedback && q.boolAnswer === true ? ' quiz-opt--correct' : '') +
                (feedback &&
                'boolChoice' in feedback &&
                feedback.boolChoice === true &&
                !feedback.correct
                  ? ' quiz-opt--wrong'
                  : '')
              }
              onClick={() => pickBool(true)}
            >
              正确
            </button>
            <button
              type="button"
              disabled={!!feedback}
              className={
                'quiz-opt' +
                (feedback && q.boolAnswer === false ? ' quiz-opt--correct' : '') +
                (feedback &&
                'boolChoice' in feedback &&
                feedback.boolChoice === false &&
                !feedback.correct
                  ? ' quiz-opt--wrong'
                  : '')
              }
              onClick={() => pickBool(false)}
            >
              错误
            </button>
          </div>
        )}

        {feedback && (
          <div className="quiz-feedback">
            <p className="quiz-feedback__verdict">
              {feedback.correct ? '回答正确' : '回答错误'}
            </p>
            <p className="quiz-feedback__answer">
              <strong>正确答案：</strong>
              {correctAnswerLabel(q)}
            </p>
            <p className="muted quiz-feedback__explain">{q.explain}</p>
            <button type="button" className="btn-primary quiz-feedback__next" onClick={goNext}>
              {isLast ? '完成并查看得分' : '下一题'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
