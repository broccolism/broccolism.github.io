import logo from './assets/broccoli.png';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import countdown from 'countdown';

function tick() {
  const month = countdown(new Date(2020, 12, 1)).months.toString();
  const day = countdown(new Date(2020, 12, 1)).days.toString();
  // const hour = countdown(new Date(2020, 12, 1)).hours.toString();
  // const minute = countdown(new Date(2020, 12, 1)).minutes.toString();
  // const second = countdown(new Date(2020, 12, 1)).seconds.toString();

  const element = (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Time left to be more delicious broccoli salad:
        </p>
        <div>
          {month} month and {day} days
        </div>
      </header>
    </div>
  );

  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

function App() {
  return setInterval(tick, 1000);
}

export default App;
