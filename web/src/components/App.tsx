import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import { test } from '../api';
import './App.css';

type Result = Record<string, string>;

function App() {
    let [result, setResult] = useState('');

    useEffect(() => {
        test().then((response) => setResult(response));
    }, []);

    return (
        <div className='App'>
            <header className='App-header'>
                <img src={logo} className='App-logo' alt='logo' />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <p>result: {JSON.stringify(result)}</p>
                <a
                    className='App-link'
                    href='https://reactjs.org'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
