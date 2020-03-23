# OSSD Blog Navigator
Team 6 Firefox Add-on: Make it easier to click through student weekly blogs.

## Description
This add-on allows you to navigate between weekly blogs and weekly blog repos for this course within the same tab by manipulating the url of the page.

## Features
- Search for a username or select from list of student usernames
- Toggle between a blog site and the github repo for the site
- Cycle through student blogs with carousel clicks or left/right arrow keys
- Navigate to blogs from the previous two semesters if you're extra nosy 

## Installation

To try the add-on in Firefox:
 
1. Go to `about:debugging#/runtime/this-firefox` in the search bar.
3. Click Load Temporary Add-on…
4. Select any file in the top level of the repo (usually manifest.json).
5. Now the extension is installed, but the popup will simply show an error message if you are not on a Hunter OSSD blog site or blog repo.
5. Go to a Hunter OSSD blog site or repository (example: [boubascript-weekly](https://hunter-college-ossd-spr-2020.github.io/boubascript-weekly/))and click on the icon in the menu to open the popup. 
6. ???
7. <strike>Profit</strike>

## Project Roadmap
:seedling: - early stages, still setting up \
:hammer:   - working on it \
:ok:       - basically done, will be pushed up after clean up/testing 

- ### Enhancements
  - [ ] :seedling:Link from the current blog site page to markdown editing for the page on github:seedling:
  - [ ] Key bindings to switch between contribution, about, and blog tabs
  - [ ] Key bindings to go to a specific week
  - [ ] Create options/settings page
    - [ ] Save blogs you visit often for easy navigation
- ### Github API Specific
  - [ ] Use API to dynamically generate list of usernames
  - [ ] Order list of usernames by most recent repository activity
  - [ ] Show which blogs you've forked/ contributed to and how many blog contributions you currently have
  - [ ] Display latest commit message for current blog site
- ### Browsers
  - [ ] Create chrome extension
- ### UX/UI
  - [ ] Make pretty

## Contributing

File an issue if the extension isn't working correctly or as expected. \
Feel free to try adding features or fixing bugs. Just make a pull request against the `dev` branch. \
Let's make the blog editing activity easier for everyone, together ! \
Check out [CONTRIBUTING](CONTRIBUTING.md) for more details.
