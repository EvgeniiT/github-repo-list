import React, { useState, useEffect, useRef } from 'react';

import { subMonths, format } from 'date-fns';
import { List, Pagination } from 'antd';
import useGithubApi from '../api/useGithubApi';
import SearchPanel from './SearchPanel';
import Repo from './Repo';

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


  const initRender = useRef(true);
  useEffect(() => {
    if (initRender.current) {
      initRender.current = false;
    } else {
      const licenseQualifier = license ? ` license:${license}` : '';
      fetchRepos({
        url: '/search/repositories',
        q: `${searchString} in:${inQualifier} created:${created} language:${language}${licenseQualifier}`.trim(),
        sort: 'stars',
        order: 'desc',
        page
      });
    }
  }, [searchString, license, page, created, fetchRepos])

  const handlePageChange = (page) => setPage(page);

  return (
    <>
      <SearchPanel fetchRepos={fetchRepos} setLicense={setLicense} setSearchString={setSearchString}/>
      {isError ?
        <div>Can't load data. Check console and try later</div> :
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
      }
      {!isRepoListLoading && <Pagination
        current={page}
        total={repoList.total_count}
        pageSize={30}
        showSizeChanger={false}
        onChange={handlePageChange}
        hideOnSinglePage
      />}
    </>
  )
}

export default RepoList;