import * as React from "react";
import data from "../companies.json";
import Select from "react-select";
import { Bars } from  'react-loader-spinner'

const types = [
  {
    value: 1,
    label: "Minimum Risk Portfolio",
  },
  {
    value: 2,
    label: "Maximum Return Portfolio",
  },
  {
    value: 3,
    label: "Optimal Portfolio",
  },
];

const Home = () => {
  const [noOfComp, setNoOfComp] = React.useState(1);
  const [stage, setStage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedComp, setSelectedComp] = React.useState(
    Array(noOfComp).fill("")
  );
  const [selectedType, setSelectedType] = React.useState(types[0]);
  const [portfolio, setPortfolio] = React.useState('');

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor : state.isFocused ? 'lightgreen' : 'white',
      color: 'black',
      '&:active' : {
        backgroundColor: "#198754"
      }
    }),
    control: provided => ({
      ...provided,
      color: 'black',
    }),
    singleValue: provided => ({
      ...provided,
      color: 'black'
    })
  }

  const handleSubmit1 = (e) => {
    e.preventDefault();
    setStage(stage + 1);
  };
  const handleBack = (e) => {
    e.preventDefault();
    setStage(stage-1);
  }
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
        setPortfolio(json.portfolio);
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
      <div class="form-group">
      {stage === 1 && (
        <div className="stage1">
          <form onSubmit={(e) => handleSubmit1(e)}>
            <input class="form-control"
              type="number" 
              value={noOfComp}
              placeholder="Enter number of stocks "
              onChange={(e) => setNoOfComp(e.target.value)}
            />
            <br />
            <button className={`text-capitalize btn btn-success btn-lg"`} type="submit">Next</button>
          </form>
        </div>
      )}
      {stage === 2 && (
        <div class="form-group">
          <form onSubmit={(e) => handleSubmit1(e)}>
            <h3>Choose the stocks you want to invest in</h3>
            {Array.from({ length: noOfComp }, (_, index) => (
              <div>
                <Select
                  key={index}
                  styles={customStyles}
                  class="form-control"
                  value={selectedComp[index]}
                  onChange={(event) => handleDropdownChange(index, event)}
                  isSearchable
                  options={data}
                  placeholder={`Choose stock ${index+1} `}
                />
                <br />
                <br />
              </div>
            ))}
            <button className={`text-capitalize btn btn-success btn-lg"`} type="button" onClick={handleBack}>Back</button>
            <button className={`text-capitalize btn btn-success btn-lg"`} type="submit">Next</button>
          </form>
        </div>
      )}
      {stage === 3 && (
        <div class="form-group">
          <form onSubmit={handleSubmit}>
            <h4>Choose the type of Portfolio</h4><br/>
            <Select styles={customStyles}
            class="form-control success"
              value={selectedType}
              onChange={(event) => {
                setSelectedType(event);
              }}
              options={types}
            /><br />
            <button className={`text-capitalize btn btn-success btn-lg"`} type="button" onClick={handleBack}>Back</button>
            <button className={`text-capitalize btn btn-success btn-lg"`} type="submit">Submit</button>
          </form>
        </div>
      )}
      {stage===4 && (
        <div>
          <h4>Return : {(portfolio['Returns'] *100).toFixed(2)}%</h4>
          <h4>Risk : {(portfolio['Volatility']*100).toFixed(2)}%</h4> <br />
          <ul class="list-group">
          {selectedComp.map(comp => (
            <li class="list-group-item list-group-item-success" key={comp.value}>
              <strong>{comp.label} : </strong>{(portfolio[comp.value] * 100).toFixed(2)}%
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
