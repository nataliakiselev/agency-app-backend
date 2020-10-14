# Agency App

## Description

The back end of a full-stack (MERN) application. It is written with express, with use of native node functionality for file management. Auth is handled with JWT to the front-end. Encryption using bcrypt. A complete REST api feeds the front end application and in production this acts as the file server, with AWS storage options integrated for ephemeral file systems.

The front end app can be found here: https://github.com/nataliakiselev/agency-app-backend .

To test the whole spectrum of the app functionality login is necessary. Logged in user will have access to his own profiles portfolio view, private information on his own profiles, and to options to edit prfoile's data and main image, add (multipart/form-data handled with multer) or delete gallery images, delete and create profiles.
Test login for live demo: email: test@img.com, password: test1111
To create a new user/login, choose "register" option from the login menu.

Deployed to Heroku (React frontend hosted on Firebase):

## ✨ [Demo](https://agency-app-react.web.app)

## Disclaimer

The images used in this repository are for demo purposes only, they are not my own and I hold no rights to them.

### todo:

add image optimisation ;

### Author

👤 **Natalia Kiselev**
