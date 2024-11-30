// "use client"; // Remove this line to make the component a server component

import React from 'react';
import axios from 'axios';
import * as cheerio from 'cheerio';

const ResourcesGuidePage = async () => {
    try {
        // Fetch data server-side
        const response = await axios.get('https://www.ccny.cuny.edu/admissions/graduate-studies-offices-and-services');
        const html = response.data;
        const $ = cheerio.load(html);

        const table = $('table');

        const tableData: string[][] = [];

        // Extract the table data
        table.find('tr').each((i, el) => {
            const row: string[] = [];
            $(el).find('th, td').each((j, td) => {
                row.push($(td).text());
            });
            // Only add non-empty rows
            if (row.length > 0) {
                tableData.push(row);
            }
        });    

        // console.log(tableData);

        return (
            <div className="p-8">
              <h1 className="text-4xl font-bold mb-8">Graduate Student Resource Guide</h1>
              {tableData.length > 0 ? (
                <table className="table-auto w-full border-collapse">
                  {/* Render table body */}
                  <tbody>
                    {tableData.map((row, rowIndex) => (
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
    } catch (error) {
        console.error('Error fetching data:', error);
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold mb-8">Graduate Student Resource Guide</h1>
                <p>Error fetching data</p>
            </div>
        );
    }
}

export default ResourcesGuidePage;