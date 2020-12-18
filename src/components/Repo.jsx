import React from 'react';
import { Card } from 'antd';

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

export default Repo;