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


    console.log(window.location.href)

    /**
     * Change Url
     */
     function switchUser(user){
         window.location.href = window.location.href.replace(/[\w-]*-weekly/,`${user}-weekly`)
     }

    /**
     * Listen for messages from the background script.
     * Call "switchUser()".
    */
   browser.runtime.onMessage.addListener((message) => {
      switchUser(message.user)
  });

  })();