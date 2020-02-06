(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
      }
      window.hasRun = true;


    //TODO: combine switchUser and switchContext functions

    /**
     * Change github username in url
     */
     function switchUser(user){
         window.location.href = window.location.href.replace(/[\w-]*-weekly/,`${user}-weekly`)
     }

    /**
     * Switch between blog site and repository
     */
    function switchContext(destination){
        let currentUrl = window.location.href;
        //TODO: Make url go directly to file in repo corresponding to the page.
        // ex: weekly/about  => weekly/blob/gh-pages/about.md
        //     weekly/week01 => weekly/blob/gh-pages/_posts/2020-02-02-week01.md
        if(destination == "Repo"){
            window.location.href = currentUrl.match(/.*:\/\//) + "github.com/" + 
                                   currentUrl.match(/hunter-college-ossd-[\w-]*/) + "/" + 
                                   currentUrl.match(/[\w-]*-weekly/) + "/";
            //console.log here, after url change
        }
        else if(destination == "Site"){
            window.location.href = currentUrl.match(/.*:\/\//) + 
                                   currentUrl.match(/hunter-college-ossd-[\w-]*/) + ".github.io/" +  
                                   currentUrl.match(/[\w-]*-weekly/) + "/"
        }
    }

    /**
     * Listen for messages from the background script.
     * Call "switchUser()".
    */
   browser.runtime.onMessage.addListener((message) => {
       if(message.user){
        switchUser(message.user);
       }
       else if(message.destination){
        switchContext(message.destination);
       }
  });

  })();