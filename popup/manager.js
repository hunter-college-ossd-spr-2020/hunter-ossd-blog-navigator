//TODO: document every function cleanly.

//TODO: Look into using github API to generate these.
const usernames = {
    'spr-2020' :  ['boubascript', 'dmallia17', 'wongjessica', 'sdhani', 'Ks5810',
                     'MichelleLucero', 'gillybytes', 'Edmund-Adewu','ElijahCano33', 'caitlinselca',
                     'chislee0708', 'cchloet', 'Megamega53', 'deniceysv', 'MarceloDamian', 
                     'jaredwils', 'liulanz', 'MaiteFlores', 'matter13311', 'Mtarek7900',
                     'Nannaquin', 'TDLorenz', 'umarkhan207322405'],
    
    'fall-2019':  ['kkhan01','Zabari', 'srafi1', 'kbarias', 'Aleks118', 'giocare', 
                    'sajarindider', 'nancydocode', 'darrenzhang2000', 'Bakainkorp',
                    'nancydocode', 'ariella879', 'benjaminIgur', 'shadoow12ac', 'Nerouse',
                    'R-Ligier', 'ValeroM', 'vioelsdm', 'sophiabonsu', 'tobyau', 'hjiang4332',
                    'azheng4119', 'rajsukanya', 'jxuan101', 'shakeel30', 'enEin100', 'HubertYe',
                    'waterpolymer', 'sjku1'],

    'spr19': ['yizongk', 'f0cus10', 'DanieSegarra36', 'Chocolate-Spaghet', 'gutierrezjdr', 
              'mxmsunny','codesue', 'johncgenere', 'HasanAbdullah31', 'ejguzm19', 
              'jch8ri', 'msats5', 'rramnauth11', 'gsvetleen', 'stonemoore2', 'Eli10',
              'emmacromeo', 'nCarol595', 'Undid-Iridium', 'Shane-Lester99' ]
};

let currentIndex;

/**
 * Populate Popup with hard coded student github usernames on popup load.
 */
$( document ).ready(function() {
    // TODO: add .filter here so the current student's username is not included in the list
    loadUsernames($("#semester").val());

});

const loadUsernames = (semester) => {
    $('#usernames').empty();
    $('#roster').empty();
    usernames[semester].forEach((user) => {
        $('#usernames').append(`<option value='${user}'>`);
        $('#roster').append(`<p><a class="student" href='#'>${user}</a></p>`)
    });

    $(".student").click(function(){
        sendNewUser($(this).text().trim(), $("#semester").val());
    });
}

const getCurrentUrl = function(){
    browser.tabs.query({currentWindow: true, active: true})
    .then( (tabs) => {
        update(tabs[0].url);
    });     
}

const grabUserFromUrl = function(url) {
    return url.match(/[\w-]*-weekly/)[0].slice(0,-7);
}

const update = function(url){
    //Strip http/https part.
    url = url.slice(url.indexOf('://') + 3);

    currentIndex = usernames[$("#semester").val()].indexOf(grabUserFromUrl(url));

    // Regex matching blog repo.
    if(/^github.com\/hunter-college-ossd-.*\/.*-weekly.*$/.test(url)){
        $("#location").text(`${grabUserFromUrl(url)} Blog Repo`)
        toggleRepo("Site")
    }
    // Regex matching blog site.
    else if(/^hunter-college-ossd-.*\.github\.io\/.*-weekly.*$/.test(url)){
        $("#location").text(`${grabUserFromUrl(url)} Blog Site`)
        toggleRepo("Repo")
    }
    else{
        errorPage();
    }

}

const toggleRepo = function(destination){
    $("#toggletext").text(destination)
    $("#togglerepo").click(function() {
        browser.tabs.query({currentWindow: true, active: true})
        .then( (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {
                destination: {
                    context: destination
                }
            })
        });
    })
}

$("#inputUser").on('input', function() {
    var inputValue = $("#inputUser").val();
    if(usernames[$("#semester").val()].includes(inputValue)){
        //User has input a valid username from the list.
        sendNewUser(inputValue, $("#semester").val());
        $("#location").text(inputValue)
    }
});

// Carousel navigation
const getNextUser = function(index) {
    sendNewUser(usernames[$("#semester").val()][index], $("#semester").val());
}

$("#prevUser img").on('click', function() {
    getNextUser(currentIndex == 0 ? usernames[$("#semester").val()].length - 1 : currentIndex - 1);
});

$("#nextUser img").on('click', function() {
    getNextUser(currentIndex == usernames[$("#semester").val()].length - 1 ? 0 : currentIndex + 1);
});

// Clear input when user clicks to search for another username
$("#inputUser").on('click', function() {
    $("#inputUser").val("")
});

$("#semester").on('change', function() {
    loadUsernames($("#semester").val());
});

// Keyboard navigation for the 1337 hackers
$(document).keydown(function(e) {
    console.log(e.which);
    console.log(e.key);
    switch(e.key) {

        case 'ArrowRight': // right
            getNextUser(currentIndex == usernames[$("#semester").val()].length - 1 ? 0 : currentIndex + 1);
            break;

        case 'ArrowLeft': // left
            getNextUser(currentIndex == 0 ? usernames[$("#semester").val()].length - 1 : currentIndex - 1);
            break;


        //default: return; // exit this handler for other keys
    }
    //e.preventDefault(); // prevent the default action (scroll / move caret)
});

const errorPage = function() {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
}

const resetPage = function() {
    document.querySelector("#popup-content").classList.remove("hidden");
    document.querySelector("#error-content").classList.add("hidden");
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error) {
    errorPage()
    console.error(`Failed to execute navigate content script: ${error.message}`);
}

/**
 * Send new username to content script to update url.
 */
const sendNewUser = function(user, semester){
    browser.tabs.query({currentWindow: true, active: true})
    .then( (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
            destination : {
                user: user,
                semester: semester
            }
        })
    });
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs.executeScript({file: "/content_scripts/navigate.js"})
.then(getCurrentUrl)
.catch(reportExecuteScriptError);

/**
 * When a tab url is updated, check if it is a blog url and update popup.
 */
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    resetPage();
    update(tab.url);
});