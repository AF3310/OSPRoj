import React, { useEffect } from 'react';
import anychart from 'anychart';

function BarChart(props) {
    useEffect(() => {
        if (1) {
            const data = [
                { x: "final", value: 4 },
                { x: "idk", value: 2 },
                {x: "tempSavwe",value: 4}
                // Add more data as needed
            ];

            const sortedData = data.sort((a, b) => b.value - a.value);

            const chart = anychart.bar(sortedData);

            chart.title('/home/Desktop');
            chart.legend().position('right');
            chart.legend().itemsLayout('vertical');
            chart.background({fill: "#212E2E 0.2"});
            chart.container('bar_graph');
            chart.draw();

            return () => {
                chart.dispose();
            };
        }
    }, []);

    return <div id="bar_graph" className={`bg-slate-800 w-3/4 ml-10 h-3/4 flex  `}></div>;
}

export default BarChart;
