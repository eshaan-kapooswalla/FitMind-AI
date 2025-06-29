# FitMind Frontend

A modern, responsive React application for the FitMind fitness platform. Built with React 18, Vite, Tailwind CSS, and connected to a Spring Boot microservices backend.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: Secure login with mock authentication (ready for Keycloak integration)
- **Activity Tracking**: Comprehensive activity management with CRUD operations
- **AI Recommendations**: Personalized fitness recommendations and insights
- **Real-time Updates**: Live data updates with React Context
- **Form Validation**: Robust form handling with React Hook Form
- **Toast Notifications**: User feedback with react-hot-toast
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Type Safety**: Built with modern JavaScript and PropTypes

## 🛠 Tech Stack

- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling and validation
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Date-fns** - Date manipulation utilities

## 📦 Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd fitness-app-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=FitMind
```

### Backend Connection

The frontend is configured to connect to the Spring Boot backend via proxy in development:

- **Development**: Proxy to `http://localhost:8080` (configured in `vite.config.js`)
- **Production**: Set `VITE_API_BASE_URL` environment variable

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with sidebar
│   ├── Header.jsx      # Top navigation header
│   ├── Sidebar.jsx     # Side navigation
│   └── ProtectedRoute.jsx # Authentication wrapper
├── contexts/           # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── ActivityContext.jsx # Activity data management
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Login.jsx       # Authentication page
│   ├── Activities.jsx  # Activity list and management
│   ├── AddActivity.jsx # Activity creation form
│   ├── Recommendations.jsx # AI recommendations
│   └── Profile.jsx     # User profile management
├── services/           # API service layer
│   ├── activityService.js # Activity API calls
│   └── recommendationService.js # Recommendations API calls
├── App.jsx             # Main app component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`primary-600` to `primary-700`)
- **Fitness**: Green gradient (`fitness-600` to `fitness-700`)
- **Neutral**: Gray scale for text and backgrounds

### Components
- **Cards**: Consistent card styling with shadows and borders
- **Buttons**: Primary and secondary button variants
- **Forms**: Styled form inputs with focus states
- **Icons**: Lucide React icons throughout the app

## 🔌 API Integration

### Activity Service
- `GET /api/activities` - Fetch user activities
- `POST /api/activities` - Create new activity
- `PUT /api/activities/{id}` - Update activity
- `DELETE /api/activities/{id}` - Delete activity
- `GET /api/activities/stats/{userId}` - Get user statistics

### Recommendation Service
- `GET /api/recommendations/user/{userId}` - Get user recommendations
- `POST /api/recommendations/generate/{userId}` - Generate new recommendations
- `GET /api/recommendations/insights/{userId}` - Get user insights
- `GET /api/recommendations/trends/{userId}` - Get user trends

## 🚀 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Code Style

- **ESLint**: Configured for React best practices
- **Prettier**: Code formatting (recommended)
- **Components**: Functional components with hooks
- **State Management**: React Context for global state

## 🔐 Authentication

Currently using mock authentication for development:

- **Login**: Any email/password combination works
- **Session**: Stored in localStorage
- **Protected Routes**: Automatically redirect to login

### Integration with Keycloak

To integrate with Keycloak:

1. Update `AuthContext.jsx` to use Keycloak authentication
2. Configure OAuth2 settings in the backend
3. Update API calls to include proper JWT tokens

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile**: Single column layout with collapsible sidebar
- **Tablet**: Two-column layout with sidebar
- **Desktop**: Full layout with persistent sidebar

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# The built files will be in the `dist/` directory
```

## 🚀 Deployment

### Static Hosting (Netlify, Vercel, etc.)

1. Build the application: `npm run build`
2. Deploy the `dist/` directory
3. Configure environment variables for production API

### Docker Deployment

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the backend API documentation
- Review the component documentation
- Open an issue in the repository 