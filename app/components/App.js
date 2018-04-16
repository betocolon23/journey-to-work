//libraries
import React from 'react';
import Paper from 'material-ui/Paper';
import { Map, TileLayer, Marker, Popup, geoJSON, GeoJSON, geoJson } from 'leaflet';
//components
import DropDown from './DropDown';
//css
import css from '../styles.css';
import { ImagePictureAsPdf } from 'material-ui';

//data
const geoJsonFeature = require('./geoJsonData.json')
const county_data = require('./county-data')

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "selected": []
        }

        // console.log(county_data.features[0].properties['County Name']);
        // console.log(geoJsonFeature.features[0].properties['geo_id'])
        this.handleChangeMunicipio.bind(this);
    }

    componentDidMount() {
        var map = L.map('map').setView([18.2208, -66.3500], 9);

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
            console.log(props);
            if (props) {
                // var municipality_county_data = county_data.features.filter(function (data) {
                //     return data.properties['County Code Residence'] === props.geo_id;
                // })
                var county_names = county_data.features.map(function (data) {
                    if (data.properties['County Code Residence'] === props.geo_id) {
                        return data.properties['County Name_1'].trim();
                    }
                })

                // console.log(municipality_county_data);
                console.log('county names: ', county_names.filter(Boolean));
                this._div.innerHTML = '<h3>Puerto Rico Journey to Work Map</h3>' + (props ?
                    '<h4>' + props.Municipio + '</h4>' + '</h4>' + 'inbound / outbound' + '</h4>'
                    : 'Hover over a county');
            }
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
        }

        var geojson;

        //Reset Higlight
        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

        // var county_name = county_data.features.filter(function (data) {

        //     // trim() elimina el/los ultimos espacios en un string
        //     return data.properties['County Name'].trim() === 'Culebra';
        // });

        // var county_names = county_data.features.map(function (data) {
        //     if (data.properties['County Code Residence'] === props.geo_id) {
        //         return data.properties['County Name'].trim();
        //     }
        // });
        
        // console.log('COUNTY NAMES: ', county_names);

        //Color Clicked Municipio
        function clickedFeature(e) {
            var layer = e.target;

            layer.setStyle({
                fillColor: 'red',
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });
            
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            info.update(layer.feature.properties)
        }

        //Reset Clicked County to original color
        function resetClicked(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

        //On Each Feature apply following function: 
        function onEachFeature(feature, layer) {
            var selected;
            layer.on({
                // click: clickedFeature,
                // click: resetClicked,
                mouseover: highlightFeature, 
                mouseout: resetHighlight 
            });
            if (feature.properties) {
                layer.bindPopup("Workers in Commuting Flow:" + " " + "<div>Inbound to County</div>");
            }
        }

        var selected;
        
        //Add GeoJson to Map and add Attribution
        geojson = L.geoJson(geoJsonFeature, {
            // Set default style
        //     'style': function () {
        //         return {
        //             'color': 'blue',
        //         }
        //     }
        // }).on('click', function (e) {
        //     var layer = e.target;
        //     if (selected) {
        //         e.target.resetStyle(selected)
        //     }
        //     selected = e.layer
        //     selected.bringToFront()
        //     selected.setStyle({
        //         'color': 'red'
        //     })
        //     debugger;

        // layer._layers = Arreglo de layers
        // Cada layer tiene un feature.properties...

        // info.update(layer._layers);
            style: featureStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

        map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census</a>');
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


