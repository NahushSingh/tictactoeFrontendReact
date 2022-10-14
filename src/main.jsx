import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { io } from 'socket.io-client';

const socketio = io()

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App socketio={socketio}/>
  // </React.StrictMode>
)
