export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {

  let attempt = 0;

  while (true) {
    try {
      return await operation();

    } catch (error) {
      const status = (error as { status?: number }).status;

      // Solo reintentamos cuando GitHub indica rate limit
      if (status !== 429 || attempt >= maxRetries) {
        throw error;
      }

      attempt++;

      // Exponential backoff:
      // 1 segundo → 2 segundos → 4 segundos
      const waitTime = delayMs * 2 ** (attempt - 1);

      await new Promise((resolve) =>
        setTimeout(resolve, waitTime)
      );
    }
  }
}