import countries from "./countries+states+cities.json";
export const getListOfCountries = () => {
    let listOfCountries = [];
    countries.forEach(element => {
        listOfCountries.push(element.name);
    });

    return listOfCountries;
}

export const getStatesOfCountry = (nameOfCountry) => {
    let states = [];
    let country = null;
    countries.forEach(element => {
        if (nameOfCountry.toLowerCase() === element.name.toLowerCase()) country = element ;
    });

    country.states.forEach(state => {
        states.push(state)
    });
    return states;
}


export const getCitiesOfState = (nameOfState, nameOfCountry) => {
    let cities = [];
    let state = null;
    getStatesOfCountry(nameOfCountry).forEach(element => {
        if (nameOfState.name.toLowerCase() === element.name.toLowerCase()) state = element
    });

    state?.cities.forEach(city => {
        cities.push(city.name);
    });
    return cities;
};

export let listOfCountries = getListOfCountries();

export const getOptions = (value, country = 0, state = 0) => {
    let options = [];
    switch (value) {
        case "COUNTRY":
            for (let i = 0; i < getListOfCountries().length; i++) {
                options.push(
                    <option 
                        key={i} 
                        value={getListOfCountries()[i]}>
                            {getListOfCountries()[i]}
                    </option>);
            }
            return options;
        case "STATE":
            for (let i = 0; i < getStatesOfCountry(getListOfCountries()[country]).length; i++) {
                options.push(
                    <option 
                        key={i} 
                        value={getStatesOfCountry(getListOfCountries()[country])[i].name}>
                            {getStatesOfCountry(getListOfCountries()[country])[i].name}
                    </option>);
            }
            return options;
        case "CITY":
            for (let i = 0; i < getCitiesOfState(getStatesOfCountry(getListOfCountries()[country])[state], getListOfCountries()[country]).length; i++) {
                options.push(
                    <option 
                        key={i} 
                        value={getCitiesOfState(getStatesOfCountry(getListOfCountries()[country])[state], getListOfCountries()[country])[i]}>
                            {getCitiesOfState(getStatesOfCountry(getListOfCountries()[country])[state], getListOfCountries()[country])[i]}
                    </option>);
                }
            return options;
        default: 
            return;
    }
}

export function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}