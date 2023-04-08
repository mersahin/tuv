import axios from 'axios';
import { DEBUG, db, plz, env } from './index.js';
import fs from 'fs';
import moment from 'moment/moment.js';

export const saveDate = () => {
    fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}

export const telegram = function(message) {
    var token = env.TELEGRAM_API_KEY;
    var chat_id = env.TELEGRAM_CHAT_ID;

    console.log(message)
    message = encodeURIComponent(message);
    var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${message}&parse_mode=HTML`;
    // axios
    axios.get(url).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
}

export const getCoords = function (plz) {
    let url = "https://nominatim.openstreetmap.org/search?postalcode=" + plz + "&format=json&addressdetails=1&limit=1&polygon_svg=1";
    axios.get(url).then((response) => {
        let lat = response.data[0].lat;
        let lon = response.data[0].lon;
        if (DEBUG)
            console.log(lat, lon);
        db[plz] = { "coords": { lat: lat, lon: lon } };
        saveDate();
        return { lat: lat, lon: lon };
    }).then((coords) => {
        // if not in db get locations
        if (!db[plz].locations)
            getLocations(coords);
    }).catch((error) => {
        console.log(error);
    });
}

export const getLocations = function (coords) {
    let url = "https://www.tuv.com/tos-pti-relaunch-2019/rest/ajax/getMergedLocationsByGeo";
    let data = {
        "locale": "de-DE",
        "isLegacyTos": false,
        "limit": 30,
        "location": {
            "latitude": coords.lat,
            "longitude": coords.lon
        },
        "radius": 20,
        "vehicleService": {
            "id": 0
        },
        "vehicleType": {
            "id": 44
        }
    };

    axios.post(url, data).then((response) => {
        if (DEBUG)
            console.log(response.data);
        db[plz] = { ...db[plz], "locations": response.data.vics };
        saveDate();
    }
    ).catch((error) => {
        console.log(error);
    });
}

