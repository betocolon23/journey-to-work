//libraries
import React from 'react';
import Paper from 'material-ui/Paper';
import { Map, TileLayer, Marker, Popup, geoJSON, GeoJSON, geoJson } from 'leaflet';
//components
import DropDown from './DropDown';
import RadioComponent from './RadioComponent';
//css
import css from '../styles.css';
//data
import Feature from './county-data';
const data = require('./municipioData.json')

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "selected": "Feature"
        }
        console.log()
        this.handleChangeMunicipio = this.handleChangeMunicipio.bind(this);
    }

    componentDidMount() {
        console.log(data);        

        var map = L.map('map').setView([18.2208, -66.5901], 9);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmV0b2NvbG9uMjMiLCJhIjoiY2pmMWNuY2g1MDdtaDJ5bG44aGFoNmdlZCJ9.L_4W1fZnk7hMCwmS71Lg1w', {
            id: 'mapbox.light',
        }).addTo(map);

        // function getColor(d) {
        //     return d > 1000 ? '#800026' :
        //         d > 500 ? '#BD0026' :
        //             d > 200 ? '#E31A1C' :
        //                 d > 100 ? '#FC4E2A' :
        //                     d > 50 ? '#FD8D3C' :
        //                         d > 20 ? '#FEB24C' :
        //                             d > 10 ? '#FED976' :
        //                                 '#FFEDA0';
        // }
    
        function style(feature) {
            return {
                fillColor: this.getColor(feature.properties.area),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        L.geoJson(data).addTo(map);
    }

    //Para el dropdown list de municipios - Sacarlos del GEOJSON
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
                        <div id="map"></div>
                    </div>
                </div>
            </Paper>
        )
    }
}