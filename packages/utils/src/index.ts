export const compose = (...fns: Array<(input: unknown) => unknown>) => {
  // TODO: add shared utility helpers
  return (input: unknown) => fns.reduceRight((value, fn) => fn(value), input);
};
