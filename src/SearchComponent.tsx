import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

// Define a type for your results
interface SearchResult {
    _source: {
        video_title: string;
        text: string;
        video_url: string;
    };
}


const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useCallback(debounce(async (query) => {
        if (!query) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const auth = {
            username: import.meta.env.VITE_ELASTICSEARCH_USERNAME,
            password: import.meta.env.VITE_ELASTICSEARCH_PASSWORD,
        };

        try {
            const response = await axios.post(
                `https://onrise-care-search-9932419020.us-east-1.bonsaisearch.net:443/video_transcripts/_search`,
                {
                    query: {
                        multi_match: {
                            query,
                            fields: ["text", "video_title"],
                        },
                    },
                },
                { auth }
            );

            setResults(response.data.hits.hits);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    }, 300), []);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        handleSearch(e.target.value);
    };

    const highlightQuery = (text: string, query: string) => {
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <span key={index} className="italic underline bg-yellow-200">{part}</span> : part
        );
    };

    // Determine column count based on result count
    const columnStyle = {
        columnCount: results.length === 1 ? 1 : 3,
        columnGap: '1rem',
    };

    return (
        <div>
            <form onSubmit={(e) => e.preventDefault()} className="mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="Search..."
                    className="border p-2 mr-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2" disabled={isSearching}>Search</button>
            </form>
            <div style={columnStyle} className="break-inside-avoid">
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <div key={index} className="p-2" style={{ breakInside: 'avoid', marginBottom: '1rem' }}>
                            <dl className="border border-gray-200 p-4 flex flex-col justify-between h-full">
                                <dt className="text-sm italic font-normal mb-2">({result._source.video_title})</dt>
                                <dd className="font-bold mb-2">{highlightQuery(result._source.text, query)}</dd>
                                <dd><a href={result._source.video_url} target="_blank" rel="noopener noreferrer"
                                       className="text-blue-500 hover:text-blue-700 mt-auto">Watch Video</a></dd>
                            </dl>
                        </div>
                    ))
                ) : !isSearching && query ? (
                    <div className="text-center p-4 w-full">Nothing found. Try a different search?</div>
                ) : null}
            </div>
        </div>
    );
};

export default SearchComponent;
