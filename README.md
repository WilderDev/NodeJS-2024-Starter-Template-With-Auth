# NodeJS 2024 Starter Code w/ Auth (TEMPLATE)

## Start a New Project Using This Template

1. Click the "Use this template" button
2. Install packages: `npm i`
3. Create .env file and replace credentials:

```.env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.ey9pqsg.mongodb.net/<db>?retryWrites=true&w=majority

JWT_SECRET=6a627a7fb025e2c5db643267523a1c801c1178bed30331a2606fe93f4dd9aa7b

SERVER_URL=http://localhost:5000
```

    - Replace `<user>`, `<pass>`, and `<db>` with your MongoDB credentials and database name
    - Replace `JWT_SECRET` with a random string. You can generate one from the terminal using `node -e "console.log(require('crypto').randomBytes(256).toString('base64'))"`
    - Replace `SERVER_URL` with your server URL
    - You can also add other environment variables here

3. TODO
4. ...

## Features

- [x] User Authentication
  - [x] User Registration
  - [x] User Login
  - [x] User Logout
- [ ] User Profile
- [ ] Template Model
  - [ ] Create
  - [ ] Read
  - [ ] Update
  - [ ] Delete
- [ ] Template Controller
- [ ] Template Routes

## TODO

- [ ] Complete Auth
- [ ] Complete Template Model / Controller / Routes
- [ ] Create Insomnia Workspace for API Testing (or Postman) and add to repo
- [ ] Comment All Code
- [ ] Create Documentation (README.md)
- [ ] Test All Routes
