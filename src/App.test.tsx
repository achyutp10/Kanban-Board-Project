import { render, screen } from '@testing-library/react';
import App from './components/App';

test('renders kanban board title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Kanban Board/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders all initial columns', () => {
  render(<App />);
  expect(screen.getByText(/To do/i)).toBeInTheDocument();
  expect(screen.getByText(/In progress/i)).toBeInTheDocument();
  expect(screen.getByText(/Done/i)).toBeInTheDocument();
});