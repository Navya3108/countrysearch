import React, { useState, useEffect } from 'react';

// --- STYLES ---
const styles = {
  app: {
    backgroundColor: '#f0f2f5',
    color: '#1c1e21',
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
    margin: '0 auto 40px auto',
    display: 'block',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  countriesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '10px',
    width: '150px',
    height: '150px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  flag: {
    width: "100px", 
    height: "60px", 
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  name: {
    fontSize: "14px", 
    fontWeight: 'bold',
    margin: 0, 
    wordWrap: "break-word"
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
    width: '100%',
  },
};

// --- API Endpoint ---
const API_URL = 'https://countries-search-data-prod-812920491762.asia-south1.run.app/countries';

function CountrySearch() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const validCountries = data.filter(country => country && country.common && country.png);
        setCountries(validCountries);
        setFilteredCountries(validCountries);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.trim().toLowerCase();
    if (lowercasedSearchTerm === '') {
        setFilteredCountries(countries);
        return;
    }
    const filtered = countries.filter(country =>
      country.common.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
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
        <div style={styles.countriesContainer}>
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <div 
                key={country.common} 
                className="countryCard" // Added className as requested
                style={styles.card}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                data-testid="country-card"
              >
                <img
                  src={country.png}
                  alt={`Flag of ${country.common}`}
                  style={styles.flag}
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x60/eee/ccc?text=No+Flag'; }}
                  data-testid="country-flag"
                />
                <p style={styles.name} data-testid="country-name">{country.common}</p>
              </div>
            ))
          ) : (
            searchTerm && <p style={styles.noResultsText}>No countries found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CountrySearch;
