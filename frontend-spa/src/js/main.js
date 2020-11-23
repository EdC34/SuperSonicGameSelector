import Header from './components/Header';
import Home from './components/Home'
import FriendsList from './components/FriendsList';
import GameShuffler from './components/GameShuffler';

export default () => {
    header();
    home();
}

const steamAPIKey = 'C376A469E8668097F10078BB1A8220EA';
const appElement = document.querySelector('.app');

function header() {
    const headerElement = document.querySelector('.header');
    headerElement.innerHTML = Header();
    homeNav();
}

function home() {
    appElement.innerHTML = Home();
    soloClick();
    socialClick();
}

function homeNav() {
    const homeNavElement = document.querySelector('.nav-home');
    homeNavElement.addEventListener('click', function(){
        home();
    })
}

function soloClick() {
    const soloElement = document.querySelector('.solo');
    soloElement.addEventListener('click', function(){
        appElement.innerHTML = GameShuffler();
    })
}

function socialClick() {
    const socialElement = document.querySelector('.social');
    socialElement.addEventListener('click', function() {
        appElement.innerHTML = FriendsList();
        idButton();
    })
}

function idButton() {
    const idButtonElement = document.querySelector('.steam-id-button');
    idButtonElement.addEventListener('click', function() {
        const steamID = document.querySelector('.steam-id-input').value;
        console.log(steamID);
        getFriendsList(steamID);
    })
}

function getFriendsList(steamID) {
    fetch(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${steamAPIKey}&steamid=${steamID}&relationship=friend`)
    .then(response => response.json())
    .then(results => console.log(results.friendslist.friends[0]))
    .catch(err => console.log(err))
}