//TODO: document every function cleanly.

//TODO: Look into using github API to generate these.
const usernames = 
    {
        'semester': 'spr-2020',
        'students': ['boubascript','Edmund-Adewu', 'dmallia17', 'wongjessica', 'sdhani', 
                     'Ks5810', 'MichelleLucero', 'gillybytes', 'ElijahCano33', 'caitlinselca',
                     'chislee0708', 'cchloet', 'Megamega53', 'deniceysv', 'MarceloDamian', 
                     'jaredwils', 'liulanz', 'MaiteFlores', 'matter13311', 'Mtarek7900',
                     'ShainaLowenthal', 'Nannaquin', 'TDLorenz', 'umarkhan207322405']
    }
;

$( document ).ready(function() {
    usernames['students'].forEach((user) => {
        $('#usernames').append("<option value='" + user + "'>");
        $('#roster').append(`<p><a class="student" href='#'>${user}</a></p>`)
    });

    $(".student").click(function(){
        sendNewUser($(this).text().trim());
    });

});

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

    if(/^github.com\/hunter-college-ossd-.*\/.*-weekly.*$/.test(url)){
        $("#location").text(`${grabUserFromUrl(url)} Blog Repo`)
        toggleRepo("Site")
    }
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
                destination: destination,
            })
        });
    })
}

//TODO: add function that clears input when enter is pressed.
$("#inputUser").on('input', function() {
    var inputValue = $("#inputUser").val();
    if(usernames['students'].includes(inputValue)){
        //User has input a valid username from the list.
        sendNewUser(inputValue);
        $("#location").text(inputValue)
    }
});

const sendNewUser = function(user){
    browser.tabs.query({currentWindow: true, active: true})
    .then( (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
            user: user,
        })
    });
}

function errorPage() {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
}

function resetPage() {
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
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs.executeScript({file: "/content_scripts/navigate.js"})
.then(getCurrentUrl)
.catch(reportExecuteScriptError);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    resetPage();
    update(tab.url);
});