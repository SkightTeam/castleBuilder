import './App.css';

import React, { Component } from 'react';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory';
import { buildCastles, filterNumbers } from './code';


class App extends Component {
    constructor() {
        super();
        this.state = {
            terrainArray: '',
            data: [],
            castles: null
        };
    }

    render() {
        console.log('state', this.state);

        const { castles, data, terrainArray } = this.state;
        const chartData = this._getChartData(data);

        let displayCastles = null;
        if (castles && castles.length) {
            displayCastles = <h3>{castles.length + ' castles can be built: ' + castles.join(', ')}</h3>;
        }

        if (castles && !castles.length) {
            displayCastles = <h3>0 castles can be built</h3>;
        }

        return (
            <div className="App">
                <div className="App-header">

                    <h2>Welcome to Castle Builder</h2>
                    <h3>Enter comma separated numbers and submit</h3>
                </div>
                <p className="App-intro">
                    <input
                        className="terrainInput"
                        type="text"
                        placeholder="2, 2, 2, 1, 4, 0, 5 etc..."
                        value={this.cleanInput(terrainArray)}
                        onChange={this._handleNameChange.bind(this)}
                    />

                </p>
                <button onClick={this._handleButtonClick.bind(this)}>submit values</button>
                {displayCastles}
                <div className="chartContainer">
                    <VictoryChart
                        domainPadding={20}
                        scale={{ x: 'linear', y: 'linear' }}
                        theme={VictoryTheme.material}
                        padding={50}
                        width={300}
                        height={200}>
                        <VictoryLine
                            style={{ data: { stroke: 'orange' } }}
                            data={chartData}
                            y={datum => datum.num}
                            labels={datum => datum.num}
                        />
                    </VictoryChart>
                </div>
            </div>
        );
    }

    _handleNameChange(event) {
        this.setState({ terrainArray: event.target.value });
    }

    _handleButtonClick() {
        const { terrainArray } = this.state;
        if (!terrainArray) {
            this.setState({ data: [], castles: null });
            return false;
        }
        const inputArray = this.trim(terrainArray).split(',');
        const filteredInputArray = filterNumbers(inputArray);
        const castles = buildCastles(inputArray);
        const filteredCastles = filterNumbers(castles);
        this.setState({ data: filteredInputArray, castles: filteredCastles });
    }

    _getChartData(data) {
        return data.map((number, index, array) => {
            return { num: Number(number) };
        });
    }

    trim(str) {
        // Commas and numbers only
        str = str.replace(/[^\d,]+/g, '');
        return str;
    }

    cleanInput(terrainArray) {
        return filterNumbers(this.trim(terrainArray).split(',')).join(',');
    }
}

export default App;
