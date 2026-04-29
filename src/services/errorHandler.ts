export class ErrorHandler {
  log(error: unknown, context?: string) {
    // central place to extend with Sentry or other monitoring
    // keep minimal here
    // eslint-disable-next-line no-console
    console.error(`[ErrorHandler] ${context ?? 'global'}:`, error);
  }

  format(error: unknown): string {
    if (!error) {
      return 'Something went wrong. Please try again.';
    }

    if (typeof error === 'string') {
      return this.toUserMessage(error);
    }

    if (error instanceof Error) {
      return this.toUserMessage(error.message);
    }

    if (typeof error === 'object') {
      const maybeMessage = 'message' in error ? String((error as { message?: unknown }).message ?? '') : '';
      return this.toUserMessage(maybeMessage || 'Something went wrong. Please try again.');
    }

    return 'Something went wrong. Please try again.';
  }

  private toUserMessage(message: string): string {
    const normalized = message.trim();

    if (!normalized) {
      return 'Something went wrong. Please try again.';
    }

    const lower = normalized.toLowerCase();

    if (lower.includes('network') || lower.includes('failed to fetch') || lower.includes('offline')) {
      return 'No internet connection. Check your network and try again.';
    }

    if (lower.includes('permission') || lower.includes('unauthorized')) {
      return 'You do not have permission to complete this action.';
    }

    if (lower.includes('index')) {
      return 'Data is still syncing. Please try again in a moment.';
    }

    if (lower.includes('invalid')) {
      return 'Please review the input values and try again.';
    }

    return normalized;
  }
}

export default new ErrorHandler();
