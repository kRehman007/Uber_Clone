# User API Documentation

## Endpoints

### 1. Register User

**URL:** `/users/register`

**Method:** `POST`

**Description:** Registers a new user.

**Request Data:**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response Data:**

- **Status Code:** `200 OK`
  ```json
  {
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "password": "hashed_password",
      "socketID": null
    },
    "message": "registration done successfully"
  }
  ```
- **Status Code:** `400 Bad Request`
  ```json
  {
    "error": "All fields are required."
  }
  ```
- **Status Code:** `409 Conflict`
  ```json
  {
    "error": "Email already exists"
  }
  ```
- **Status Code:** `500 Internal Server Error`
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

### 2. Login User

**URL:** `/users/login`

**Method:** `POST`

**Description:** Logs in an existing user.

**Request Data:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response Data:**

- **Status Code:** `201 Created`
  ```json
  {
    "token": "jwt_token",
    "message": "login successfully"
  }
  ```
- **Status Code:** `401 Unauthorized`
  ```json
  {
    "error": "Invalid email or password"
  }
  ```
- **Status Code:** `500 Internal Server Error`
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

### 3. Get User Profile

**URL:** `/users/profile`

**Method:** `GET`

**Description:** Retrieves the profile of the authenticated user.

**Request Headers:**

- `Authorization: Bearer jwt_token`

**Response Data:**

- **Status Code:** `200 OK`
  ```json
  {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketID": null
  }
  ```
- **Status Code:** `401 Unauthorized`
  ```json
  {
    "error": "user is unauthorized"
  }
  ```

### 4. Logout User

**URL:** `/users/logout`

**Method:** `GET`

**Description:** Logs out the authenticated user.

**Response Data:**

- **Status Code:** `200 OK`
  ```json
  {
    "message": "You are logged out"
  }
  ```

## Captain API Documentation

### 1. Register Captain

**URL:** `/captains/register`

**Method:** `POST`

**Description:** Registers a new captain.

**Request Data:**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "color": "red",
  "plate": "ABC123",
  "capacity": 4,
  "vehicleType": "car"
}
```

**Response Data:**

- **Status Code:** `201 Created`
  ```json
  {
    "message": "captain registered successfully",
    "createdCaptain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "password": "hashed_password",
      "socketID": null,
      "status": "inactive",
      "vehicle": {
        "color": "red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      },
      "location": {
        "lat": null,
        "lng": null
      }
    }
  }
  ```
- **Status Code:** `400 Bad Request`
  ```json
  {
    "error": "All fields are required."
  }
  ```
- **Status Code:** `409 Conflict`
  ```json
  {
    "error": "captain already exists"
  }
  ```
- **Status Code:** `500 Internal Server Error`
  ```json
  {
    "error": "Internal server error"
  }
  ```

### 2. Login Captain

**URL:** `/captains/login`

**Method:** `POST`

**Description:** Logs in an existing captain.

**Request Data:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response Data:**

- **Status Code:** `201 Created`
  ```json
  {
    "token": "jwt_token",
    "message": "login successfully"
  }
  ```
- **Status Code:** `401 Unauthorized`
  ```json
  {
    "error": "Invalid email or password"
  }
  ```
- **Status Code:** `500 Internal Server Error`
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

### 3. Get Captain Profile

**URL:** `/captains/profile`

**Method:** `GET`

**Description:** Retrieves the profile of the authenticated captain.

**Request Headers:**

- `Authorization: Bearer jwt_token`

**Response Data:**

- **Status Code:** `200 OK`
  ```json
  {
    "_id": "captain_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketID": null,
    "status": "inactive",
    "vehicle": {
      "color": "red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": {
      "lat": null,
      "lng": null
    }
  }
  ```
- **Status Code:** `401 Unauthorized`
  ```json
  {
    "error": "captain is unauthorized"
  }
  ```

### 4. Logout Captain

**URL:** `/captains/logout`

**Method:** `GET`

**Description:** Logs out the authenticated captain.

**Response Data:**

- **Status Code:** `200 OK`
  ```json
  {
    "message": "You are logged out"
  }
  ```

## Notes

- Ensure to include the JWT token in the `Authorization` header for protected routes.
- Passwords are hashed before storing in the database.
