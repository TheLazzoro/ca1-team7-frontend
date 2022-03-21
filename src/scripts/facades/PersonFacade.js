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

function getPersons() {
    return fetch(SERVER_URL + "/persons")
    .then(handleHttpErrors)
}

function getPersonById(id) {
    return fetch(SERVER_URL + "/persons/" + id)
}

function addPerson(person) {
    const options = makeOptions("POST", person)
    return fetch(SERVER_URL + "/persons/create", options)
    .then(handleHttpErrors)
}

function deletePerson(personId) {
    const options = makeOptions("DELETE", personId)
    return fetch(SERVER_URL + `/persons/${personId}/delete`, options)
    .then(handleHttpErrors)
}

const personFacade = {
    getPersons,
    getPersonById,
    addPerson,
    deletePerson
}

export default personFacade;