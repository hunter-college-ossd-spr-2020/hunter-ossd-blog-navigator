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


    /**
     * Change url to new location
     */

     function navigate(destination){
        let currentUrl = window.location.href;

        if(destination.semester){
            let currentSemester = currentUrl.match(/hunter-college-ossd-[\w-]*/)[0];
            currentUrl = currentUrl.replace(currentSemester, currentSemester.replace(/ossd-[\w-]*/, `ossd-${destination.semester}`));
        }
        if(destination.user){
            currentUrl = currentUrl.replace(/[\w-]*-weekly/,`${destination.user}-weekly`);
        }

        if(destination.context) {
            switchContext(destination.context, currentUrl);
        }
        else {
            window.location.href = currentUrl;
        }

     }


    /**
     * Switch between blog site and repository
     */
    function switchContext(destination, currentUrl){
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
     * Call "navigate()".
    */
   browser.runtime.onMessage.addListener((message) => {
       if(message.destination){
            navigate(message.destination);
       }
  });

  })();