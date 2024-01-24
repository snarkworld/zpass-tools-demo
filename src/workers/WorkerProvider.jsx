import { useEffect, useState } from 'react';
import WorkerContext from './WorkerContext';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
const WorkerProvider = ({ children }) => {
  // State variables to keep track of worker, readiness, and loading status
  const [worker, setWorker] = useState(null);
  const [workerReady, setWorkerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle worker messages
  const handleWorkerMessage = (event) => {
    const { type } = event.data;

    if (type === 'ALEO_WORKER_READY') {
      setWorkerReady(true);
    } else if (['OFFLINE_EXECUTION_COMPLETED', 'EXECUTION_TRANSACTION_COMPLETED', 'ERROR'].includes(type)) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize Web Worker
    const workerInstance = new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module',
    });

    workerInstance.addEventListener('message', handleWorkerMessage);

    // Set worker instance
    setWorker(workerInstance);

    // Cleanup function to terminate the worker when the component is unmounted
    return () => {
      workerInstance.terminate();
    };
  }, []);

  // Render loading spinner if worker is not ready
  if (!workerReady) {
    return (
      <div className="spinner">
        <div className="dot1"></div>
      </div>
    );
  }

  // Function to post a message to the worker and return a promise
  const postMessagePromise = (message) => {
    return new Promise((resolve, reject) => {
      try {
        setIsLoading(true);

        worker.onmessage = (event) => {
          resolve(event.data);
        };

        worker.onerror = (error) => {
          reject(error);
        };

        worker.postMessage(message);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    });
  };

  return (
    <WorkerContext.Provider value={{ workerReady, worker, postMessagePromise, isLoading }}>
      {children}
    </WorkerContext.Provider>
  );
};
WorkerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default WorkerProvider;
