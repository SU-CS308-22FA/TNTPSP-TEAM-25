# TNTPSP
Turkish National Team Player Selection Platform

https://whispering-cove-38859.herokuapp.com/

TNTPSP is a web application that is a social media platform to guide Turkish Football Federation about national football team player selection. Users can express their opnions about Turkish players and see others opinions. Also, verified users can give a rating to players and these ratings are shown to users in the ranking page. This platform will help to sustain peaceful environment during national team player selection.


# User Documentation
- In order to use these platform, users can just click the link of the website below the platform name.
- In order to report a bug, you can send a bug report from the user profile page.


# Developer Documentation

- In order to get the source code of the project you just need to type "git clone https://github.com/SU-CS308-22FA/TNTPSP-TEAM-25.git" in the of the visual studio code.
- In the project, we have multiple files. One folder is the images file that contains images that were used in project. The "views" folder contains the ejs files which creates applications front-end. The backend files of the project are "main.js" and "player.js". 
- In order to run the program, you need to install the external libraries and dependencies with "npm install" command in vscode terminal. Then you need to start the program by typing "npm start" in the vescode terminal. Then the server will be started in your localhost at a given port. It will either be process environment port or a port that you manually set. To deploy the application public, you can use free version of heroku, and push the git branch to herokus branch. You need to create a file named Procfile without any extension and put "npm install" and "npm start" commands each to a line sorted and heroku will know those commands to run.

# Known Bugs

- If user checks the "Want to be verified" button while registering, he/she will not be able to view the mainpage unless he/she gets verification approval.(Fixed)

