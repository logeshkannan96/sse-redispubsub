import React, { useState, useEffect } from 'react';
import './App.css';
import { clientIdBase64 } from './utils';

function App() {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
     
      let clientId = localStorage.getItem('clientId')
      if (!clientId) {
        clientId = clientIdBase64();
        localStorage.setItem('clientId', clientId);
      }

      const events = new EventSource(`http://localhost:3001/notifications/?channel=${clientId}`);

      events.onmessage = (event) => {
        console.log(event);
        const parsedData = JSON.parse(event.data);
        setMessages((messagesStored) => messagesStored.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, messages]);

  return (
    <div className='alerts-section'>
      <h1>Alerts</h1>
      {
        messages.map((message, i) =>
          <div key={i} className='card-container'>
              <p className='card-title'>{message.title}</p>
              <p className='card-body'>{message.description}</p>
          </div>
        )
      }
    </div>
  );
}

export default App;