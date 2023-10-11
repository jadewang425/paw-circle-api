# PawCircle

An app for all the pet owners to plan meetups for their pets to meet friends! It allows users to create their profiles and meetups, or join meetups created by the others!

[Screenshot]

## User Stories
AAU, I want to...
- be able to sign in and out
- see a main page of all the active meetups
- filter the meetups by type of pet on the meetup page
- create a meetup and add my pet(s) 
- join a meetup created by other people
- edit my meetups
- delete my meetups with a delete confirmation Modal
- see a page of my profile that shows my pets
- add pets to my profile
- edit pets on my profile
- archive my pets 😢

### Ice Box
- add geolocation to see the meetup location
- add post feature to share pet pictures
- receive an email notification a day before the meetup I created or joined


## Technologies Used
- Express.js
- Mongoose
- MongoDB
- JavaScript

## API
### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/`    | `users#changepw`  |
| DELETE | `/sign-out/`           | `users#signout`   |

### Users

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/pawrent/<user_id>`   | `meetups#show`    |

### Pets

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| GET    | `/pets`                | `pets#index`      |
| GET    | `/pets/<pet_id>`       | `pets#show`       |
| POST   | `/pets`                | `pets#create`     |
| PATCH  | `/pets/<pet_id>`       | `pets#update`     |
| DELETE | `/pets/<pet_id>`       | `pets#delete`     |

### Meetups

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| GET    | `/meetups`             | `meetups#index`   |
| GET    | `/meetups/<meetup_id>` | `meetups#show`    |
| POST   | `/meetups`             | `meetups#create`  |
| PATCH  | `/meetups/<meetup_id>` | `meetups#update`  |
| DELETE | `/meetups/<meetup_id>` | `meetups#delete`  |

### Comments

| Verb   | URI Pattern                         | Controller#Action |
|--------|-------------------------------------|-------------------|
| POST   | `/meetups/<meetup_id>`              | `comments#create` |
| PATCH  | `/meetups/<meetup_id>/<comment_id>` | `comments#update` |
| DELETE | `/meetups/<meetup_id>/<comment_id>` | `comments#delete` |



## ERD
![layout wireframe](https://i.imgur.com/cNTlUjb.png)