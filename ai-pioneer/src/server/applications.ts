import { createServerFn } from '@tanstack/react-start'
import { applicationSchema } from '@/lib/schema'
import { addApplication } from '@/server/application-store'

export const submitApplication = createServerFn({ method: 'POST' })
  .inputValidator(applicationSchema)
  .handler(async ({ data }) => {
    const record = await addApplication(data)
    return { ok: true as const, id: record.id }
  })
