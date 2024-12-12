import { useState, useEffect } from 'react';
import * as cheerio from 'cheerio';

const useFetchTableData = () => {
    const [tableData, setTableData] = useState<string[][]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/resources');
                if (!res.ok) {
                    throw new Error(`Error fetching data: ${res.statusText}`);
                }
                const html = await res.text();
                const $ = cheerio.load(html);

                const table = $('table');

                const fetchedTableData: string[][] = [];

                table.find('tr').each((i, el) => {
                    const row: string[] = [];
                    $(el)
                        .find('th, td')
                        .each((j, td) => {
                            row.push($(td).text());
                        });
                    if (row.length > 0) {
                        fetchedTableData.push(row);
                    }
                });

                setTableData(fetchedTableData);
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return { tableData, error };
};

export default useFetchTableData;