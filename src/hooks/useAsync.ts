/**
 * 异步请求Hook
 * 统一处理异步请求的loading、error、data状态
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { handleError } from '../utils/errorHandler';

interface AsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showError?: boolean;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const {
    immediate = false,
    onSuccess,
    onError,
    showError = true,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    loading: immediate,
    error: null,
    data: null,
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ loading: true, error: null, data: null });

      try {
        const result = await asyncFunction(...args);

        if (isMountedRef.current) {
          setState({ loading: false, error: null, data: result });
          onSuccess?.(result);
        }

        return result;
      } catch (error: any) {
        if (isMountedRef.current) {
          setState({ loading: false, error, data: null });
          
          if (showError) {
            handleError(error);
          }
          
          onError?.(error);
        }

        throw error;
      }
    },
    [asyncFunction, onSuccess, onError, showError]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return {
    ...state,
    execute,
    reset: () => setState({ loading: false, error: null, data: null }),
  };
}
