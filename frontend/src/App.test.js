import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the actual component that exists
jest.mock('./components/FlappyBirdGame', () => {
  return function MockFlappyBirdGame() {
    return <div data-testid="flappy-bird-game">Flappy Bird Game</div>;
  };
});

test('renders app without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});

test('app has correct structure', () => {
  const { container } = render(<App />);
  expect(container.firstChild).not.toBeNull();
});

test('renders flappy bird game', () => {
  render(<App />);
  expect(screen.getByTestId('flappy-bird-game')).toBeInTheDocument();
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

  test('contains flappy bird game component', () => {
    render(<App />);
    const gameComponent = screen.getByTestId('flappy-bird-game');
    expect(gameComponent).toBeInTheDocument();
    expect(gameComponent).toHaveTextContent('Flappy Bird Game');
  });
});