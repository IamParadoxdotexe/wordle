/**
 * Helper function for delaying for a specific amount of time.
 * @param duration Delay duration in milliseconds.
 */
export function Delay(duration: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}
