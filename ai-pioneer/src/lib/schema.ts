import { z } from 'zod'
import { questions } from '../data/questions'

const answersSchema = z.object(
  Object.fromEntries(
    questions.map(q => [
      q.id,
      q.type === 'open'
        ? z.string().min(1, 'Please answer this question').max(2000, 'Answer must be 2000 characters or less')
        : z.string().min(1, 'Please select an option'),
    ])
  )
)

const companyEmailSchema = z.string()
  .trim()
  .email('Please enter a valid email address')
  .refine(
    email => {
      const normalized = email.toLowerCase()
      return normalized.endsWith('@startrader.com') || normalized.endsWith('@starprime.com')
    },
    'Please use your STARTRADER or STARPRIME company email address'
  )

export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  company_email: companyEmailSchema,
})

export const applicationSchema = personalInfoSchema.extend({
  answers: answersSchema,
})

export type ApplicationData = z.infer<typeof applicationSchema>
