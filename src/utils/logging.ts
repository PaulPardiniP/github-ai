export const logger = {
  info(message: string) {
    process.stderr.write(`[INFO] ${message}\n`);
  },

  warn(message: string) {
    process.stderr.write(`[WARN] ${message}\n`);
  },

  error(message: string) {
    process.stderr.write(`[ERROR] ${message}\n`);
  },
};