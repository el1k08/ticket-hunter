## To Start

```json
npm install 
npm run start
```
or
```json
yarn install
yarn start
```

## Config file

~/config/default.json

## Routers
| Routes            | Type    | Query         |  Auth Token | Descriptions                                  |
| ----------------- | ------- | ------------- | ----------- | --------------------------------------------- |
| /api/users        | POST    |               |             | Creating a new user                           |
| /api/users/me     | PUT     |               | TRUE        | Edit user                                     |
| /api/users/me     | DELETE  |               | TRUE        | Remove user                                   |
| /api/auth         | POST    |               |             | Authorization                                 |
| /api/flights      | POST    |               | TRUE        | Create new flight                             |
| /api/flights/:id  | PUT     |               | TRUE        | Edit flight                                   |
| /api/flights/:id  | DELETE  |               | TRUE        | Remove flight                                 |
| /api/flights      | GET     |               |             | List of all flights                           |
|                   | GET     | date          |             | List of flights with the same date            |
|                   | GET     | to            |             | List of flights by destination                |
|                   | GET     | from          |             | List of flights by departure                  |
|                   | GET     | to & from     |             | List of flights by destination & departure    |
| /api/flights/:id  | GET     |               |             | Flight by flightID                            |


### User Schema example


```json
{
  "image": "photo.png",
  "firstName": "Nik",
  "lastName": "Shalom",
  "email": "nik.shalom@gmail.com",
  "password": "qwerty12345",
  "role": "ADMIN"
}
```

### Flight Schema example

```json
{
  "flightID": "TLVNEWY2021",
  "direction": {
      "from": { 
          "airport": "TLV",
          "date": 1616065502000
      },
      "to": { 
          "airport": "New York",
          "date": 1616108702000
      }
  },
  "price": "844",
  "aircraft": "Boing 777"
}
```