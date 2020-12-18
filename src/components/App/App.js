import React, { useState, useEffect } from 'react';
import './App.css';
import { Octokit } from '@octokit/core';
import axios from 'axios';
import { subMonths, format } from 'date-fns';
import { Card, List, Input, Select, Button, Row, Col, Pagination } from 'antd';
import 'antd/dist/antd.css';

const useGithubApi = (initData, initConfig) => {
  // const BASE_URL = 'https://api.github.com/';
  // const octokit = new Octokit();
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

const RepoList = () => {
  const created = `>${format(subMonths(new Date(), 1), 'yyyy-MM-dd')}`;
  const language = 'javascript';
  const inQualifier = 'name';
  const [searchString, setSearchString] = useState('');
  const [license, setLicense] = useState('');
  const [page, setPage] = useState(1);

  const initConfig = {
    url: '/search/repositories',
    q: `in:name created:${created} language:javascript`,
    sort: 'stars',
    order: 'desc',
    page: '1'
  }

  const [{ data: repoList, isLoading: isRepoListLoading, isError }, fetchRepos] = useGithubApi({total_count: 0, items: []}, initConfig);

  useEffect(() => {
    const licenseQualifier = license ? ` license:${license}` : '';
    fetchRepos({
      url: '/search/repositories',
      q: `${searchString} in:${inQualifier} created:${created} language:${language}${licenseQualifier}`.trim(),
      sort: 'stars',
      order: 'desc',
      page
    });
  }, [searchString, license, page, created, fetchRepos])

  const handlePageChange = (page) => setPage(page);

  return (
    <>
      <SearchPanel fetchRepos={fetchRepos} setLicense={setLicense} setSearchString={setSearchString}/>
      <Pagination
        current={page}
        total={repoList.total_count}
        pageSize={30}
        showSizeChanger={false}
        onChange={handlePageChange}
      />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          xl: 6,
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

const SearchPanel = ({ setLicense, setSearchString }) => {
  const [{ data: licenseList }] = useGithubApi(
    [],
    {
      url: '/licenses',
    }
  );

  const [selectedLicense, setSelectedLicsense] = useState('');
  const [nameQuery, setNameQuery] = useState('');

  const handleLicenseSelect = (value) => setSelectedLicsense(value);
  const handleSearch = () => {
    setLicense(selectedLicense);
    setSearchString(nameQuery);
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
