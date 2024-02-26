import {useState} from 'react'
import SearchComponent from './SearchComponent';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className="App">
                <header className="App-header">
                    <h1>Psychdesk Search</h1>
                </header>
                <SearchComponent/>
            </div>

        </>
    )
}

export default App
