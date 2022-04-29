import React from 'react';
import './styles/App.css';
// import UserComponent from './components/UserComponent';
import ChatComponent from './components/ChatComponent';

interface AppProps 
{

};

interface AppState
{

};

export default class App extends React.Component<AppProps, AppState>
{

  render(): React.ReactNode
  {
    return (
      <div className="App">
        <header>
        </header>
        <ChatComponent />
      </div>
    );
  }

};


