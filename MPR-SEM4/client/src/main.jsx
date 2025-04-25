import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { FireBaseProvider } from './firebase.jsx'
import { Provider } from 'react-redux';
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <FireBaseProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FireBaseProvider>
  </Provider>

)
