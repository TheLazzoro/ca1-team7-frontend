import hobbyFacade from "/src/scripts/facades/HobbyFacade.js";

export function initHobby() {

    // Search Hobby

    const searchBar = document.getElementById("textBoxSearchHobby");
    const btnSearch = document.getElementById("btnSearchHobby");
    const tableHobby = document.getElementById("tableHobby");

    tableHobby.style.display = "none";
    btnSearch.addEventListener("click", (event) => {
        tableHobby.style.display = "block";

        document.querySelector('#tableBodyHobby').innerHTML = "";
        if (textBoxSearchHobby.value == "") {
            listAllHobbies();
        } else {
            listSingleHobby(searchBar.value);
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

const listAllHobbies = async () => {
    hobbyFacade.getHobbies()
        .then(data => {
            const hobbies = data.hobbies;
            const tableRows = hobbies
                .map((hobby, index) => `
                    <tr>
                        <td>${hobby.name}</td>
                        <td><button class="btnView" id=${hobby.id}>View</button>
                    </td>
                    `)

            const tableRowsAsStr = tableRows.join("")
            document.querySelector('#tableBodyHobby').innerHTML = tableRowsAsStr
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

const listSingleHobby = async (hobbyName) => {
    hobbyFacade.getHobbyByName(hobbyName)
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