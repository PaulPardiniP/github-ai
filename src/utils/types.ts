export type GitHubClient = {
  request: (
    route: string,
    options?: Record<string, unknown>
  ) => Promise<{ data: unknown }>;
};