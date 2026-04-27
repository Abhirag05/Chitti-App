export class ErrorHandler {
  log(error: unknown, context?: string) {
    // central place to extend with Sentry or other monitoring
    // keep minimal here
    // eslint-disable-next-line no-console
    console.error(`[ErrorHandler] ${context ?? 'global'}:`, error);
  }

  // transform error for UI
  format(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
  }
}

export default new ErrorHandler();
