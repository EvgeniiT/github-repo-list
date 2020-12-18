import { useState, useEffect } from 'react';

import { Octokit } from '@octokit/core';

const useGithubApi = (initData, initConfig) => {
  const [data, setData] = useState(initData);
  const [config, setConfig] = useState(initConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    const octokit = new Octokit();
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
 
      try {
        const result = await octokit.request({ ...config });
 
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }
 
      setIsLoading(false);
    };
 
    fetchData();
  }, [config]);
 
  return [{ data, isLoading, isError }, setConfig];
}

export default useGithubApi;