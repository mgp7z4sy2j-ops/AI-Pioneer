import type { ApplicationData } from './schema'

export async function submitApplication(data: ApplicationData): Promise<void> {
  console.log('[submitApplication] Received:', JSON.stringify(data, null, 2))
  await new Promise(resolve => setTimeout(resolve, 800))
}
