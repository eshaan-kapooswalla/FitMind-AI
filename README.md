# FitMind AI - Your Personal Fitness Companion 🏃‍♂️💪

A comprehensive fitness application powered by **Google Gemini AI** that provides personalized workout plans, nutrition advice, progress analysis, and motivational coaching. Built with Spring Boot microservices and React frontend.

## 🌟 AI-Powered Features

### 🤖 **Gemini AI Integration**
FitMind leverages Google's Gemini AI to provide intelligent, personalized fitness guidance:

- **🧠 Smart Workout Planning**: AI-generated 7-day personalized workout plans based on your fitness level, goals, and preferences
- **🍎 Nutrition Intelligence**: Personalized nutrition advice for pre/post workout meals, hydration, and supplements
- **📊 Progress Analysis**: AI-powered analysis of your fitness journey with actionable insights and trends
- **💪 Motivational Coaching**: Daily personalized motivational messages and mindset guidance
- **🛡️ Injury Prevention**: Comprehensive safety advice and proper technique guidance
- **👥 Social Fitness**: AI-suggested local groups, challenges, and fitness events

### 🎯 **Core AI Capabilities**

#### **1. Personalized Workout Plans**
- 7-day customized workout schedules
- Exercise variety and progression recommendations
- Rest day optimization
- Difficulty level adjustments
- Equipment recommendations

#### **2. Intelligent Nutrition Guidance**
- Pre-workout meal timing and food suggestions
- Post-workout recovery nutrition
- Hydration strategies
- Supplement recommendations
- Dietary restriction accommodations

#### **3. Advanced Progress Analytics**
- Performance trend analysis
- Strength and weakness identification
- Milestone tracking
- Goal achievement predictions
- Personalized improvement recommendations

#### **4. Motivational AI Coaching**
- Daily inspirational messages
- Goal-oriented encouragement
- Mindset development
- Actionable daily tasks
- Quote-based motivation

#### **5. Safety & Injury Prevention**
- Warm-up routine generation
- Proper technique guidance
- Common mistake identification
- Recovery and stretching advice
- Equipment safety guidelines

#### **6. Social Fitness Integration**
- Local fitness group recommendations
- Challenge suggestions
- Event discovery
- Community engagement tips

## 🏗️ **Architecture**

### **Microservices Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  Config Server  │    │   Monitoring    │
│   (Port 8080)   │    │   (Port 8888)   │    │  (Prometheus)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Service   │    │ Activity Service│    │   AI Service    │
│   (Port 8081)   │    │   (Port 8082)   │    │   (Port 8083)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │    MongoDB      │    │   RabbitMQ      │
│   (Port 5432)   │    │   (Port 27017)  │    │   (Port 5672)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Technology Stack**

#### **Backend Services**
- **Spring Boot 3.x** - Microservices framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA/MongoDB** - Data persistence
- **Spring Cloud** - Service discovery & configuration
- **RabbitMQ** - Message queuing
- **Google Gemini AI** - AI-powered recommendations
- **Keycloak** - Identity and access management

#### **Frontend**
- **React 18** - User interface
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

#### **Infrastructure**
- **Docker & Docker Compose** - Containerization
- **PostgreSQL** - Primary database
- **MongoDB** - Document storage
- **Redis** - Caching
- **Prometheus** - Monitoring
- **Grafana** - Visualization

## 🚀 **Quick Start**

### **Prerequisites**
- Docker & Docker Compose
- Node.js 18+ (for frontend development)
- Java 17+ (for backend development)
- Google Gemini AI API Key

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd fitMind-ai-
```

### **2. Environment Setup**
Create a `.env` file in the root directory:
```env
# Gemini AI Configuration
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
GEMINI_API_KEY=your_gemini_api_key_here

# Database Configuration
POSTGRES_DB=fitnessapp
POSTGRES_USER=fitnessuser
POSTGRES_PASSWORD=fitnesspass

# MongoDB Configuration
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password

# RabbitMQ Configuration
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
```

### **3. Start the Application**
```bash
# Start all services with Docker Compose
docker-compose up -d

# Wait for services to be ready (2-3 minutes)
```

### **4. Access the Application**
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Grafana Dashboard**: http://localhost:3001
- **Prometheus**: http://localhost:9090

## 📱 **Features Overview**

### **Dashboard**
- Real-time fitness metrics
- AI-generated insights
- Progress visualization
- Quick action buttons

### **Activities**
- Track workout sessions
- AI-powered activity analysis
- Performance metrics
- Historical data

### **AI Coaching** 🤖
- **Workout Planning**: Personalized 7-day plans
- **Nutrition Advice**: Meal timing and food recommendations
- **Progress Analysis**: AI-driven insights and trends
- **Motivation**: Daily inspirational messages
- **Injury Prevention**: Safety guidelines and techniques
- **Social Features**: Local groups and challenges

### **Recommendations**
- AI-generated fitness suggestions
- Personalized improvement tips
- Goal-oriented recommendations
- Progress-based insights

### **Profile**
- User preferences
- Fitness goals
- Achievement tracking
- Settings management

## 🔧 **API Endpoints**

### **AI Service Endpoints** (`/api/ai`)
```http
POST /api/ai/recommendations          # Generate activity recommendations
GET  /api/ai/recommendations/{userId} # Get user recommendations
POST /api/ai/workout-plan            # Generate personalized workout plan
POST /api/ai/nutrition-advice        # Get nutrition guidance
POST /api/ai/progress-analysis       # Analyze fitness progress
POST /api/ai/motivation              # Generate motivational messages
POST /api/ai/injury-prevention       # Get safety advice
POST /api/ai/social-features         # Find social opportunities
POST /api/ai/personalized-coaching   # Comprehensive AI coaching
```

### **Activity Service Endpoints** (`/api/activities`)
```http
GET    /api/activities              # Get user activities
POST   /api/activities              # Create new activity
GET    /api/activities/{id}         # Get specific activity
PUT    /api/activities/{id}         # Update activity
DELETE /api/activities/{id}         # Delete activity
```

## 🧠 **AI Features Deep Dive**

### **1. Smart Workout Generation**
The AI analyzes your:
- Current fitness level
- Available equipment
- Time constraints
- Previous workout history
- Personal goals

**Example AI Response:**
```json
{
  "plan": {
    "name": "Intermediate Strength & Cardio Plan",
    "days": [
      {
        "day": 1,
        "name": "Upper Body Strength",
        "exercises": [
          {
            "name": "Push-ups",
            "sets": 3,
            "reps": "10-15",
            "rest": "60 seconds"
          }
        ]
      }
    ]
  }
}
```

### **2. Intelligent Nutrition Planning**
AI considers:
- Activity type and intensity
- Caloric expenditure
- Dietary restrictions
- Meal timing
- Hydration needs

### **3. Progress Intelligence**
AI analyzes patterns in:
- Workout frequency
- Performance improvements
- Plateaus and setbacks
- Goal progression
- Recovery patterns

### **4. Motivational AI**
Personalized motivation based on:
- Current mood
- Recent achievements
- Goal proximity
- Historical patterns
- Personal preferences

## 🔒 **Security Features**
- JWT-based authentication
- Role-based access control
- API rate limiting
- Secure password hashing
- CORS configuration
- Input validation

## 📊 **Monitoring & Analytics**
- Real-time service health monitoring
- Performance metrics
- Error tracking
- User activity analytics
- AI recommendation effectiveness

## 🛠️ **Development**

### **Backend Development**
```bash
# Start individual services
cd activityservice && ./mvnw spring-boot:run
cd aiservice && ./mvnw spring-boot:run
cd gateway && ./mvnw spring-boot:run
```

### **Frontend Development**
```bash
cd fitness-app-frontend
npm install
npm run dev
```

### **Testing**
```bash
# Backend tests
./mvnw test

# Frontend tests
npm test
```

## 🤝 **Contributing**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request



## 🙏 **Acknowledgments**
- Google Gemini AI for intelligent fitness recommendations
- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- The fitness community for inspiration and feedback

---

**Ready to transform your fitness journey with AI? Start FitMind today! 🚀** 
