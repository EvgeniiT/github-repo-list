import React from 'react';

import RepoList from '../RepoList';

import './App.css';
import 'antd/dist/antd.css';

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
