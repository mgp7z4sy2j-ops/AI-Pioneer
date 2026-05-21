/** Official answer key for 26 multiple-choice questions (Q1–Q21, Q23–Q24, Q26, Q28–Q29). */
export const mcAnswerKeys: Record<number, string> = {
  1: 'A',
  2: 'B',
  3: 'B',
  4: 'A',
  5: 'B',
  6: 'B',
  7: 'C',
  8: 'B',
  9: 'B',
  10: 'B',
  11: 'B',
  12: 'B',
  13: 'B',
  14: 'B',
  15: 'B',
  16: 'B',
  17: 'B',
  18: 'A',
  19: 'B',
  20: 'B',
  21: 'B',
  23: 'D',
  24: 'B',
  26: 'C',
  28: 'B',
  29: 'D',
}

export const openQuestionIds = [22, 25, 27, 30] as const

export type OpenQuestionId = (typeof openQuestionIds)[number]
