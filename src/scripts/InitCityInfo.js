import cityInfoFacade from "./facades/CityInfoFacade.js";

export function initCityInfo() {

    // Search Hobby

    const searchBar = document.getElementById("textBoxSearchCityInfo");
    const btnSearch = document.getElementById("btnSearchCityInfo");
    const tableHobby = document.getElementById("tableCityInfo");

    tableHobby.style.display = "none";
    btnSearch.addEventListener("click", (event) => {
        tableHobby.style.display = "block";

        document.querySelector('#tableBodyCityInfo').innerHTML = "";
        if (textBoxSearchHobby.value == "") {
            listAllCities();
        } else {
            listSingleCity(searchBar.value);
        }
    });

    // Create Hobby

    const btnCreateHobby = document.getElementById('btnCreateHobby');
    const dialog = document.getElementById('createHobbyDialog');

    // "Update details" button opens the <dialog> modally
    btnCreateHobby.addEventListener('click', function onOpen() {
        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            alert("The <dialog> API is not supported by this browser");
        }
    });
    // "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
    dialog.addEventListener('close', function onClose() {
        postHobby();
    });
}

const listAllCities = async () => {
    cityInfoFacade.getCityInfos()
        .then(data => {
            const cities = data;
            const tableRows = cities
                .map((city, index) => `
                    <tr>
                        <td>${city.city}</td>
                        <td>${city.zipCode}</td>
                    </td>
                    `)

            const tableRowsAsStr = tableRows.join("")
            document.querySelector('#tableBodyCityInfo').innerHTML = tableRowsAsStr
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

const listSingleCity = async (zip) => {
    cityInfoFacade.getCityInfoByZip(zip)
        .then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ).then(result => {
                const hobby = result.data;
                const tableRow = `
                <tr>
                    <td>${hobby.name}</td>
                    <td><button class="btnView" id=${hobby.id}>View</button>
                </td>
                `

                const tableRowsAsStr = tableRow;
                document.querySelector('#tableBodyHobby').innerHTML = tableRowsAsStr
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

const postHobby = async () => {
    const name = document.getElementById("textBoxHobbyName").value;
    const wikiLink = document.getElementById("textBoxHobbyWikiLink").value;
    const category = document.getElementById("textBoxHobbyCategory").value;
    const type = document.getElementById("textBoxHobbyType").value;

    const json = {"name":name, "wikiLink":wikiLink, "category":category, "type":type};
    hobbyFacade.addHobby(json);
}