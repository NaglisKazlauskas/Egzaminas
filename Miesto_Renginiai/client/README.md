# Event Sharing Website Client

This is the client-side of the Event Sharing Website project built with React and Bootstrap. The application allows users to share and manage events.

## Project Structure

- **public/index.html**: The main HTML file for the React application.
- **src/components/**: Contains React components for different functionalities:
  - **AdminDashboard.jsx**: Interface for admin users to manage events.
  - **EventList.jsx**: Displays a list of events shared by users.
  - **UserLogin.jsx**: Allows users to log in to the website.
- **src/App.jsx**: The main component that sets up routing and includes other components.
- **src/index.js**: Entry point for the React application that renders the App component.
- **src/styles/bootstrap-custom.css**: Custom styles that override or extend Bootstrap styles.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd event-sharing-website/client
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Future Development

- Implement user authentication and authorization.
- Connect to the backend server for event management.
- Enhance UI/UX with additional features and styles.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.