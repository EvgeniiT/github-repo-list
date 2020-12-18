import React, { useState } from 'react';

import useGithubApi from '../api/useGithubApi';
import { Col, Row, Input, Select, Button } from 'antd';

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

export default SearchPanel;