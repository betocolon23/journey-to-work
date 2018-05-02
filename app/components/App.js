//libraries
import React from 'react';
import Paper from 'material-ui/Paper';
import { Map, TileLayer, Marker, Popup, geoJSON, GeoJSON, geoJson } from 'leaflet';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
//components
import DropDown from './DropDown';
//css
import css from '../styles.css';
import { ImagePictureAsPdf } from 'material-ui';
import { debug } from 'util';

//data
const geoJsonFeature = require('./geoJsonData.json')
const county_data = require('./county-data')

const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
    },
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "selected": [],
            selectedOption: 'outbound'
        }
        this.handleChangeMunicipio = this.handleChangeMunicipio.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    componentDidMount() {
        var map = L.map('map').setView([18.2208, -66.3500], 9);
        var county_inbound;
        var county_outbound;
        var geojson;
        var newSelected = this.state.selectedOption;
        var inbound = document.getElementById('inbound');
        var outbound = document.getElementById('outbound');


        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmV0b2NvbG9uMjMiLCJhIjoiY2pmMWNuY2g1MDdtaDJ5bG44aGFoNmdlZCJ9.L_4W1fZnk7hMCwmS71Lg1w', {
            id: 'mapbox.light',
        }).addTo(map);

        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        }

        info.update = function (props) {
            if (props) {
                if (outbound.checked) {
                    county_outbound = county_data.features.map(function (feature) {
                        if (feature.properties['County Code Residence'] === props.geo_id) {
                            return [feature.properties['County Name_1'].trim(), feature.properties['Workers in Commuting Flow']];
                        }
                    });
                    county_outbound = county_outbound.filter(Boolean);
                    console.log(county_outbound);
                    this._div.innerHTML = '<h3>Puerto Rico Journey to Work Map</h3>' + (props ?
                        '<h4>' + props.Municipio + '</h4>' + '</br>' + '<div>' + county_outbound + '</div>' + '</br>'
                        : 'Click over a county');
                }
                else {
                    county_inbound = county_data.features.map(function (feature) {
                        if (feature.properties['County Code Place of Work'] === props.geo_id) {
                            return [feature.properties['County Name'].trim(), feature.properties['Workers in Commuting Flow']];
                        }
                    });
                    county_inbound = county_inbound.filter(Boolean);
                    console.log(county_inbound);
                    this._div.innerHTML = '<h3>Puerto Rico Journey to Work Map</h3>' + (props ?
                        '<h4>' + props.Municipio + '</h4>' + '</br>' + '<div>' + county_inbound + '</div>' + '</br>'
                        : 'Click over a county');
                }
            }
        };
        info.addTo(map);

        function featureStyle(feature) {
            return {
                fillColor: '#FFEDA0',
                color: 'grey',
                opacity: 1,
                dashArray: '3',
                weight: 2
            };
        }

        function clickedFeature(e) {
            var layer = e.target;
            info.update(layer.feature.properties);
            if (outbound.checked) {
                for (var key in map._layers) {
                    for (var i = 0; i < county_outbound.length; i++) {
                        if (map._layers[key].feature && map._layers[key].feature.properties.Municipio === county_outbound[i][0]) {
                            map._layers[key].setStyle({
                                fillColor: '#FD8D3C',
                                weight: 5,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.7
                            });
                        }
                    }
                    layer.setStyle({
                        fillColor: '#BD0026',
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.7
                    });
                }
            }
            else if (inbound.checked) {
                for (var key in map._layers) {
                    for (var i = 0; i < county_inbound.length; i++) {
                        if (map._layers[key].feature && map._layers[key].feature.properties.Municipio === county_inbound[i][0]) {
                            map._layers[key].setStyle({
                                fillColor: '#FC4E2A',
                                weight: 5,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.7
                            });
                        }
                    }
                    layer.setStyle({
                        fillColor: '#800026',
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.7
                    });
                }
            }
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }

        function onEachFeature(feature, layer) {
            layer.on({
                click: clickedFeature
            });
        }

        geojson = L.geoJson(geoJsonFeature, {
            style: featureStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

        map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census</a>');
    }

    handleChangeMunicipio(event, index, value) {
        this.setState({ selected: value });
    }

    handleOptionChange(changeEvent) {
        this.setState({ selectedOption: changeEvent.target.value });
    }

    render() {
        console.log(this.state.selectedOption);
        return (
            <Paper>
                <div className={'full-container'}>
                    <div className={"top-container"}>
                        <DropDown
                            className={"drop-down"}
                            onChange={this.handleChangeMunicipio}
                            selected={this.state.selected}
                            geoJsonFeature={geoJsonFeature}
                            county={county_data}
                        />
                        <div className="radio-container">
                            <div className="radio">
                                <label>
                                    <input
                                        type="radio" value="outbound"
                                        checked={this.state.selectedOption === 'outbound'}
                                        onChange={this.handleOptionChange}
                                        id='outbound'
                                    />
                                    Outbound
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input
                                        type="radio" value="inbound"
                                        checked={this.state.selectedOption === 'inbound'}
                                        onChange={this.handleOptionChange}
                                        id='inbound'
                                    />
                                    Inbound
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={"bottom-container"}>
                        <div id='map'></div>
                    </div>
                </div>
            </Paper>
        )
    }
}


