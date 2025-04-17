import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ Correct import for React 18
// import './index.css';
import './globalcss/global.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { store } from "./store/reduxstore";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injectStore } from './Api/globalapi';
injectStore(store);

const queryClient = new QueryClient();

// ✅ React 18 createRoot API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
