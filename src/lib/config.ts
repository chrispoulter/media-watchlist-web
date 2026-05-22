import { z } from 'zod';

declare global {
    interface Window {
        __ENV__?: Record<string, string>;
    }
}

const configSchema = z.object({
    VITE_API_URL: z.url(),
    VITE_APP_VERSION: z.string(),
});

export const config = configSchema.parse({
    ...import.meta.env,
    ...window.__ENV__,
});
