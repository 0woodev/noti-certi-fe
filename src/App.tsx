import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router} from "react-router-dom";
import BaseRouter from "./routes";
import Layout from "./Layout";
import {RecoilRoot} from "recoil";


const App: React.FC = () => {
  return (
      <RecoilRoot>
        <Router>
          <Layout>
            <BaseRouter />
          </Layout>
        </Router>
      </RecoilRoot>
  );
};

export default App;
