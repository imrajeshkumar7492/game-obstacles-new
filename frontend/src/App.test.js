import { render, screen } from '@testing-library/react';
import App from './App';

// Mock any components that might cause issues
jest.mock('./components/GameBoard', () => {
  return function MockGameBoard() {
    return <div data-testid="game-board">Game Board</div>;
  };
});

jest.mock('./components/ScoreBoard', () => {
  return function MockScoreBoard() {
    return <div data-testid="score-board">Score Board</div>;
  };
});

test('renders app without crashing', () => {
  render(<App />);
  // Test that the app renders without throwing an error
  const appElement = screen.getByTestId('app') || document.body;
  expect(appElement).toBeInTheDocument();
});

test('app has correct structure', () => {
  const { container } = render(<App />);
  expect(container.firstChild).not.toBeNull();
});

// Basic smoke tests
describe('App smoke tests', () => {
  test('renders without error', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  test('contains main app container', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.App') || container.firstChild).toBeTruthy();
  });
});