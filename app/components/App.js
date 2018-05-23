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
        var bound_array = [];
        var net_array = [];
        var net_data = [];
        var newSelected = this.state.selectedOption;
        var inbound = document.getElementById('inbound');
        var outbound = document.getElementById('outbound');
        var net = document.getElementById('net');
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

        function countyOutbound(county_data, props) {
            county_outbound = county_data.features.map(function (feature) {
                if (feature.properties['County Code Residence'] === props.geo_id) {
                    return [feature.properties['County Name_1'].trim(), feature.properties['Workers in Commuting Flow']];
                }
            });
            return county_outbound;
        }

        function countyInbound(county_data, props) {
            county_inbound = county_data.features.map(function (feature) {
                if (feature.properties['County Code Place of Work'] === props.geo_id) {
                    return [feature.properties['County Name'].trim(), feature.properties['Workers in Commuting Flow']];
                }
            });
            return county_inbound;
        }

        info.update = function (props) {
            if (props) {
                if (outbound.checked) {
                    county_outbound = countyOutbound(county_data, props)
                    county_outbound = county_outbound.filter(Boolean);
                    console.log(county_outbound);
                    this._div.innerHTML = (props ?
                        '<h4>' + props.Municipio + '</h4>'
                        : 'Click over a county');

                    function csvCountyData() {
                        var selected_county_csv = county_outbound
                        // console.log(selected_county_csv);
                        return selected_county_csv
                    }
                    csvCountyData();

                }
                else if (inbound.checked) {
                    county_inbound = countyInbound(county_data, props);
                    county_inbound = county_inbound.filter(Boolean);
                    console.log(county_inbound)
                    this._div.innerHTML = (props ?
                        '<h4>' + props.Municipio + '</h4>'
                        : 'Click over a county');

                    function csvCountyData() {
                        var selected_county_csv = county_inbound
                        // console.log(selected_county_csv);
                        return selected_county_csv
                    }
                    csvCountyData();
                }
                else {
                    county_outbound = countyOutbound(county_data, props)
                    county_outbound = county_outbound.filter(Boolean);
                    county_inbound = countyInbound(county_data, props);
                    county_inbound = county_inbound.filter(Boolean);
                    for (var i = 0; i < county_inbound.length; i++) {
                        for (var j = 0; j < county_outbound.length; j++) {                            
                            if (county_inbound[i][0] == county_outbound[j][0]) {
                                //Nombres de Municipios 
                                var net_data = [];
                                var net_total;

                                //Add Municipios to array of net_data
                                net_data.push(county_inbound[i][0]);
                                net_data.push(Number(county_inbound[i][1]));

                                //Add Commuting Flow to array of net_data
                                net_data.push(county_outbound[j][0]);
                                net_data.push(Number(county_outbound[j][1]));
                                
                                //Loop para restar inbound - outbound
                                for (var k = 0; k < net_data.length; k++) {
                                    net_total = net_data[1] - net_data[3]
                                }
                                net_data.push(net_total);
                                // console.log(net_data);

                                //Remover los valores repetidos 
                                net_array = Array.from(new Set(net_data));
                                console.log(net_array);

                            }        
                        }
                    }

                    this._div.innerHTML = (props ?
                        '<h4>' + props.Municipio + '</h4>'
                        : 'Click over a county');

                    function csvCountyData() {
                        var selected_county_csv = net_array
                        return selected_county_csv
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

        function setJenks(bound_array) {
            function nl2br(str, is_xhtml) {
                var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
                return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            }

            var serie = new geostats();
            serie.setSerie(bound_array);
            var intervalAmount = bound_array.length >= 5 ? 5 : bound_array.length;
            intervalBreak = serie.getClassJenks(intervalAmount);
            var str = '<strong>Classification Method : <\/strong>' + serie.method + " :\n";
            str += '<div class="classes">';
            var ranges = serie.ranges;
            for (var i = 0; i < ranges.length; i++) {
                str += ranges[i] + "\n";
            }
            str += '<\/div>';

            firstBreak = intervalBreak[0];
            secondBreak = intervalBreak[1];
            thirdBreak = intervalBreak[2];
            fourthBreak = intervalBreak[3];
            fifthBreak = intervalBreak[4];


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
                            bound_array.push(Number(county_outbound[i][1]));
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
                console.log(bound_array);
                setJenks(bound_array);
            }
            else if (inbound.checked) {
                for (var key in map._layers) {
                    for (var i = 0; i < county_inbound.length; i++) {
                        if (map._layers[key].feature && map._layers[key].feature.properties.Municipio === county_inbound[i][0]) {
                            bound_array.push(Number(county_inbound[i][1]));
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
                console.log(bound_array);
                setJenks(bound_array);
            }

            //Arreglar para Net values 
            else if (net.checked) {
                for (var key in map._layers) {
                    for (var i = 0; i < net_array.length; i++) {
                        if (map._layers[key].feature && map._layers[key].feature.properties.Municipio === net_array[i][0]) {
                            // net_array.push(Number(net_array[i][1]));
                            map._layers[key].setStyle({
                                fillColor: '#FC4E2A',
                                weight: 1,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.7,
                                fillColor: getColor(net_array[i][1])
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
                setJenks(net_array);
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
                            <div className="radio">
                                <label>
                                    <input
                                        type="radio" value="net"
                                        checked={this.state.selectedOption === 'net'}
                                        onChange={this.handleOptionChange}
                                        id='net'
                                    />
                                    Net
                                </label>
                            </div>
                        </div>
                        <div className={"csv-class"}>
                            <div className={'csv-link'}>
                                <CSVLink data={csvData()} style={prettyLink} filename={"map-data.csv"}>Download Map CSV ⬇ </CSVLink>
                            </div>
                            <div className={'csv-link'}>
                                {/* <CSVLink data={this.selected_county_csv} headers={county_csv_headers} style={prettyLink} filename={"county-data.csv"}>Download Selected County CSV ⬇</CSVLink> */}
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

