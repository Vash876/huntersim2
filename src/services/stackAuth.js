/**
 * Neon Auth (Stack) Configuration for Vue.js
 * Official Neon Auth integration using @stackframe/stack SDK
 */
import { StackClientApp } from '@stackframe/stack';

export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  tokenStore: 'cookie',
  // Ensure the correct base URL is used
  baseUrl: import.meta.env.VITE_STACK_BASE_URL || undefined,
});

export default stackClientApp;
