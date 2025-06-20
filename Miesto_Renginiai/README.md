# Event Sharing Website

This project is a web application designed for users to share and manage events. It consists of a client-side built with React and a server-side built with Node.js and Express, using a MySQL database for data storage.

## Project Structure

The project is organized into two main directories: `client` and `server`.

### Client

The client-side of the application is built using React and Bootstrap. It includes the following components:

- **AdminDashboard**: An interface for admin users to manage events.
- **EventList**: Displays a list of events shared by users.
- **UserLogin**: Allows users to log in to the website.

#### Directory Structure

```
client
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── AdminDashboard.jsx
│   │   ├── EventList.jsx
│   │   └── UserLogin.jsx
│   ├── App.jsx
│   ├── index.js
│   └── styles
│       └── bootstrap-custom.css
├── package.json
└── README.md
```

### Server

The server-side of the application is built using Node.js and Express. It handles API requests related to event management.

#### Directory Structure

```
server
├── src
│   ├── controllers
│   │   └── eventsController.js
│   ├── routes
│   │   └── events.js
│   ├── app.js
│   └── config
│       └── db.js
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MySQL server running (using XAMPP)

### Client Setup

1. Navigate to the `client` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Server Setup

1. Navigate to the `server` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   node src/app.js
   ```

## Usage

- Users can log in to the website using the UserLogin component.
- Admin users can manage events through the AdminDashboard component.
- All users can view the list of events using the EventList component.

## Future Enhancements

- Implement user authentication and authorization.
- Set up the MySQL database and integrate it with the server.
- Add features for users to create, update, and delete their events.

## License

This project is licensed under the MIT License.