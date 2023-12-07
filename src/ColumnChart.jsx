import React, { useEffect } from 'react';
import anychart from 'anychart';

function ColumnChart() {
    useEffect(() => {
        if (1) {
            const data = [
                { x: "final", value: 4 },
                { x: "idk", value: 2 },
                {x: "tempSavwe",value: 4}
                // Add more data as needed
            ];

            const sortedData = data.sort((a, b) => b.value - a.value);

            const chart = anychart.column(sortedData);

            chart.title('/home/Desktop');
            chart.legend().position('right');
            chart.legend().itemsLayout('vertical');
            chart.background({fill: "#212E2E 0.2"});
            chart.container('column_chart');
            chart.draw();

            return () => {
                chart.dispose();
            };
        }
    }, []);

    return <div id="column_chart" className={`bg-slate-800  absolute w-3/4 ml-10 h-3/4 flex justify-center items-center `}></div>;
}
export default ColumnChart;