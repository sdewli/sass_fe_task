import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

global.fetch = jest.fn();

describe('App Component', () => {
  it('should render the table with data', async () => {
    const mockData = [
      {
        "s.no": 1,
        "percentage.funded": 50,
        "amt.pledged": 3000,
      },
      {
        "s.no": 2,
        "percentage.funded": 60,
        "amt.pledged": 5000,
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: /1/i })).toBeInTheDocument(); 
      expect(screen.getByRole('cell', { name: /50/i })).toBeInTheDocument();  
      expect(screen.getByRole('cell', { name: /\$3,000/i })).toBeInTheDocument();  
      expect(screen.getByRole('cell', { name: /2/i })).toBeInTheDocument();  
      expect(screen.getByRole('cell', { name: /60/i })).toBeInTheDocument();  
      expect(screen.getByRole('cell', { name: /\$5,000/i })).toBeInTheDocument(); 
    });
  });

  it('should display an error message when the fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error fetching projects: Failed to fetch/i)).toBeInTheDocument();
    });
  });
});
