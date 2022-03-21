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

function getHobbies() {
    return fetch(SERVER_URL + "/hobbies")
    .then(handleHttpErrors);
}

function getHobbyByName(hobbyName) {
    return fetch(SERVER_URL + "/hobbies/" + hobbyName);
}

function addHobby(hobby) {
    const options = makeOptions("POST", hobby)
    return fetch(SERVER_URL + "/hobbies/create", options)
    .then(handleHttpErrors)
}

const hobbyFacade = {
    getHobbies,
    getHobbyByName,
    addHobby
}

export default hobbyFacade;