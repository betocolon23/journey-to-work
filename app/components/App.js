//libraries
import React from 'react';
import Paper from 'material-ui/Paper';
import { Map, TileLayer, Marker, Popup } from 'leaflet';
import Municipios from './municipio-data';
import Feature from './county-data';


//components
import DropDown from './DropDown';
import RadioComponent from './RadioComponent';
import MapComponent from './MapComponent';


//css
import css from '../styles.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        // console.log(Municipios);
        console.log(Feature);
        this.state = {
            "data": {
                features: []
            },
            "selected": []
        }
        this.handleChangeMunicipio = this.handleChangeMunicipio.bind(this);
    }

    handleChangeMunicipio(event, index, value) {
        this.setState({ selected: value });
    }

    render() {
        return (
            <Paper>
                <div className={'full-container'}> 
                    <div className={"top-container"}>
                        <DropDown 
                            className={"drop-down"}
                            onChange={this.handleChangeMunicipio}
                            selected={this.state.selected}
                        />
                        <RadioComponent 
                            className={"radio-component"}
                        />
                    </div>
                    <div className={"bottom-container"}>
                        <MapComponent />
                    </div>
                </div>
            </Paper>
        )
    }
}