/**
 * generate a clean array containing only the waiters ids
 */
export const getWaiters = (selectedWaiters) => {
  const waiters = new Set();

  selectedWaiters.forEach((selectedWaiter) => {
    waiters.add(selectedWaiter.value);
  });

  return [...waiters.values()];
};
