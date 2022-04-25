import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
function App() {
  //winedata variable for storing csv data
  const [winedata,setWinedata]=useState([]);
  //converting csv data into array of objects
  const processCSV=(str,delim=',')=>{
    const headers=["Class", "Alcohol","Malic acid","Ash","Alcalinity of ash",
    "Magnesium","Total phenols","Flavanoids","Nonflavanoid phenols","Proanthocyanins","Color intensity",
    "Hue","OD280/OD315 of diluted wines","Proline"]
    const data=str.slice(0).split("\n");
    const newArray=data.map(row=>{
      const values=row.split(delim);
      const eachObject=headers.reduce((obj,header, i)=>{
        obj[header]=values[i];
        return obj;
      },{});
      return eachObject;
    })
    setWinedata(newArray);
  }
  
  //fetching data from csv file on application mount
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("winedata.csv");
      const data=await res.text();
      processCSV(data);
    }
    fetchData();
  }, []);
  
  // function for getting 2D array of two fields 
  function get2Fields(input, field1,field2) {
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push([input[i][field1],input[i][field2]]);
    return output;
  }
  // function for calculating average of field based on some condition
  function getAverage(input, field) {
    var output = [];
    var count1=0,count2=0,count3=0;
    var class1=0,class2=0,class3=0;
    for (var i=0; i < input.length ; ++i){
      if(parseInt(input[i]["Class"])===1){
        class1+=parseFloat(input[i][field]);
        count1=count1+1;
      }
      if(parseInt(input[i]["Class"])===2){
        class2+=parseFloat(input[i][field]);
        count2=count2+1;
      }
      if(parseInt(input[i]["Class"])===3){
        class3+=parseFloat(input[i][field]);
        count3=count3+1;
      }
    }
        output.push(class1/count1);
        output.push(class2/count2);
        output.push(class3/count3);
    return output;
  }
  
  const options1 = {
    grid: { top: 50, right: 100, bottom: 30, left: 55 },
    title:{
      text: "Hue Vs Color Intensity",
      padding: [1,50],
    },
    xAxis: {
      name:"Color Intensity",
      type: 'value',
    },
    yAxis: {
      name:"Hue",
      type: 'value',
    },
    series: [
      {
        data: get2Fields(winedata,"Color intensity","Hue"),
        type: 'scatter',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    
  };
  const options2 = {
    grid: { top: 50, right: 90, bottom: 30, left: 55 },
    title:{
      text: "Malic Acid Average Vs Alcohol Type",
      padding: [1,50]
    },
    xAxis: {
      name:"Alcohol Type",
      type: 'category',
      data: ["Class1","Class2","Class3"],
      
    },
    
    yAxis: {
      name: "Malic Acid(In Avg)",
      type: 'value',
      
    },
    series: [
      {
        name: "Average Of Malic Acid",
        data: getAverage(winedata,"Malic acid"),
        type: 'bar',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };
  return <div className="grid-container">
    <header >
    <h1>Graphs</h1>
    </header>

    <main>
    <div className="App">
      <div className="child">
        <ReactECharts option={options1} style={{width:"45rem",height:"45rem"}}/>
      </div>
      <div className="child">
        <ReactECharts option={options2} style={{width:"45rem",height:"45rem"}}/>
      </div>
    </div>
    </main>

    <footer>
    </footer>
  </div>
   
}

export default App;
