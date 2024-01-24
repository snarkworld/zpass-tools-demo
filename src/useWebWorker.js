import { useEffect, useState } from 'react';

const useWebWorker = (url, account) => {
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    if (!worker && account) {
      const newWorker = new Worker(new URL(url, import.meta.url), {
        type: 'module',
      });
      setWorker(newWorker);

      return () => {
        newWorker.terminate();
      };
    }
  }, [worker, account]);

  return worker;
};

export default useWebWorker;
