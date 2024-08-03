import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function AutocompleteChampionInput({ value, onChange, placeholder, onSelectNext }) {
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef(null);

    const debouncedFetchSuggestions = useRef(
        debounce(async (input) => {
            if (input.length > 0) {
                try {
                    const response = await axios.get(`http://15.165.163.233:9832/public/searchChampionName?champion=${input}`);
                    setSuggestions(response.data);
                    setIsOpen(true);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, 300)
    ).current;

    useEffect(() => {
        debouncedFetchSuggestions();
    }, [debouncedFetchSuggestions]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prevIndex) =>
                prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex !== -1) {
                handleSelect(suggestions[highlightedIndex].champion);
            } else {
                onSelectNext();
            }
        }
    };

    const handleSelect = (champion) => {
        onChange(champion);
        setIsOpen(false);
        onSelectNext();
    };

    const handleBlur = () => {
        setTimeout(() => setIsOpen(false), 200);
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="w-full p-2 rounded bg-gray-600 text-white"
            />
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 mt-1 max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={`p-2 hover:bg-gray-600 cursor-pointer text-white ${
                                index === highlightedIndex ? 'bg-gray-500' : ''
                            }`}
                            onClick={() => handleSelect(suggestion.champion)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            {suggestion.champion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AutocompleteChampionInput;