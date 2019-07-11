import { useState, useEffect } from 'react';
// import { useSpring, animated as anim } from 'react-spring';

export default function useHttp(url, options) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(url, { ...options, signal: abortController.signal })
      .then(response => {
        if (response.status > 299) throw new Error(response.statusText);
        return response;
      })
      .then(response => response.json())
      .then(setData)
      .catch(({ message, name }) => name != 'AbortError' && setError(message));

    return () => abortController.abort();
  }, []);

  return { data, error };
}
