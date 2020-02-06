

//TODO: Look into using github API to generate these.
const usernames = 
    {
        'semester': 'spr-2020',
        'students': ['boubascript','Edmund-Adewu', 'dmallia17', 'wongjessica', 'sdhani', 'Ks5810', 'MichelleLucero']
    }
;

$( document ).ready(function() {
    usernames['students'].forEach((user) => {
        $('#usernames').append("<option value='" + user + "'>");
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
    url = url.slice(url.indexOf('://') + 3);
    console.log(url)
    if(/^github.com\/hunter-college-ossd-.*\/.*-weekly.*$/.test(url)){
        $("#location").text(`${grabUserFromUrl(url)} Blog Repo`)
    }
    else if(/^hunter-college-ossd-.*\.github\.io\/.*-weekly.*$/.test(url)){
        $("#location").text(`${grabUserFromUrl(url)} Blog Site`)
    }
    else{
        errorPage();
    }

}

$("#inputUser").on('input', function() {
    var inputValue = $("#inputUser").val();
    if(usernames['students'].includes(inputValue)){
        //User has input a valid username from the list.
        browser.tabs.query({currentWindow: true, active: true})
        .then( (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {
                user: inputValue,
            })
        });
        $("#location").text(inputValue)
    }
});


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