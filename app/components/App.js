//libraries
import React from 'react';
import Paper from 'material-ui/Paper';
import { Map, TileLayer, Marker, Popup, geoJSON, GeoJSON, geoJson } from 'leaflet';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { CSVLink, CSVDownload } from 'react-csv';
//components
import DropDown from './DropDown';
//css
import css from '../styles.css';
import { debug } from 'util';
import geostats from '../../public/lib/geostats.js';
import csvData from './csvData.js';

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

const prettyLink = {
    backgroundColor: '#fffff',
    fontSize: 14,
    fontWeight: 100,
    height: 52,
    padding: '5 5',
    borderRadius: 1,
    color: '#000'
};

const county_csv_headers = ['County Name', 'Workers in Commuting Flow'];


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
        var arr = [];
        var newSelected = this.state.selectedOption;
        var inbound = document.getElementById('inbound');
        var outbound = document.getElementById('outbound');
        var intervalBreak;
        var firstBreak;
        var secondBreak;
        var thirdBreak;
        var fourthBreak;
        var fifthBreak;
        var selected_county_csv;

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmV0b2NvbG9uMjMiLCJhIjoiY2pmMWNuY2g1MDdtaDJ5bG44aGFoNmdlZCJ9.L_4W1fZnk7hMCwmS71Lg1w', {
            id: 'mapbox.light',
        }).addTo(map);

        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        }

        function getColor(d) {
            return d > 1000 ? '#994d00' :
                d > 500 ? '#cc6600' :
                    d > 100 ? '#ff8000' :
                        d > 10 ? '#ff9933' :
                            '#ffbf80';
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
                    this._div.innerHTML = (props ?
                        '<h4>' + props.Municipio + '</h4>'
                        : 'Click over a county');

                    function csvCountyData() {
                        var selected_county_csv = county_outbound
                        console.log(selected_county_csv);
                        return [
                            selected_county_csv
                        ]
                        console.log(selected_county_csv);
                    }
                    csvCountyData();
                }
                else {
                    county_inbound = county_data.features.map(function (feature) {
                        if (feature.properties['County Code Place of Work'] === props.geo_id) {
                            return [feature.properties['County Name'].trim(), feature.properties['Workers in Commuting Flow']];
                        }
                    });
                    county_inbound = county_inbound.filter(Boolean);
                    this._div.innerHTML = (props ?
                        '<h4>' + props.Municipio + '</h4>'
                        : 'Click over a county');

                    function csvCountyData() {
                        var selected_county_csv = county_inbound
                        console.log(selected_county_csv);
                        return [
                            selected_county_csv
                        ]
                        console.log(selected_county_csv);
                    }
                    csvCountyData();
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

        function setJenks(arr) {
            function nl2br(str, is_xhtml) {
                var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
                return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            }

            var serie = new geostats();
            serie.setSerie(arr);
            var intervalAmount = arr.length >= 5 ? 5 : arr.length;
            intervalBreak = serie.getClassJenks(intervalAmount);
            var str = '<strong>Classification Method : <\/strong>' + serie.method + " :\n";
            str += '<div class="classes">';
            var ranges = serie.ranges;
            for (var i = 0; i < ranges.length; i++) {
                str += ranges[i] + "\n";
            }
            str += '<\/div>';

            // document.write('<p>' + nl2br(serie.info()) + '<\/p>');
            // document.write('<p>' + nl2br(str) + '<\/p>');
            // console.log(intervalBreak);
            firstBreak = intervalBreak[0];
            secondBreak = intervalBreak[1];
            thirdBreak = intervalBreak[2];
            fourthBreak = intervalBreak[3];
            fifthBreak = intervalBreak[4];

            console.log(ranges);
            console.log(intervalBreak);
            // console.log(nl2br(str));

            function getColor(d) {
                return d > fifthBreak ? '#994d00' :
                    d > fourthBreak ? '#cc6600' :
                        d > thirdBreak ? '#ff8000' :
                            d > secondBreak ? '#ff9933' :
                                '#ffbf80';
            }
    
            var legend = L.control({ position: 'bottomright' });
            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [firstBreak, secondBreak, thirdBreak, fourthBreak, fifthBreak],
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
        

        function clickedFeature(e) {
            var layer = e.target;
            info.update(layer.feature.properties);

            if (outbound.checked) {
                for (var key in map._layers) {
                    for (var i = 0; i < county_outbound.length; i++) {
                        if (map._layers[key].feature && map._layers[key].feature.properties.Municipio === county_outbound[i][0]) {
                            arr.push(Number(county_outbound[i][1]));
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
                        weight: 3,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.7
                    });

                }
                setJenks(arr);
            }
            else if (inbound.checked) {
                for (var key in map._layers) {
                    for (var i = 0; i < county_inbound.length; i++) {
                        if (map._layers[key].feature && map._layers[key].feature.properties.Municipio === county_inbound[i][0]) {
                            arr.push(Number(county_inbound[i][1]));
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
                        weight: 3,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.7
                    });
                }
                setJenks(arr);
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
                        {/* <DropDown
                            className={"drop-down"}
                            onChange={this.handleChangeMunicipio}
                            selected={this.state.selected}
                            geoJsonFeature={geoJsonFeature}
                            county={county_data}
                        /> */}
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
                        <div className={"csv-class"}>
                            <div className={'csv-link'}>
                                <CSVLink data={csvData()} style={prettyLink} filename={"map-data.csv"}>Download Map CSV ⬇ </CSVLink>
                            </div>
                            <div className={'csv-link'}>
                                <CSVLink data={csvData()} headers={county_csv_headers} style={prettyLink} filename={"county-data.csv"}>Download Selected County CSV ⬇</CSVLink>
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

