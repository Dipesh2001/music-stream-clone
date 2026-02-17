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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
