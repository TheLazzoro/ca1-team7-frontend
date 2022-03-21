import { SERVER_URL } from "/src/scripts/Constants.js"

function handleHttpErrors(res) {
	if (!res.ok) {
		return Promise.reject({ status: res.status, fullError: res.json() })
	}
	return res.json();
}

function makeOptions(method, body) {
    var opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }
    if(body) {
        opts.body = JSON.stringify(body);
    }
    return opts;
}

function getCityInfos() {
    return fetch(SERVER_URL + "/cityinfo")
    .then(handleHttpErrors)
}

function getCityInfoByZip(zip) {
    return fetch(SERVER_URL + "/cityinfo/" + zip)
}

const cityInfoFacade = {
    getCityInfos,
    getCityInfoByZip,
}

export default cityInfoFacade;