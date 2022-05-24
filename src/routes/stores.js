import { writable } from 'svelte/store';

function createSlices() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    push: (range) => update (arr => {
      arr.push(range)
      return arr
    }),
    sort: () => update (arr => {
      arr.sort(function(a,b){return(a[0] - b[0]);});
      return arr
    }),
    reset: () => set([])
  };
}

export const slices = createSlices();
