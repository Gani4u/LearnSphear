import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/reduxstore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

test('renders learnsphere app without crashing', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  );

  const elements = screen.getAllByText(/LearnSpear/i);
  expect(elements.length).toBeGreaterThan(0);
});
