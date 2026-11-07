export const districts = Array.from({ length: 20 }, (_, i) => ({
  value: `dist-${i + 1}`,
  label: `District ${i + 1}`,
  stateId: `state-${(i % 7) + 1}`,
}));