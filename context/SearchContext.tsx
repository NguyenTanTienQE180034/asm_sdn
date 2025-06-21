"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface SearchContextType {
    search: string;
    setSearch: (search: string) => void;
}

const SearchContext = createContext<SearchContextType>({
    search: "",
    setSearch: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);

    return (
        <SearchContext.Provider value={{ search: debouncedSearch, setSearch }}>
            {children}
        </SearchContext.Provider>
    );
}

export const useSearch = () => useContext(SearchContext);
