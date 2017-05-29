import './App.css';

import React, { PureComponent } from 'react';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory';
import { buildCastles, filterNumbers } from './code';

import logo from './logo.svg';

class App extends PureComponent {
    constructor() {
        super();
        this.state = {
            terrainStringFromInput: '',
            data: [],
            castles: null
        };
    }

    render() {
        console.log('state', this.state);

        const { castles, data, terrainStringFromInput } = this.state;
        const chartData = this._getChartData(data);

        let displayCastles = <h3>Enter comma separated numbers and hit submit</h3>;
        if (castles && castles.length) {
            displayCastles = <h3>{`${castles.length} castle(s) can be built: ${castles.join(', ')}`}</h3>;
        }

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to Castle Builder</h2>
                </div>
                <div className="App-intro">
                    {displayCastles}
                    <input
                        className="terrainInput"
                        type="text"
                        placeholder="2, 2, 2, 1, 4, 0, 5 etc..."
                        value={this.trim(terrainStringFromInput)}
                        onChange={this._handleNameChange.bind(this)}
                    />

                </div>
                <button onClick={this._handleButtonClick.bind(this)}>submit</button>

                <div className="chartContainer">
                    <VictoryChart
                        domainPadding={25}
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
        this.setState({ terrainStringFromInput: event.target.value });
    }

    _handleButtonClick() {
        const { terrainStringFromInput } = this.state;
        if (!terrainStringFromInput) {
            this.setState({ data: [], castles: null });
            return false;
        }
        const inputArray = this.trim(terrainStringFromInput).split(',');
        const filteredInputArray = filterNumbers(inputArray);

        // This is where the magic happens with "buildCastles()"
        const castles = buildCastles(inputArray);
        const filteredCastles = filterNumbers(castles);
        this.setState({ data: filteredInputArray, castles: filteredCastles });
    }

    // Format data in the way Victory js wants it
    _getChartData(data) {
        return data.map(number => {
            return { num: Number(number) };
        });
    }

    trim(string) {
        // Commas and numbers only
        string = string.replace(/[^\d,]+/g, '');
        return string;
    }
}

export default App;
