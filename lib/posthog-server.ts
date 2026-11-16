import { PostHog } from "posthog-node"

export function createPosthogServer() {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
    flushAt: 1,
    flushInterval: 0,
  })
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST
  if (!token || !host) return

  try {
    const posthog = new PostHog(token, {
      host,
      flushAt: 1,
      flushInterval: 0,
    })
    posthog.capture({ distinctId, event, properties })
    await posthog.shutdown()
  } catch {
    // Never fail API requests due to analytics
  }
}
