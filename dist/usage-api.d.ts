import type { UsageData } from './types.js';
export type { UsageData } from './types.js';
/**
 * Get the Claude config directory, respecting CLAUDE_CONFIG_DIR environment variable.
 * This allows using multiple Claude Code configurations (e.g., personal and work accounts).
 *
 * @param homeDir - The user's home directory
 * @returns The config directory path (either from env var or default ~/.claude)
 */
export declare function getConfigDir(homeDir: string): string;
interface UsageApiResponse {
    five_hour?: {
        utilization?: number;
        resets_at?: string;
    };
    seven_day?: {
        utilization?: number;
        resets_at?: string;
    };
}
interface UsageApiResult {
    data: UsageApiResponse | null;
    error?: string;
}
export type UsageApiDeps = {
    homeDir: () => string;
    fetchApi: (accessToken: string) => Promise<UsageApiResult>;
    now: () => number;
    readKeychain: (now: number, homeDir: string) => {
        accessToken: string;
        subscriptionType: string;
    } | null;
};
/**
 * Get OAuth usage data from Anthropic API.
 * Returns null if user is an API user (no OAuth credentials) or credentials are expired.
 * Returns { apiUnavailable: true, ... } if API call fails (to show warning in HUD).
 *
 * Uses file-based cache since HUD runs as a new process each render (~300ms).
 * Cache TTL: 60s for success, 15s for failures.
 */
export declare function getUsage(overrides?: Partial<UsageApiDeps>): Promise<UsageData | null>;
/**
 * Get path for keychain failure backoff cache.
 * Separate from usage cache to track keychain-specific failures.
 * Exported for testing.
 */
export declare function getKeychainBackoffPath(homeDir: string): string;
/**
 * Check if we're in keychain backoff period (recent failure/timeout).
 * Prevents re-prompting user on every render cycle.
 * Exported for testing.
 */
export declare function isKeychainBackoff(homeDir: string, now: number): boolean;
/**
 * Record keychain failure for backoff.
 * Exported for testing.
 */
export declare function recordKeychainFailure(homeDir: string, now: number): void;
export declare function clearCache(homeDir?: string): void;
//# sourceMappingURL=usage-api.d.ts.map