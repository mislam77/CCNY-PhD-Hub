"use client";

import { useState } from "react";

export default function SearchResearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch(`/api/research/search?q=${query}`);
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Search Research Papers</h2>
      <input
        type="text"
        placeholder="Enter keywords..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded-md w-full mb-2"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {results.length > 0 && (
        <ul className="mt-4">
          {results.map((paper: any) => (
            <li key={paper.id} className="p-2 border-b flex justify-between">
              <h3 className="font-semibold">{paper.title}</h3>
              <a
                href={paper.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}