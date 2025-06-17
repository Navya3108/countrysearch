import React, { useState, useEffect } from 'react';

// --- STYLES ---
// Using inline styles as objects to keep everything in one file.
const styles = {
  app: {
    backgroundColor: '#f0f2f5', // A lighter background
    color: '#1c1e21', // Darker text for better readability
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1c1e21',
    margin: 0,
  },
  searchBar: {
    width: '100%',
    maxWidth: '600px',
    padding: '15px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#ffffff',
    color: '#1c1e21',
    margin: '0 auto',
    display: 'block',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  // Modified styles to center the grid content
  countriesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center', // This centers the items horizontally
    gap: '20px',
    marginTop: '40px',
  },
  countryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '180px',
    width: '200px', // Set a fixed width for consistency in a flex layout
    cursor: 'pointer',
  },
  countryFlag: {
    width: '100px',
    height: '60px',
    objectFit: 'cover',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  countryName: {
    marginTop: '15px',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginTop: '50px',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginTop: '50px',
    color: '#888',
    width: '100%', // Ensure the message takes full width to be centered
  },
};

// --- API Endpoint ---
const API_URL = 'https://countries-search-data-prod-812920491762.asia-south1.run.app/countries';

function CountrySearch() {
  // State to store the full list of countries from the API
  const [countries, setCountries] = useState([]);
  
  // State to store the user's search input
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to store the list of countries to be displayed (after filtering)
  const [filteredCountries, setFilteredCountries] = useState([]);

  // State to handle loading status
  const [isLoading, setIsLoading] = useState(true);

  // useEffect hook to fetch data when the component first loads
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Filter out any invalid entries from the API upfront
        const validCountries = data.filter(country => country && country.common && country.png);
        setCountries(validCountries);
        setFilteredCountries(validCountries); // Initially, show all countries
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []); // The empty dependency array [] means this effect runs only once

  // useEffect hook to filter countries whenever the search term changes
  useEffect(() => {
    // Trim the search term and convert to lower case for case-insensitive search
    const lowercasedSearchTerm = searchTerm.trim().toLowerCase();

    if (lowercasedSearchTerm === '') {
        setFilteredCountries(countries); // If search is empty, show all countries
        return;
    }

    const filtered = countries.filter(country =>
      country.common.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]); // This effect re-runs if searchTerm or the main countries list changes

  // Handler for the search input field
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Dynamic style for card hover effect
  const handleMouseOver = (e) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  };


  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>Country Flags Search</h1>
      </header>
      
      <input
        type="text"
        placeholder="Search for a country..."
        style={styles.searchBar}
        value={searchTerm}
        onChange={handleSearchChange}
        data-testid="search-input"
      />

      {isLoading ? (
        <p style={styles.loadingText}>Loading countries...</p>
      ) : (
        <div style={styles.countriesGrid}>
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <div 
                key={country.common} 
                style={styles.countryCard}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                data-testid="country-card"
              >
                <img
                  src={country.png}
                  alt={`Flag of ${country.common}`}
                  style={styles.countryFlag}
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x60/eee/ccc?text=No+Flag'; }}
                  data-testid="country-flag"
                />
                <h2 style={styles.countryName} data-testid="country-name">{country.common}</h2>
              </div>
            ))
          ) : (
            // Show this message only if a search has been performed with no results
            searchTerm && <p style={styles.noResultsText}>No countries found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CountrySearch;
