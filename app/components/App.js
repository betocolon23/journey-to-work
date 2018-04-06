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
const geoJsonFeature = require('./geoJsonData.json')
const county_data = require('./county-data')

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "selected": []
        }
        
        console.log(county_data.features[0].properties['County Name']);
        console.log(geoJsonFeature.features[0].properties['geo_id'])
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
                var municipality_county_data = county_data.features.filter(function(data) {
                    return data.properties['County Code Residence'] === props.geo_id;
                })

                console.log(municipality_county_data);

                this._div.innerHTML = '<h4>Puerto Rico Journey to Work Map</h4>' + (props ?
                    '<b>' + props.Municipio + '</b><br />' + ' inbound / outbout '
                    : 'Hover over a county');
                
            }

        };

        info.addTo(map);

        // get color depending on population density value
        function getColor(d) {
            return d > 1000 ? '#800026' :
                d > 500 ? '#BD0026' :
                    d > 200 ? '#E31A1C' :
                        d > 100 ? '#FC4E2A' :
                            d > 50 ? '#FD8D3C' :
                                d > 20 ? '#FEB24C' :
                                    d > 10 ? '#FED976' :
                                        '#FFEDA0';
        }

        function style(feature) {
            return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: getColor(feature.properties.density)
            };
        }

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            info.update(layer.feature.properties);
        }

        var geojson;

        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }

        geojson = L.geoJson(geoJsonFeature, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


        // var legend = L.control({ position: 'bottomright' });

        // legend.onAdd = function (map) {

        //     var div = L.DomUtil.create('div', 'info legend'),
        //         grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        //         labels = [],
        //         from, to;

        //     for (var i = 0; i < grades.length; i++) {
        //         from = grades[i];
        //         to = grades[i + 1];

        //         labels.push(
        //             '<i style="background:' + getColor(from + 1) + '"></i> ' +
        //             from + (to ? '&ndash;' + to : '+'));
        //     }

        //     div.innerHTML = labels.join('<br>');
        //     return div;
        // };

        // legend.addTo(map);

        // this.setState({
        //     selected: county_data.features.properties['County Name'],
        // });
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