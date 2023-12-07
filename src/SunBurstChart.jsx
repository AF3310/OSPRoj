import React, { useEffect } from 'react';
import anychart from 'anychart';

function SunburstChart() {
    useEffect(() => {
        if (1) {
            const data = [
                {
                    name: 'Desktop',
                    children: [
                        { name: "final", value: 4 },
                        { name: "idk", value: 2 },
                        {name: "tempSavwe",value: 4}
                        // Add more children or levels as needed
                    ],
                },
                {
                    name: 'B',
                    children: [
                        { name: 'B1', value: 150 },
                        { name: 'B2', value: 120 },
                        // Add more children or levels as needed
                    ],
                },
                // Add more data as needed
            ];

            const chart = anychart.sunburst(data, 'as-tree');

            chart.title('Sunburst Chart');
            chart.container('sunburst_graph');
            chart.background({fill: "#212E2E 0.2"});
            chart.draw();

            return () => {
                chart.dispose();
            };
        }
    }, []);

    return <div id="sunburst_graph" className={`bg-slate-800  absolute w-3/4 ml-10 h-3/4 flex`}></div>;
}

export default SunburstChart;