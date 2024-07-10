import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import global_eng from "./translations/eng/global.json"
import global_rus from "./translations/rus/global.json"
import global_uzb from "./translations/uzb/global.json"
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import AuthContextProvider from './context/AuthContext.jsx'

i18next.init({
  interpolation: { escapeValue: false },
  lng: "uzb",
  resources: {
    eng: { global: global_eng },
    rus: { global: global_rus },
    uzb: { global: global_uzb }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <BrowserRouter>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </BrowserRouter>
  </AuthContextProvider>
)
