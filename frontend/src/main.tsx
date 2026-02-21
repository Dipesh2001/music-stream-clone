import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx'; // Import ThemeProvider
import { AppWrapper } from './components/common/PageMeta.tsx'; // Import AppWrapper

import ToastProvider from './components/toast/ToastProvider.tsx'; // Import ToastProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider> {/* Wrap with ToastProvider */}
          <AppWrapper>
            <App />
          </AppWrapper>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
