import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./SearchBar.css";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `http://localhost:5000/api/search?q=${query}`
                );
                setResults(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 400); // debounce time

        return () => clearTimeout(timeoutRef.current);
    }, [query]);

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search for restaurants or dishes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {loading && <div className="search-loading">Searching...</div>}

            {results.length > 0 && (
                <div className="search-dropdown">
                    {results.map((item) => (
                        <div className="search-item" key={item._id}>
                            <img src={item.image} alt={item.name} />
                            <div>
                                <p className="search-name">{item.name}</p>
                                <span className="search-price">${item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {query && !loading && results.length === 0 && (
                <div className="search-dropdown">
                    <p className="no-results">No results found</p>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
