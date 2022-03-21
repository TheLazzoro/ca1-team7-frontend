import hobbyFacade from "./facades/HobbyFacade.js";
import { initPerson } from "./InitPerson.js";
import { initHobby } from "./InitHobby.js";
import { initCityInfo } from "./InitCityInfo.js";

document.getElementById("tabPerson").addEventListener("click", (event) => {
  tabClick(event, "person");
});
document.getElementById("tabHobby").addEventListener("click", (event) => {
  tabClick(event, "hobby");
});
document.getElementById("tabZipcode").addEventListener("click", (event) => {
  tabClick(event, "zipcodes");
});

function tabClick(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}


initPerson();
initHobby();
initCityInfo();