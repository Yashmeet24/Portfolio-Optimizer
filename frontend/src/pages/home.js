import * as React from "react";
import data from "../companies.json";
import Select from "react-select";
import { Bars } from  'react-loader-spinner'

const types = [
  {
    value: 1,
    label: "Minimum Volatility Portfolio",
  },
  {
    value: 2,
    label: "Maximum Return Portfolio",
  },
  {
    value: 3,
    label: "Optimal Portfolio Based on Sharpe Ratio",
  },
];
const Home = () => {
  const [noOfComp, setNoOfComp] = React.useState(0);
  const [stage, setStage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedComp, setSelectedComp] = React.useState(
    Array(noOfComp).fill("")
  );
  const [selectedType, setSelectedType] = React.useState(types[0]);
  const [portfolio, setPortfolio] = React.useState('');
  // const [weights, setWeights] = React.useState('');
  const handleSubmit1 = (e) => {
    e.preventDefault();
    setStage(stage + 1);
  };
  
  const handleDropdownChange = (index, event) => {
    const updatedOptions = [...selectedComp];
    updatedOptions[index] = event;
    setSelectedComp(updatedOptions);
    // console.log(selectedComp);
  };
  const handleSubmit =async (e) => {
    e.preventDefault();
    const reqData = {
      "tickers": selectedComp.map(item => item.value),
      "option" : selectedType.value
    } 
      setIsLoading(true);
      const response = await fetch("/api/portfolio",{
        method: "POST",
        body: JSON.stringify(reqData),
        headers: {
          "Content-Type": "application/json"
        },
      })
      const json = await response.json();
      if(response.ok){
        // const portfolio  = json.portfolio;
        // const port = {
        //   "returns" : portfolio.Returns,
        //   "volatility" : portfolio.Volatility
        // }
        setPortfolio(json.portfolio);
        // const extractedValues = {};
        // selectedComp.map((comp) => {
        //   if(portfolio.hasOwnProperty(comp.value))
        //   extractedValues[comp.label] = portfolio[comp.value]
        // })
        // setWeights(extractedValues);
        // console.log(extractedValues);
      }
      else{
        console.log(response.ok);  
      }
      setIsLoading(false);
      setStage(stage+1);
  };
  return (  
     <div className="home">
      {isLoading ? <Bars
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="bars-loading"
      wrapperStyle={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      wrapperClass=""
      visible={true}
    /> : 
      <div>
      {stage === 1 && (
        <div className="stage1">
          <form onSubmit={(e) => handleSubmit1(e)}>
            <label>Enter number of companies </label>
            <br />
            <input
              type="number"
              onChange={(e) => setNoOfComp(e.target.value)}
            />
            <br />
            <button type="submit">Next</button>
          </form>
        </div>
      )}
      {stage === 2 && (
        <div>
          <form onSubmit={(e) => handleSubmit1(e)}>
            <h3>Choose the companies you want to invest in</h3>
            {Array.from({ length: noOfComp }, (_, index) => (
              <div>
                <Select
                  key={index}
                  value={selectedComp[index]}
                  onChange={(event) => handleDropdownChange(index, event)}
                  isSearchable
                  options={data}
                />
                <br />
                <br />
              </div>
            ))}
            <button type="submit">Next</button>
          </form>
        </div>
      )}
      {stage === 3 && (
        <div>
          <form onSubmit={handleSubmit}>
            <h3>Choose the type of Portfolio</h3>
            <Select
              value={selectedType}
              onChange={(event) => {
                setSelectedType(event);
              }}
              options={types}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      {stage===4 && (
        <div>
          <h3> Portfolio</h3>
          <h4>Return : {(portfolio['Returns'] *100).toFixed(2)}%</h4>
          <h4>Volatility : {(portfolio['Volatility']*100).toFixed(2)}%</h4>
          <ul>
          {selectedComp.map(comp => (
            <li key={comp.value}>
              <strong>{comp.label}:</strong>{(portfolio[comp.value] * 100).toFixed(2)}%
            </li>
          ))}
          </ul>
          </div>
      )}
      </div>}
    </div>
  );
};

export default Home;
