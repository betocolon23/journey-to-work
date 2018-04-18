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

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmV0b2NvbG9uMjMiLCJhIjoiY2pmMWNuY2g1MDdtaDJ5bG44aGFoNmdlZCJ9.L_4W1fZnk7hMCwmS71Lg1w', {
            id: 'mapbox.light',
        }).addTo(map);

        //control that show state info on hover
        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        }

        info.update = function (props) {
            // console.log(props);
            if (props) {
                county_names = county_data.features.map(function (feature) {
                    if (feature.properties['County Code Residence'] === props.geo_id) {
                        return [feature.properties['County Name_1'].trim(), feature.properties['Workers in Commuting Flow']];
                        //Add Workers Commuting Flow
                    }
                });
                county_names = county_names.filter(Boolean);
                // console.log('county names: ', county_names.filter(Boolean));
            }
            this._div.innerHTML = '<h3>Puerto Rico Journey to Work Map</h3>' + (props ?
                '<h4>' + props.Municipio + '</h4>' + '</br>' + county_names + '</br>'
                : 'Hover over a county');
        };
        info.addTo(map);

        //Add Feature Style
        function featureStyle(feature) {
            return {
                fillColor: 'blue',
                color: 'grey',
                opacity: 1,
                dashArray: '3',
                weight: 2
            };
        }

        //Highlight Each Feature 
        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                fillColor: 'red',
                weight: 5,
                color: 'gray',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
            info.update(layer.feature.properties);
            // layer.bindPopup("Workers in Commuting Flow:" + "<div>Inbound to County</div>" + county_names + '</br>');
        }

        var geojson;

        //Reset Higlight
        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

        //Color Clicked Municipio
        function clickedFeature(e) {
            var layer = e.target;

            layer.setStyle({
                fillColor: 'green',
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            info.update(layer.feature.properties)

            // layer.bindPopup("Workers in Commuting Flow:" + "<div>Inbound to County</div>" + county_names + '</br>');
        }

        //On Each Feature apply following function: 
        function onEachFeature(feature, layer) {
            var selected;
            layer.on({
                // click: clickedFeature,
                mouseover: highlightFeature,
                mouseout: resetHighlight
            });
        }

        //Add GeoJson to Map and add Attribution
        geojson = L.geoJson(geoJsonFeature, {
            style: featureStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

        map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census</a>');

        console.log(county_names);
    }

    //Para el dropdown list de geoJsonFeature - Sacarlos del GEOJSON
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


