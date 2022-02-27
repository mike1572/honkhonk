
import './App.css';

import React, {Fragment, useEffect, useState} from 'react'

import { MapContainer, Marker, Popup, TileLayer, Polyline} from 'react-leaflet'
import {Icon} from "leaflet";

import data from './data.json';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Slide from '@mui/material/Slide'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

import logo from './location.svg'

function App() {

  let [info, setInfo] = useState([])

  let [position, setPosition] = useState([])
  let [barShown, setBarShown] = useState(true)
  let [loading, setLoading] = useState(false)
  let [buttonDisabled, setButtonDisabled] = useState(true)

  let [tripId, setTripId]= useState('')
  let [latitude, setLatitude] = useState('')
  let [longitude, setLongitude] = useState('')
  let [startTime, setStartTime] = useState(new Date())
  let [maxDestinationTime, setMaxDestinationTime] = useState(new Date())

  const icon = new Icon({
    iconUrl: logo, 
    iconSize: [35, 35]
  })

  useEffect(() => {

    if (tripId === '' || latitude === '' || longitude === "" || startTime === "" || maxDestinationTime === ""){
      setButtonDisabled(true)
    } else {
      setButtonDisabled(false)
    }


  }, [tripId, latitude, longitude, startTime, maxDestinationTime ])

  let handleChange=(event) => {
    if (event.target.name === 'tripId'){
      setTripId(event.target.value)
    } else if (event.target.name === 'latitude'){
      setLatitude(event.target.value)
    } else if (event.target.name === 'longitude'){
      setLongitude(event.target.value)
    }
  }


  let getLocation = () => {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition)
    } else {
      console.log("Not supported")
    }
  }  

  let showPosition = (position) => {
    if (position !== undefined){
      setPosition([position.coords.latitude, position.coords.longitude])
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
    }
  }

  useEffect(() => {
    getLocation()
  }, [])

  let toggleBar = () => {
    setBarShown(!barShown)
  }

  let handleClose = () => {
    setLoading(false)
  }

  let handleSubmit = () => {

    let obj  = {
      "input_trip_id": tripId,
      "start_latitude": latitude,
      "start_longitude": longitude,
      "start_time": startTime.toISOString(),
      "max_destination_time": maxDestinationTime.toISOString()
    }
   
    setLoading(true)


    // var result = Module.ccall(
    //   'myFunction',  // name of C function
    //   null,  // return type
    //   null,  // argument types
    //   null  // arguments
    // );

 

    // fetch("a.out.wasm")
    // .then((response)=> {
    //   console.log(response)
    //   response.arrayBuffer()
    // })
    // .then((bits) => {
    //   console.log(bits)
    //   WebAssembly.compile(bits)
    // })
    // .then((obj) => {
    //   console.log(obj.instance.exports.add(1, 2))
    // })


      fetch('external')
      .then((wasm) => {
        console.log(wasm)
        console.log(wasm.doubler(2))
      })
      .catch(err => {
      console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
      })


    // .then((module) => {return new WebAssembly.Instance(module)})
    // .then((instance) => {
    //   add = instance.exports._Z3addii;
    //   console.log(add(1,2))
    // })


//     function loadWebAssembly(filename, imports) {
//       // Fetch the file and compile it
//       return fetch(filename)
//         .then(response => response.arrayBuffer())
//         .then(buffer => WebAssembly.compile(buffer))
//         .then(module => {
//           // Create the imports for the module, including the
//           // standard dynamic library imports
//           imports = imports || {};
//           imports.env = imports.env || {};
//           imports.env.memoryBase = imports.env.memoryBase || 0;
//           imports.env.tableBase = imports.env.tableBase || 0;
//           if (!imports.env.memory) {
//             imports.env.memory = new WebAssembly.Memory({ initial: 256 });
//           }
//           if (!imports.env.table) {
//             imports.env.table = new WebAssembly.Table({ initial: 0, element: 'anyfunc' });
//           }
//           // Create the instance.
//           return new WebAssembly.Instance(module, imports);
//         });
//     }

//     var importObject = {
//       env: {
//       'memoryBase': 0,
//       'tableBase': 0,
//       'memory': new WebAssembly.Memory({initial: 256}),
//       'table': new WebAssembly.Table({initial: 256, element: 'anyfunc'}),
//       abort: alert,
//       }
//  }

//     // Main part of this example, loads the module and uses it.
//     loadWebAssembly('hello_world.wasm')
//       .then(instance => {
//         var exports = instance.exports; // the exports of that instance
//         var doubler = exports._doubler; // the "doubler" function (note "_" prefix)
//         // now we are ready, set up the button so the user can run the code
//         console.log(doubler(2))
//       }
//     );

    setTimeout(() => {
      setInfo(data)
      console.log(obj)
      setLoading(false)
      setBarShown(false)
    }, 3000)
  }

  return (
    <Fragment>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" size={55} />
      </Backdrop>

      <AppBar sx={{p: 1.6, backgroundColor: 'orange', position: 'sticky' }}>
        <Typography variant="h6" sx={{textAlign: 'center', color: 'white', fontWeight: 800}}>Honk Honk</Typography>
        <Tooltip title="Your Trip">
          <IconButton
            sx={{mr: 2, borderRadius: '25px', mt: 0.5, position: 'absolute', right: '0', top: '0'}}
            onClick={toggleBar}
            >
            <LocalShippingIcon fontSize='large' color="primary"/>
          </IconButton>
        </Tooltip>
      </AppBar>

      <Slide direction="left" in={barShown} mountOnEnter unmountOnExit>

      <AppBar sx={{mt: 12, width: '25%', p: 5, mx: 3, borderRadius: '15px', bgcolor: 'orange', minWidth: 320}}>
        <Typography sx={{textAlign: 'center', color: 'white', fontWeight: 800, mb: 2}} variant="h5">
          Trip Request
        </Typography>

      <Box component="form" noValidate sx={{textAlign: 'center', m: 1, mb: 4}} onSubmit={handleSubmit}>
        <TextField label="Input Trip Id" type="number" variant="filled" sx={{m: 1}} required name="tripId" value={tripId} onChange={handleChange} />
        <TextField label="Start Latitude" type='number' variant="filled" sx={{m: 1}} required value={latitude} name="latitude" onChange={handleChange}/>
        <TextField label="Start Longitude" type="number" sx={{m: 1}} required value={longitude} name="longitude" onChange={handleChange}/>    
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} required  variant="filled" sx={{m: 1}}/>}
            label="Start Time"
            minDate={new Date()}
            value={startTime}
            onChange={(newValue) => {
              setStartTime(newValue);
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} required  variant="filled" sx={{m: 1}}/>}
            label="Max Destination Time"
            minDate={new Date()}
            value={maxDestinationTime}
            onChange={(newValue) => {
              setMaxDestinationTime(newValue);
            }}
          />
        </LocalizationProvider>
        <Button variant='contained' onClick={handleSubmit} disabled={buttonDisabled} sx={{mt: 2}}>
            Find Route
        </Button>
      </Box>
      </AppBar>
    </Slide>
   
    <MapContainer center={ position.length === 0 ? [45.501690, -73.567253] : position} zoom={5} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {
        position.length === 0 ? (
          <Fragment>
          </Fragment>
        ): (
          <Marker position={position} icon={icon} >
            <Popup>
              <h4><b>Current Location</b></h4>
            </Popup>
          </Marker>
        )
      }
      
      {
        info.map((element, i) => (
          <Fragment>
            {
              i == 0 ? (
                <Marker position={[element["origin_latitude"], element["origin_longitude"]]} color="blue" icon={icon}>
                  <Popup>
                    <i>Start Point</i><br/>
                    <b>Origin ({i+1})</b><br/>{element["origin_city"]},  {element["origin_state"]}
                  </Popup>
                </Marker>
              ): (
                <Marker position={[element["origin_latitude"], element["origin_longitude"]]} color="blue">
                  <Popup>
                    <b>Origin ({i+1})</b><br/>{element["origin_city"]},  {element["origin_state"]}
                  </Popup>
                </Marker>
              )
            }
           
            <Polyline 
              positions={[
                [element["origin_latitude"], element["origin_longitude"]], [element["destination_latitude"], element["destination_longitude"]],
              ]} 
              color={'blue'}>
            </Polyline>

            {
              i == data.length -1 ? (
                <Marker position={[element["destination_latitude"], element["destination_longitude"]]} icon={icon}>
                  <Popup>
                  <i>End Point</i><br/>
                  <b>Destination ({i+1})</b><br/>{element["destination_city"]},  {element["destination_state"]}
                  </Popup>
                </Marker>
              ): (
                <Marker position={[element["destination_latitude"], element["destination_longitude"]]}>
                  <Popup>
                  <b>Destination ({i+1})</b><br/>{element["destination_city"]},  {element["destination_state"]}
                  </Popup>
                </Marker>
              )
            }
          
          </Fragment>
        ))
      }

    </MapContainer>
    </Fragment>
  );
}

export default App;
