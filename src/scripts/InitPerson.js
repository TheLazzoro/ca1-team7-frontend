import cityInfoFacade from "./facades/CityInfoFacade.js";
import personFacade from "/src/scripts/facades/PersonFacade.js";

export function initPerson() {

    // Search Person

    const searchBar = document.getElementById("textBoxSearchPerson");
    const btnSearch = document.getElementById("btnSearchPerson");
    const tablePerson = document.getElementById("tablePerson");

    tablePerson.style.display = "none";
    btnSearch.addEventListener("click", (event) => {
        tablePerson.style.display = "block";

        document.querySelector('#tableBodyPerson').innerHTML = "";
        if (textBoxSearchPerson.value == "") {
            listAllPersons();
        } else {
            listSinglePerson(searchBar.value)
        }
    });

    // Create Person

    const btnCreatePerson = document.getElementById('btnCreatePerson');
    const dialog = document.getElementById('createPersonDialog');

    // "Update details" button opens the <dialog> modally
    btnCreatePerson.addEventListener('click', function onOpen() {
        if (typeof dialog.showModal === "function") {
            dialog.showModal();
            loadCityInfoIntoCreateForm();
        } else {
            alert("The <dialog> API is not supported by this browser");
        }
    });
    // "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
    dialog.addEventListener('close', function onClose() {
        postPerson();
    });
}



const listAllPersons = async () => {
    personFacade.getPersons()
        .then(data => {
            const persons = data.persons;
            const tableRows = persons
                .map((person, index) => generateHtmlPerson(person));

            persons.forEach(person => {
                generatePersonEvents(person);
            });
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => {
                    console.log(e.message)
                    document.getElementById("error").innerHTML = e.message;
                })
            }
            else {
                console.log("Network error");
            }
        });
}

const listSinglePerson = async (id) => {
    personFacade.getPersonById(id)
        .then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ).then(result => {
                const person = result.data;
                generateHtmlPerson(person);
                generatePersonEvents(person);
            }))
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => {
                    console.log(e.message)
                    document.getElementById("error").innerHTML = e.message;
                })
            }
            else {
                console.log("Network error");
            }
        });
}

function generateHtmlPerson(person) {
    const tableRow = `
        <tr id=tableRowPerson${person.id}>
            <td>${person.firstName}</td>
            <td>${person.lastName}</td>
            <td>
                <button class="btnView" id=btnDetails${person.id}>Details</button>
                <button class="btnView" id=btnEdit${person.id}>Edit</button>
                <button class="btnView" id=btnDelete${person.id}>Delete</button>
        </td>
        `

    // insert html
    document.querySelector('#tableBodyPerson').innerHTML += tableRow;

    return tableRow;
}

function generatePersonEvents(person) {
    const tableRow = document.getElementById(`tableRowPerson${person.id}`)
    const btnDetails = document.getElementById("btnDetails" + person.id);
    const btnDelete = document.getElementById("btnDelete" + person.id);

    const dialogDetails = document.getElementById('viewPersonDialog');
    // "Update details" button opens the <dialog> modally
    btnDetails.addEventListener('click', function onOpen() {
        if (typeof dialogDetails.showModal === "function") {
            dialogDetails.showModal();
        } else {
            alert("The <dialog> API is not supported by this browser");
        }
    });
    // "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
    dialogDetails.addEventListener('close', function onClose() {
        // Insert event on close maybe?
    });


    btnDetails.addEventListener("click", async (event) => {
        let selectedPerson = null;
        const viewFullname = document.getElementById("viewName");
        const viewEmail = document.getElementById("viewEmail");
        const viewPhone = document.getElementById("viewPhone");
        const tablePersonHobbies = document.getElementById("tablePersonHobbies");

        // reset view on next click
        viewFullname.innerHTML = "Name: Loading...";
        viewEmail.innerHTML = "Email: Loading...";
        viewPhone.innerHTML = "Phone: Loading...";
        tablePersonHobbies.innerHTML = "";

        const res = await personFacade.getPersonById(person.id)
            .then(response =>
                response.json().then(data => ({
                    data: data,
                    status: response.status
                })
                ).then(result => {
                    selectedPerson = result.data;
                }))
            .catch(err => {
                if (err.status) {
                    err.fullError.then(e => {
                        console.log(e.message)
                        document.getElementById("error").innerHTML = e.message;
                    })
                }
                else {
                    console.log("Network error");
                }
            });

        viewFullname.innerHTML = "Name: " + selectedPerson.firstName + " " + selectedPerson.lastName;
        viewEmail.innerHTML = "Email:" + selectedPerson.email;
        viewPhone.innerHTML = "Phones: "; // reset
        selectedPerson.phones.phoneDTOS.map(phone => viewPhone.innerHTML += `${phone.number},`);

        tablePersonHobbies.innerHTML = ""; // reset
        selectedPerson.hobbies.map(hobby =>
            tablePersonHobbies.innerHTML += `
            <tr>
                <td>${hobby.name}</td>
            </td>
            `
        );
    })

    btnDelete.addEventListener("click", (event) => {
        personFacade.deletePerson(person.id);
        tableRow.innerHTML = "";
    })
}

const loadCityInfoIntoCreateForm = async () => {
    document.querySelector('#createPersonPostalCode').innerHTML = "";
     await cityInfoFacade.getCityInfos()
        .then(data => {
            const cityInfos = data;
            cityInfos.map(cityinfo =>
                    document.querySelector('#createPersonPostalCode').innerHTML += `<option value=${cityinfo.zipCode}>${cityinfo.zipCode} ${cityinfo.city}</option>`
                );
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => {
                    console.log(e.message)
                    document.getElementById("error").innerHTML = e.message;
                })
            }
            else {
                console.log("Network error");
            }
        });
}


const postPerson = async () => {
    const firstName = document.getElementById("textBoxFirstName").value;
    const lastName = document.getElementById("textBoxLastName").value;
    const email = document.getElementById("textBoxEmail").value;
    const phone = document.getElementById("textBoxPhone").value;
    const street = document.getElementById("textBoxAddress").value;
    const addressNumber = document.getElementById("textBoxAddressNumber").value;
    const zipCode = document.getElementById("createPersonPostalCode").value;

    const obj = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "phones": [
            {
                "number": phone,
                "description": "mobile"
            }
        ],
        "address": {
            "street": street,
            "additionalInfo": addressNumber,
            "zipCode": zipCode
        }
    };
    console.log(JSON.stringify(obj));

    personFacade.addPerson(obj)
    .then( data => console.log("ok"))
    .catch(err => {
        if (err.status) {
            err.fullError.then(e => {
                console.log(e.message)
                document.getElementById("error").innerHTML = e.message;
            })
        }
        else {
            console.log("Network error");
        }
    });
}