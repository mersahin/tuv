import moment from 'moment/moment.js';
import dotenv from 'dotenv';
import fs from 'fs';
import { getCoords, getLocations, telegram } from './fn.js';
import axios from 'axios';

dotenv.config();
// load .env.40789
dotenv.config({ path: '.env.' + process.env.PLZ });
//read db
export let db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

// read env vars
export let env = process.env;

// env var: DEBUG=true
export let DEBUG=env.DEBUG == "1" ? true : false;
export let TELEGRAM_API_KEY=env.TELEGRAM_API_KEY;
export let addOneDay = env.TYPE == "incremental" ? true : false;
export let custom_date = env.TYPE == "custom_date" ? true : false;
export let plz = env.PLZ;

// read db.json
let date = moment().format('YYYY-MM-DD');
if (env.START_DATE !== "") date = moment(START_DATE).format('YYYY-MM-DD');

// db key object not found add
if (!db[plz]) db[plz] = {};

// if not in db get coords
if (!db[plz].coords) await getCoords(plz);

let new_date = getNewDate(date);

// send every 1 second
setInterval(async () => {
    // jeder 2 mal
    if (Math.floor(Math.random() * 2) == 0) {
        axios.get(`${env.HEALTH_CHECKS}`);
    }

    try {
        new_date = getNewDate(new_date);
        await getAvailable(new_date);
    } catch (error) {
        console.log(error);
    }
}, 10000);

// fetch data axios
// await getAvailable();

//telegram start with env as message
// env.40798 to string
let env_json = dotenv.config({ path: '.env.' + plz }).parsed;
// json to key value
let env_str = "";
for(let key in env_json) {
    // telegram html new line
    env_str += key + ": " + env_json[key] + "\n"
}
// telegram(env_str)

let orts = {
    370: "Köln",
    371: "Düsseldorf-Mörsenbroich",
    372: "Düsseldorf-Garath",
    375: "Solingen",
    376: "Mettmann",
    380: "Neuss",
    382: "Köln-Bilderstöckchen",
    383: "Bergisch Gladbach",
    384: "Brühl",
    399: "Leverkusen",
}

async function getAvailable(new_date) {
    let res = await axios.post("https://www.tuv.com/tos-pti-relaunch-2019/rest/ajax/getVacanciesByDay", {
        "locale": "de-DE",
        "isLegacyTos": false,
        "date": {
            "date": new_date
        },
        "vehicleServices": [{
            "id": 4007
        }],
        "vehicleType": {
            "id": 44
        },
        "vics": db[plz].locations.map((location) => {
            return {
                "id": location.id,
                "externalLocale": "de-DE",
                "distance": location.distance,
            };
        })
    });

    // console.log(res.data);
    //db[plz].last = res.data;
    //saveDate();
    //get available time slots
    let found = false;
    var times = res.data;
    for (const ort of times.timetables) {
        // if (DEBUG) console.log('ort => ', ort);
        for (const time of ort.timeRangeVacancies) {
            // if (DEBUG) console.log('time => ', time);
            if (time.hasTimes) {
                // console.log(ort);
                found = true;
            }
            for (const slot of time.timeslots) {
                // if (DEBUG) console.log('slot => ', slot);
                if (slot.availableDates.length) {
                    // 16:00 - 2023-03-21 - Köln-Bilderstöckchen
                    let gefundene_ort = db[plz].locations.find((location) => location.id == ort.vic.id).name;
                    let msg = `${slot.availableDates.join()} - ${date} - ${gefundene_ort}`;
                    telegram(msg);
                    // console.log(`${orts[time.vic.id]}`)
                }
            }
        }
    }
}

function  getNewDate(date) {
    let new_date = date;
    switch (env.TYPE) {
        case "incremental":
            if (addOneDay) new_date = moment(new_date).add(1, 'days').format('YYYY-MM-DD');
            if(new_date > env.END_DATE) new_date = env.START_DATE === "" ? moment().format('YYYY-MM-DD') : env.START_DATE;
            break;
        case "custom_date":
            // get random date custom_date
            let custom_dates = env.CUSTOM_DATES.split(',');
            new_date = custom_dates[Math.floor(Math.random() * custom_dates.length)];
            break;
        default:
            new_date = date;
            break;
    }

    // if (DEBUG) console.log(new_date)
    return new_date;
}

