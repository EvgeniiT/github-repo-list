import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { subMonths, format } from 'date-fns';

const useGithubApi = ({ initData, initConfig }) => {
  const BASE_URL = 'https://api.github.com/';
  const [data, setData] = useState(initData);
  const [config, setConfig] = useState(initConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
 
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
 
      try {
        const result = await axios.request({ baseURL: BASE_URL, ...config });
 
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

const RepoList = () => {
  const createdAfter = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
  const [{ data: repoList, isLoading: isRepoListLoading, isError }, fetchRepos] = useGithubApi({
    initData: {items: []},
    initConfig: {
      url: `/search/repositories?q=created:>${createdAfter}+language:javascript`,
      params: {
        sort: 'stars',
        order: 'desc'
      }
    }
  });
  return (
    <>
      <SearchPanel fetchRepos={fetchRepos} createdAfter={createdAfter} />
      {isRepoListLoading && <div>Loading...</div>}
      <ul>
        {repoList.items.map(el => <Repo key={el.id} repo={el}/>)}
      </ul>
    </>
  )
}

const SearchPanel = ({ fetchRepos, createdAfter }) => {
  const [{ data: licenseList }] = useGithubApi({
    initData: [],
    initConfig: {
      url: '/licenses',
    }
  });

  const [selectedLicense, setSelectedLicsense] = useState('');
  const [nameQuery, setNameQuery] = useState('');

  const handleLicenseSelect = (e) => setSelectedLicsense(e.target.value);
  const handleSearch = () => fetchRepos({
    url: `/search/repositories?q=${nameQuery}+in:name+created:>${createdAfter}+language:javascript+license:${selectedLicense}`,
    params: {
      sort: 'stars',
      order: 'desc'
    }
  });
  const handleNameQueryChange = (e) => setNameQuery(e.target.value);

  return (
    <div>
      <input type='text' value={nameQuery} onChange={handleNameQueryChange}/>
      <select value={selectedLicense} onChange={handleLicenseSelect}>
        <option value='' disabled>Select license</option>
        {licenseList.map(({ key }) => <option key={key} value={key}>{key}</option>)}
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

const Repo = ({repo}) => {
  return (
    <li>{repo.name}</li>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Github repo list</h1>
      </header>
      <main>
        <RepoList />
      </main>
    </div>
  );
}

export default App;
