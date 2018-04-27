//libraries
import React from 'react';
import Paper from 'material-ui/Paper';
import { Map, TileLayer, Marker, Popup, geoJSON, GeoJSON, geoJson } from 'leaflet';
//components
import DropDown from './DropDown';
//css
import css from '../styles.css';
import { ImagePictureAsPdf } from 'material-ui';
import { debug } from 'util';

//data
const geoJsonFeature = require('./geoJsonData.json')
const county_data = require('./county-data')

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "selected": []
        }
        this.handleChangeMunicipio.bind(this);
    }

    componentDidMount() {
        var map = L.map('map').setView([18.2208, -66.3500], 9);
        var county_names;
        var geojson;

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
                county_names = county_data.features.map(function (feature) {
                    if (feature.properties['County Code Residence'] === props.geo_id) {
                        return [feature.properties['County Name_1'].trim(), feature.properties['Workers in Commuting Flow']];
                    }
                });
                county_names = county_names.filter(Boolean);
            }
            this._div.innerHTML = '<h3>Puerto Rico Journey to Work Map</h3>' + (props ?
                '<h4>' + props.Municipio + '</h4>' + '</br>' + '<div class=array-county>' + county_names + '</div>' + '</br>'
                : 'Click over a county');
        };
        info.addTo(map);

        function featureStyle(feature) {
            return {
                fillColor: 'blue',
                color: 'grey',
                opacity: 1,
                dashArray: '3',
                weight: 2
            };
        }


        function highlightFeature(e) {
            var layer = e.target;

            // layer.setStyle({
            //     fillColor: 'red',
            //     weight: 5,
            //     color: 'gray',
            //     dashArray: '',
            //     fillOpacity: 0.7
            // });

            // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            //     layer.bringToFront();
            // }
            info.update(layer.feature.properties);
        }

        function clickedFeature(e) {
            var layer = e.target;
            info.update(layer.feature.properties)
            for (var key in map._layers) {
                for (var i = 0; i < county_names.length; i++) {
                    if (map._layers[key].feature && map._layers[key].feature.properties.Municipio === county_names[i][0]) {
                        map._layers[key].setStyle({
                            fillColor: 'green',
                            weight: 5,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.7
                        });
                    }
                }
                layer.setStyle({
                    fillColor: 'blue',
                            weight: 5,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.7
                });
            }

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }

        function resetClick(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

        function onEachFeature(feature, layer) {
            layer.on({
                click: clickedFeature,
                // mouseover: highlightFeature,
                // mouseout: resetClick
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

    render() {
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
                    </div>
                    <div className={"bottom-container"}>
                        <div id="map"></div>
                    </div>
                </div>
            </Paper>
        )
    }
}


