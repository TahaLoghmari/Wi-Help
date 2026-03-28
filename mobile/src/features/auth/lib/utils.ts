export function getProgressValue(step: number): number {
  if (step === 1) return 0;
  if (step === 2) return 50;
  return 100;
}
