"use client"; // Remove this line to make the component a server component

import React, { useState } from 'react';
import useFetchTableData from './hooks/useFetchTableData';

const ResourcesGuidePage = () => {
    const { tableData, error } = useFetchTableData();
    const [searchQuery, setSearchQuery] = useState('');

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold mb-8">Graduate Student Resource Guide</h1>
                <p>{error}</p>
            </div>
        );
    }

    const filteredTableData = searchQuery
        ? tableData.filter(row => row.some(cell => cell.toLowerCase().includes(searchQuery.toLowerCase())))
        : tableData;

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Graduate Student Resource Guide</h1>
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 p-2 border border-gray-300"
            />
            {filteredTableData.length > 0 ? (
                <table className="table-auto w-full border-collapse">
                    <tbody>
                        {filteredTableData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="border px-4 py-2 align-top whitespace-pre-wrap">
                                        <p className='text-center'>
                                            {cell}
                                        </p>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data found.</p>
            )}
        </div>
    );
}

export default ResourcesGuidePage;