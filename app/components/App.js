import React from 'react';
import Paper from 'material-ui/Paper';
import { Map, TileLayer, Marker, Popup, geoJSON, GeoJSON, geoJson } from 'leaflet';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { CSVLink, CSVDownload } from 'react-csv';
import DropDown from './DropDown';
import css from '../styles.css';
import { debug } from 'util';
import geostats from '../../public/lib/geostats.js';
import csvData from './csvData.js';

//data
const geoJsonFeature = require('./geoJsonData.json')
const county_data = require('./county-data')
var clickedFeature;
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

/* MAP VARS */
var map, county_inbound, county_outbound, newSelected, geojson;
var [bound_array, net_array, absolute_net, net_data, inbound_calculation, inbound_sumatory] = [[], [], [], [], [], 0];
var municipio_name, intervalBreak, firstBreak, secondBreak, thirdBreak, fourthBreak, fifthBreak, legend, info;
var mixed_array = [];
var inbound = document.getElementById('inbound');
var outbound = document.getElementById('outbound');
var net = document.getElementById('net');
/* end map vars*/

const county_csv_headers = ['County Name', 'Workers in Commuting Flow'];
var selected_county_csv = [[]];

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "selected": [],
            municipios: geoJsonFeature.features.map(feature => feature.properties.Municipio).sort(),
            selectedOption: 'outbound',
            selected_county_csv: [[]]
        }
        this.handleChangeMunicipio = this.handleChangeMunicipio.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    componentDidMount() {
        let app = this;
        map = L.map('map').setView([18.2208, -66.3500], 9);
        newSelected = this.state.selectedOption;
        inbound = document.getElementById('inbound');
        outbound = document.getElementById('outbound');
        net = document.getElementById('net');

        // console.log(geoJsonFeature.features);
        // console.log(this.state.municipios);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmV0b2NvbG9uMjMiLCJhIjoiY2pmMWNuY2g1MDdtaDJ5bG44aGFoNmdlZCJ9.L_4W1fZnk7hMCwmS71Lg1w', {
            id: 'mapbox.light',
        }).addTo(map);
        info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        }

        function getOutboundColor(d) {
            return d > 1000 ? '#994d00' :
                d > 500 ? '#cc6600' :
                    d > 100 ? '#ff8000' :
                        d > 10 ? '#ff9933' :
                            '#ffbf80';
        }

        function getInboundColor(d) {
            return d > 1000 ? '#004d00' :
                d > 500 ? '#008000' :
                    d > 100 ? '#00cc00' :
                        d > 10 ? '#00ff00' :
                            '#80ff80';
        }

        function getNetColor(d) {
            return  d > 1000 ? '#cc6600' :
                d > 500 ? '#ff8000' :
                    d > 100 ? '#ffffb3' :
                        d > 10 ? '#80ff80' :
                                    '#00ff00';
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

        info.update = (props) => {
            if (props) {
                if (outbound.checked) {
                    county_outbound = countyOutbound(county_data, props)
                    county_outbound = county_outbound.filter(Boolean);
                    console.log(county_outbound);
                    info._div.innerHTML = (props ?
                        '<h4>' + 'Outbound: ' + props.Municipio + '</h4>'
                        : 'Click over a county');

                    csvCountyData(county_outbound);

                }
                else if (inbound.checked) {
                    county_inbound = countyInbound(county_data, props);
                    county_inbound = county_inbound.filter(Boolean);
                    console.log(county_inbound)
                    info._div.innerHTML = (props ?
                        '<h4>' + 'Inbound: ' + props.Municipio + '</h4>'
                        : 'Click over a county');

                    csvCountyData(county_inbound);
                }
                else {
                    county_outbound = countyOutbound(county_data, props)
                    county_outbound = county_outbound.filter(Boolean);
                    county_inbound = countyInbound(county_data, props);
                    county_inbound = county_inbound.filter(Boolean);
                    for (var i = 0; i < county_inbound.length; i++) {
                        for (var j = 0; j < county_outbound.length; j++) {

                        Array.prototype.diff = function(a) {
                            return this.filter(function(i) {return a.indexOf(i) < 0;});
                        };

                        // var dif1 = county_inbound.diff(county_outbound);  
                        // console.log(dif1); // => [1, 2, 6]


                        // console.log(mixed_array);
                        
                        
                        for (var x = 0; x < mixed_array.length; x++) {
                            // if (mixed_array[x][0] === mixed_array[0]) {
                                var resta;
                                Number(mixed_array[x][1]);
                                // console.log(Number(mixed_array[x][1]));
                                resta = mixed_array[x][1] - mixed_array[x][1];
                                // console.log(resta);
                                // }  
                            }
                            
                            if (county_inbound[i][0] == county_outbound[j][0]) {
                                //Array de county_inbound y county_outbound juntos 
                                var net_data = [];
                                
                                // console.log(county_outbound);
                                // console.log(county_inbound)
                                //Variable para hacer el calculo de la resta de inbound y outbound
                                var net_total;
                                
                                //Add county_inbound Municipio and commuting flow to Array net_data esto crea un array de inbound solamente 
                                net_data.push(county_inbound[i][0]);
                                net_data.push(Number(county_inbound[i][1]));
                                
                                // Calculate Inbound Sumatory suma todos los valores del inbound 
                                var get_inbound_selected;
                                get_inbound_selected = (Number(county_inbound[i][1]));
                                
                                //inbound array para caluclar sumatoria 
                                inbound_calculation.push(get_inbound_selected);
                                
                                //Inbound Sumatory para pasarla al mapa 
                                inbound_sumatory = inbound_calculation.reduce(add, 0);
                                function add(a, b) {
                                    return a + b
                                }
                                
                                //Add county_outbound Municipio and coummuting flow to Array net_data
                                net_data.push(county_outbound[j][0]);
                                net_data.push(Number(county_outbound[j][1]));
                                
                                //Loop para restar inbound - outbound
                                for (var k = 0; k < net_data.length; k++) {
                                    net_total = net_data[1] - net_data[3]
                                }
                                
                                //Add net_total to each array 
                                net_data.push(net_total);
                                
                                //Remover los valores repetidos en net_data y pasarlos a net array
                                net_data = Array.from(new Set(net_data));
                                // console.log(net_data);
                                
                                //Check Shortest Array 
                                var clicked_element;
                                for (var z = 0; z < net_data.length; z++) {
                                    if (net_data.length == 3) {
                                        clicked_element = net_data[1]
                                        net_data.push(clicked_element);
                                    }
                                }
                                
                                net_data.splice(1, 1);
                                net_data.splice(1, 1);
                                
                                //Net Array Global
                                net_array.push(net_data);
                            }
                            //Find function comprar arreglos si esta undefinded no esta los que estan se añaden al array    
                        }
                    }
                    mixed_array = county_inbound.concat(county_outbound);

                    console.log(mixed_array);
                    
                    
                    var result = mixed_array.shift().reduce(function(res, v) {
                            if (res.indexOf(v) === -1 && mixed_array.every(function(a) {
                                    return a.indexOf(v) !== -1;
                                })) res.push(v);
                                return res;
                            }, []);
                            
                            console.log(result);
                            
                            
                            

                    municipio_name = props.Municipio;
                    info._div.innerHTML = (props ?
                        '<h4>' + 'Net: ' + props.Municipio + '</h4>'
                        : 'Click over a county');
                    console.log(net_array)
                    csvCountyData(net_array);
                }
            }
        };
        info.addTo(map);

        function csvCountyData(data) {
            // console.log("Set data");
            selected_county_csv = data;
            app.setState({ selected_county_csv: data });
        };

        function featureStyle(feature) {
            return {
                fillColor: '#F1EDDF',
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


            function getOutboundColor(d) {
                return d > fifthBreak ? '#994d00' :
                    d > fourthBreak ? '#cc6600' :
                        d > thirdBreak ? '#ff8000' :
                            d > secondBreak ? '#ff9933' :
                                '#ffbf80';
            }

            function getInboundColor(d) {
                return d > fifthBreak ? '#004d00' :
                    d > fourthBreak ? '#008000' :
                        d > thirdBreak ? '#00cc00' :
                            d > secondBreak ? '#00ff00' :
                                '#80ff80';
            }

            function getNetColor(d) {
                return d > fifthBreak ? '#cc6600' :
                d > fourthBreak ? '#ff8000' :
                        d > thirdBreak ? '#ffffb3' :
                            d > secondBreak ? '#80ff80' :
                                '#00ff00';
            }

            legend = L.control({ position: 'bottomright' });

            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [firstBreak, secondBreak, thirdBreak, fourthBreak, fifthBreak],
                    labels = ['<strong>Commuting by County</strong>'],
                    from, to;

                for (var i = 0; i < grades.length; i++) {
                    from = grades[i];
                    to = grades[i + 1];
                    if (outbound.checked) {
                        labels.push(
                            '<i style="background:' + getOutboundColor(from + 1) + '"></i> ' +
                            from + (to ? '&ndash;' + to : '+'));
                    }
                    else if (inbound.checked) {
                        labels.push(
                            '<i style="background:' + getInboundColor(from + 1) + '"></i> ' +
                            from + (to ? '&ndash;' + to : '+'));
                    }
                    else if (net.checked) {
                        labels.push(
                            '<i style="background:' + getNetColor(from + 1) + '"></i> ' +
                            from + (to ? '&ndash;' + to : '+'));
                    }
                }
                div.innerHTML = labels.join('<br>');
                return div;
            };
            legend.addTo(map);
        }

        function resetData() {
            geojson.setStyle(featureStyle);
            [bound_array, net_array, absolute_net, net_data, inbound_calculation, inbound_sumatory] = [[], [], [], [], [], 0];
            if (legend) {
                legend.remove();
            }
        }

        clickedFeature = function (e) {
            resetData();
            //console.log(map._layers)
            var layer = e.target;
            info.update(layer.feature.properties);
            //console.log(layer)
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
                                fillColor: getOutboundColor(county_outbound[i][1])
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
                // console.log(bound_array);
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
                                fillColor: getInboundColor(county_inbound[i][1])
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
                // console.log(bound_array);
                setJenks(bound_array);
            }

            else if (net.checked) {
                for (var key in map._layers) {
                    for (var i = 0; i < net_array.length; i++) {
                        if (map._layers[key].feature && map._layers[key].feature.properties.Municipio === net_array[i][0]) {

                            //Codigo para calcular el valor neto del municipio seleccionado 
                            if (municipio_name === net_array[i][0]) {
                                var county_net_clicked;
                                county_net_clicked = inbound_sumatory - net_array[i][1]
                            }
                            absolute_net.push(Number(net_array[i][1]));
                            map._layers[key].setStyle({
                                fillColor: '#FC4E2A',
                                weight: 1,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.7,
                                fillColor: getNetColor(net_array[i][1])
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
                // console.log(net_array);
                setJenks(absolute_net);
            }


            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }

        function onEachFeature(feature, layer) {
            layer.on({
                click: clickedFeature,
            });
        }



        geojson = L.geoJson(geoJsonFeature, {
            style: featureStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

        map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census</a>');
    }

    handleChangeMunicipio(event, index, val) {
        let e = {};
        // console.log("value is: " +val)
        this.setState({ selected: val });
        for (const [key, value] of Object.entries(map._layers)) {
            //console.log(key)
            //console.log(map._layers)
            // if (map._layers[key].feature) {
            //     console.log('.' + map._layers[key].feature.properties.Municipio + '. == .' + val +  '.')
            //     console.log(map._layers[key].feature.properties.Municipio.toString().trim() === val.toString().trim());
            // }
            if (map._layers[key].feature && map._layers[key].feature.properties.Municipio === val ) {
                e.target = map._layers[key]
                //console.log(e)
                clickedFeature(e)
                return;
            }
        }
    }

    handleOptionChange(changeEvent) {
        this.setState({ selectedOption: changeEvent.target.value });
    }

    render() {
        console.log(this.state.selected);
        return (
            <Paper>
                <div className={'full-container'}>
                    {/* <div className={'title'}>Puerto Rico Journey to Work Map </div> */}
                    <div className={"top-container"}>
                        <DropDown
                            className={"drop-down"}
                            onChange={this.handleChangeMunicipio}
                            selected={this.state.selected}
                            municipios={this.state.municipios}
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
                                <CSVLink data={csvData()} style={prettyLink} filename={"map-data.csv"}>Export to Excel ⬇ </CSVLink>
                            </div>
                            <div className={'csv-link'}>
                                <CSVLink data={selected_county_csv} headers={county_csv_headers} style={prettyLink} filename={"county-data.csv"}>Export Selected to Excel ⬇</CSVLink>
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

