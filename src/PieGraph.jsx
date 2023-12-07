import React, { useEffect } from 'react';
import anychart from 'anychart'; // Import AnyChart library (if not already imported)

function PieGraph(props) {
  
  useEffect(() => {
    // This code will run after the component mounts
    console.log("TEST THIS ");
    //console.log(props.)
    // Data for the chart (this might come from an API call or be passed as props)
    const data = []
    console.log(props.tree);
    let dataNames=[];
    let dataValues=[];
    for( const path of props.tree.entries){
      dataNames.push(path.name);
      dataValues.push(path.value);
    }
    for(var i=0;i<dataNames.length;i+=1){
      data.push({x:dataNames[i], dataValues:value[i]});
    }

    

    // Create the pie chart
    const chart = anychart.pie();
    chart.data(data);

    // Configure chart settings
    chart.background().fill("none");
    chart.title("/home/Desktop");
    chart.legend().position("right");
    chart.legend().itemsLayout("vertical");
    chart.sort("desc");

    // Display the chart in the container with id 'pie_graph'
    chart.container('pie_graph');
    chart.draw();

    // Return a cleanup function if needed
    return () => {
      // Perform any cleanup here if necessary
      // For instance, you might want to dispose of the chart
      chart.dispose();
    };
  }, []); // Empty dependency array means this effect runs once (on mount)

  return (
    <div id="pie_graph" style={{ width: '100%', height: '400px'} }>
     
    </div>
  );
}

export default PieGraph;
