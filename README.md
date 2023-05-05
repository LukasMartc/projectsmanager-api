# Projects Manager API

Projects Manager is an api that has an authentication system, in which it has registration, confirmation, password recovery and login by saving a JWT in a cookie, once registered the user can manage their projects and project tasks through of CRUD operations. It also has a collaborator system in which a user can see a project that is not a creator but is a collaborator, which allows them to see the tasks equally but can only complete them, but cannot edit or update tasks and projects. Finally, the api has a project search engine which has validations in which a user can only search for projects created by him or projects where he is a collaborator.

## 🚀 Getting Started

### Content

This project has only **master** branch. This project requires various configurations such as Mailtrap account and credentials to connect to postgresql database and JWT secret key. If you need help with this, you can email me at lukasmartinezc@gmail.com asking for help.

### Endpoints

Users: **/api/users/**

- POST **/** - Register a new user
- GET **/confirmed/:token** - Confirm if the token is valid to confirm the account
- POST **/forgot-password/** - The email of the user who forgot his password is indicated
- GET **/forgot-password/:token** - If the token is valid, the user will be able to create a new password
- POST **/forgot-password/:token** - User creates a new password
- POST **/login** - Authenticates a registered user
- POST **/login/remember-me** - Remember user at login
- GET **/profile** - Get user profile
- GET **/profile/logout** - Sign off

Projects: **/api/projects**

- GET **/** - Get all projects
- POST **/** - Create a project
- GET **/:id** - Get a single project
- PUT **/:id** - Update a project
- DELETE **/:id** - Delete a project
- POST **/collaborators** - Find a collaborator
- POST **/:id/collaborator** - Add a collaborator by project id
- GET **/:id/collaborator** - Get a collaborator by project id
- POST **/:id/delete-collaborator** - Delete a collaborator by project id
- GET **/:id/tasks** - Get all tasks in a project
- POST **/search-project** - Project search engine

Tasks: **/api/tasks**

- POST **/** - Create a task
- GET **/:id** - Get a task
- PUT **/:id** - Update a task
- DELETE **/:id** - Delete a task

## 🛠️ Technology Stack

This project was built using the following technologies:

- [Nodejs](https://nodejs.org/en/) - JavaScript Runtime
- [Express](https://expressjs.com/) - Framework for Nodejs
- [Sequelize](https://sequelize.org/) - ORM for Nodejs for SQL databases
- [Postgresql](https://www.postgresql.org/) - SQL database

---

Developed by [Lukas Martínez](https://github.com/LukasMartc)
