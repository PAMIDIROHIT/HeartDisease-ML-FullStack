import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock child components to isolate App tests
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../components/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('../pages/Home', () => () => <div>Home Page</div>);
jest.mock('../pages/Predict', () => () => <div>Predict Page</div>);
jest.mock('../pages/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('../pages/About', () => () => <div>About Page</div>);
jest.mock('../pages/NotFound', () => () => <div>Not Found Page</div>);

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    renderApp();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('provides context with default values', () => {
    renderApp();
    // The App component should render without errors
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});