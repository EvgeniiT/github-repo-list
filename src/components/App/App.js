import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { subMonths, format } from 'date-fns';
import { Card, List, Input, Select, Button, Row, Col } from 'antd';
import 'antd/dist/antd.css';

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
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        loading={isRepoListLoading}
        dataSource={repoList.items}
        renderItem={item => (
          <List.Item>
            <Repo repo={item}/>
          </List.Item>
        )}
      />
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

  const handleLicenseSelect = (value) => setSelectedLicsense(value);
  const handleSearch = () => {
    const nameSearch = nameQuery ? `${nameQuery}+in:name` : '';
    const licenseSearch = selectedLicense ? `+license:${selectedLicense}` : '';
    fetchRepos({
      url: `/search/repositories?q=${nameSearch}+created:>${createdAfter}+language:javascript${licenseSearch}`,
      params: {
        sort: 'stars',
        order: 'desc'
      }
    });
  }
  const handleNameQueryChange = (e) => setNameQuery(e.target.value);

  return (
    <div>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={{span: 24}} sm={{span: 5}}>
            <Input type='text' value={nameQuery} onChange={handleNameQueryChange} placeholder="Input name"/>
          </Col>
          <Col xs={{span: 24}} sm={{span: 5}}>
            <Select value={selectedLicense} onChange={handleLicenseSelect} style={{width: '100%'}}>
              <Select.Option value=''>All license</Select.Option>
              {licenseList.map(({ key }) => <Select.Option key={key} value={key}>{key}</Select.Option>)}
            </Select>
          </Col>
          <Col xs={{span: 24}} sm={{span: 5}}>
            <Button type='primary' onClick={handleSearch} style={{width: '100%'}}>Search</Button>
          </Col>
        </Row>
    </div>
  );
}

const Repo = ({repo}) => {
  const licenseName = repo?.license?.name || 'Not specified';
  return (
    <Card title={repo.name}>
      <p>License: {licenseName}</p>
      <p>Stars: {repo.stargazers_count}</p>
      <p>{repo.description}</p>
    </Card>
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
