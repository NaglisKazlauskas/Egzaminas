# Event Sharing Website - Server

This is the server-side of the Event Sharing Website project. The server is built using Node.js and Express, and it is designed to handle API requests related to event management.

## Project Structure

- **src/**: Contains the source code for the server.
  - **controllers/**: Contains the logic for managing events.
    - `eventsController.js`: Handles event-related operations.
  - **routes/**: Defines the API endpoints for the application.
    - `events.js`: Contains routes for event management.
  - `app.js`: The main entry point for the server application.
  - **config/**: Configuration files for the server.
    - `db.js`: Database connection configuration.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd event-sharing-website/server
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the server**:
   ```
   npm start
   ```

4. **Access the API**:
   The server will be running on `http://localhost:3000` (or the port specified in your configuration).

## Note

Currently, the server is set up to work without a MySQL database. You can implement the database connection later when it is ready.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.