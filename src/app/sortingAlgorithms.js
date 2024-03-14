// sortingAlgorithms.js

// Função para ordenar a matriz usando o algoritmo quicksort
export function quicksort(array, Ninicial, Nfinal) {
  if (array.length <= 1) return array;

  const pivot = array[0].substring(Ninicial, Nfinal);
  const head = array.filter(n => n.substring(Ninicial, Nfinal) < pivot);
  const equal = array.filter(n => n.substring(Ninicial, Nfinal) === pivot);
  const tail = array.filter(n => n.substring(Ninicial, Nfinal) > pivot);

  return quicksort(head, Ninicial, Nfinal).concat(equal).concat(quicksort(tail, Ninicial, Nfinal));
}

// Função para realizar a busca binária em uma matriz ordenada
export function binarySearch(sortedArray, target, Ninicial, Nfinal) {
  let left = 0;
  let right = sortedArray.length - 1;

  while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const element = sortedArray[mid];
      const substring = element.substring(Ninicial, Nfinal);
      if (substring === target) {
          return mid;
      } else if (substring < target) {
          left = mid + 1;
      } else {
          right = mid - 1;
      }
  }
  return -1;
}
