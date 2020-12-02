import Header from './components/Header';
import EnterSteamID from './components/EnterSteamID'
import FriendsListResults from './components/FriendsListResults';
import GamesOwned from './components/GamesOwned';
import ShuffleResult from './components/ShuffleResult';
import SoloOrSocial from './components/SoloOrSocial';

export default () => {
    header();
    enterSteamID();
}

const steamAPIKey = 'C376A469E8668097F10078BB1A8220EA';
const appElement = document.querySelector('.app');
var gamePossibilities = [];
var friendsListArray = [];
const defaultGameImage = "../../images/default.jpg";
let mainUserSteamID = "";

function header() {
    const headerElement = document.querySelector('.header');
    headerElement.innerHTML = Header();
    navHome();
}

function enterSteamID() {
    appElement.innerHTML = EnterSteamID();
    saveSteamID();
}

function reenterSteamID() {
    const reenterElement = document.querySelector('.re-enter');
    reenterElement.addEventListener('click', function(){
        enterSteamID();
    })
}

function soloOrSocial() {
    appElement.innerHTML = SoloOrSocial()
    socialClick();
    soloClick();
    reenterSteamID();
}

function navHome(){
    const navHomeElement = document.querySelector('.nav-home')
    navHomeElement.addEventListener('click', function() {
        soloOrSocial();
    })
}

function saveSteamID() {
    const saveIDButton = document.querySelector('.steam-id-button')
    saveIDButton.addEventListener('click', function() {
        mainUserSteamID = document.querySelector('.steam-id-input').value;
        console.log(mainUserSteamID)
        soloOrSocial();
        displayUserNickname();
    })
}

function soloClick() {
    const soloElement = document.querySelector('.solo');
    soloElement.addEventListener('click', function(){
        getGamesOwned(mainUserSteamID);
    })
}

function socialClick() {
    const socialElement = document.querySelector('.social');
    socialElement.addEventListener('click', function() {
        getFriendsList(mainUserSteamID);    
    })
}

function displayUserNickname() {
    fetch(`https://cors-anywhere.herokuapp.com/http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamAPIKey}&steamids=${mainUserSteamID}`)
    .then(response => response.json())
    .then(result => {
        const userWelcomeElement = document.querySelector('.welcome-header')
        const userAvatarElement = document.querySelector('.user-avatar')
        const userAvatar = result.response.players[0].avatarfull
        const userName = result.response.players[0].personaname
        console.log(userName)
        userWelcomeElement.innerHTML = `Welcome, ${userName}`
        if(userAvatar === 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg') {
            userAvatarElement.setAttribute("src", '../../images/default-avatar.png')
        }
        else {
            userAvatarElement.setAttribute("src", userAvatar)
        }
    })
}

function getFriendsList(steamID) {
    fetch(`https://cors-anywhere.herokuapp.com/http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${steamAPIKey}&steamid=${steamID}&relationship=friend`)
    .then(response => response.json())
    .then(results => {
        friendsListArray.length = 0;
        console.log(results.friendslist.friends[0].steamid)
        appElement.innerHTML = FriendsListResults()
        results.friendslist.friends.forEach(element => {
            const friendsSteamId = element.steamid
            friendsListArray.push(friendsSteamId)
        })
        getFriendsListNames();
    })
    .catch(err => console.log(err))
    console.log(friendsListArray)
}

function getFriendsListNames() {
    console.log(friendsListArray)
    const friendsListCommas = friendsListArray.join(",")
    console.log(friendsListCommas)
    const friendsDiv = document.querySelector('.friends-div')
    fetch(`https://cors-anywhere.herokuapp.com/http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamAPIKey}&steamids=${friendsListCommas}`)
    .then(response => response.json())
    .then(results => {
        results.response.players.forEach(element => {
            console.log(element.personaname)
            const friendsListElement = document.createElement("P")
            const friendsSteamName = element.personaname
            friendsListElement.innerHTML = friendsSteamName
            friendsDiv.appendChild(friendsListElement)
            const friendsAvatarElement = document.createElement("IMG")
            friendsAvatarElement.setAttribute("src", element.avatarmedium)
            friendsDiv.appendChild(friendsAvatarElement)
        })
    })
    .catch(err => console.log(err))
}

function getGamesOwned(steamID) {
    fetch(`https://cors-anywhere.herokuapp.com/http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamAPIKey}&steamid=${steamID}&format=json&include_appinfo=1&include_played_free_games=1`)
    .then(response => response.json())
    .then(results => {
        console.log(results.response.games)
        appElement.innerHTML = GamesOwned()
        const gameDiv = document.querySelector('.games')
        results.response.games.forEach(element => {
            console.log(element.name)
            const gameName = element.name;
            if(!gameName.includes("Public Test")) {
            const gameNameElement = document.createElement("P");
            console.log(gameNameElement)
            gameNameElement.innerHTML = gameName;
            gameDiv.appendChild(gameNameElement)
            const gameLogo = element.img_logo_url;
            const imgURL = `http://media.steampowered.com/steamcommunity/public/images/apps/${element.appid}/${gameLogo}.jpg`
            const gameImageElement = document.createElement("IMG");
            console.log(gameImageElement)
            setDefaultImage(gameImageElement, imgURL, gameLogo)
            gameDiv.appendChild(gameImageElement)
        }
        });
        gamePossibilities = results.response.games;
        shuffleButton()
    })
    .catch(err => console.log(err))
}

function shuffleGames(){
    const shuffleResultElement = document.querySelector('.game-choice')
    let arrayPosition = Math.floor(Math.random()* gamePossibilities.length);
    shuffleResultElement.innerText = `${gamePossibilities[arrayPosition].name}`
    const gameImage = document.querySelector('.game-choice-image')
    const gameLogo = gamePossibilities[arrayPosition].img_logo_url
    const imgURL = `http://media.steampowered.com/steamcommunity/public/images/apps/${gamePossibilities[arrayPosition].appid}/${gameLogo}.jpg`
    setDefaultImage(gameImage, imgURL, gameLogo)
}

function shuffleButton() {
    const shuffleButtonElement = document.querySelector('.shuffle-btn')
    shuffleButtonElement.addEventListener("click", function(){
        console.log("shuffleButton")
        console.log(gamePossibilities)
    appElement.innerHTML = ShuffleResult()
    shuffleGames()
    shuffleButton()
    })
}

function setDefaultImage(gameImage, imgURL, gameLogo) {
    if (gameLogo !== "") {
        gameImage.setAttribute("src", imgURL)
    }
    else {
        gameImage.setAttribute("src", defaultGameImage)
    }
}