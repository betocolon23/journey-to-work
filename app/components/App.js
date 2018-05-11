//libraries
import React from 'react';
import Paper from 'material-ui/Paper';
import { Map, TileLayer, Marker, Popup, geoJSON, GeoJSON, geoJson } from 'leaflet';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import {geostats} from '../lib/geostats';
//components
import DropDown from './DropDown';
//css
import css from '../styles.css';
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
        

        // var a1 = Array(12, 22, 5, 8, 43, 2, 34, 12, 34, 36, 5, 21, 23, 45);
        //     serie1 = new geostats(a1);
        //     document.write('<p>geostats.max() : ' + serie1.max() + '<\/p>');

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
                    // console.log(county_outbound);

                    this._div.innerHTML = (props ?
                        '<h4>' + props.Municipio + '</h4>'
                        // county_outbound + '</div>' + '</br>'
                        : 'Click over a county');
                }
                else {
                    county_inbound = county_data.features.map(function (feature) {
                        if (feature.properties['County Code Place of Work'] === props.geo_id) {
                            return [feature.properties['County Name'].trim(), feature.properties['Workers in Commuting Flow']];
                        }
                    });
                    county_inbound = county_inbound.filter(Boolean);
                    // console.log(county_inbound);
                    this._div.innerHTML = (props ?
                        '<h4>' + props.Municipio + '</h4>'
                        //  + county_inbound + '</div>' + '</br>'
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
                            // console.log(county_outbound);
                            // console.log(Number(county_outbound[i][1]));
                            
                            map._layers[key].setStyle({
                                fillColor: '#FD8D3C',
                                weight: 1,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.7,
                                fillColor: getColor(county_outbound[i][1])
                            });
                        }
                    }
                    layer.setStyle({
                        // fillColor: '#99ccff',
                        weight: 3,
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
                            console.log(county_inbound[i][1]);
                            map._layers[key].setStyle({
                                fillColor: '#FC4E2A',
                                weight: 1,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.7,
                                fillColor: getColor(county_inbound[i][1])
                            });
                        }
                    }
                    layer.setStyle({
                        // fillColor: '#99ccff',
                        weight: 3,
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

        function resetFeature(e) {
            geojson.resetStyle(e.target);
        }

        function onEachFeature(feature, layer) {
            layer.on({
                click: clickedFeature,
                // click: resetFeature
            });
        }

        geojson = L.geoJson(geoJsonFeature, {
            style: featureStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

        map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census</a>');

        function getColor(d) {
            return d > 100000 ? '#331a00' :
                d > 35000 ? '#663300' :
                d > 7500 ? '#994d00' :
                d > 5000 ? '#cc6600' :
                d > 2500 ? '#ff8000' :
                d > 1000 ? '#ff9933' :
                d > 500 ? '#e6e6ff' :
                d > 250 ? '#ccccff' :
                d > 100 ? '#9999ff' :
                d > 10 ? '#4d4dff' :
                        '#000080';
        }

        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 100, 250, 500, 1000, 2500, 5000, 7500, 10000, 35000],
                labels = [],
                from, to;

            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' + getColor(from + 1) + '"></i> ' +
                    from + (to ? '&ndash;' + to : '+'));
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(map);
    }

    handleChangeMunicipio(event, index, value) {
        this.setState({ selected: value });
    }

    handleOptionChange(changeEvent) {
        this.setState({ selectedOption: changeEvent.target.value });
    }

    render() {
        return (
            <Paper>
                <div className={'full-container'}>
                    <div className={'title'}>Puerto Rico Journey to Work Map </div>
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

