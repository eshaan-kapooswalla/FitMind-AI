# FitMInd-ai

FitMInd-ai is a modern, AI-powered fitness and wellness platform built with a microservices architecture. It helps users track activities, receive personalized recommendations, and improve their physical and mental well-being.

## Features
- Activity tracking (running, walking, cycling, and more)
- AI-driven recommendations for improvement
- User authentication and secure access
- Real-time analytics and progress tracking
- Microservices-based scalable backend
- Modern, responsive React frontend
- Monitoring and observability with Prometheus and Grafana

## Tech Stack
- React (Vite) frontend
- Spring Boot microservices (Java)
- MongoDB, PostgreSQL
- RabbitMQ
- Keycloak (OAuth2 authentication)
- Docker & Docker Compose

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 17+ and Maven (for backend development)
- Node.js 18+ and npm (for frontend development)

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/eshaan-kapooswalla/FitMInd-ai.git
   cd FitMInd-ai
   ```
2. **Start infrastructure services:**
   ```bash
   docker-compose up -d
   ```
3. **Start backend microservices:**
   ```bash
   cd activityservice && ./mvnw spring-boot:run
   # In new terminals, repeat for aiservice, gateway, configserver, etc.
   ```
4. **Start the frontend:**
   ```bash
   cd fitness-app-frontend
   npm install
   npm run dev
   ```
5. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Keycloak: [http://localhost:8181](http://localhost:8181)
   - RabbitMQ: [http://localhost:15672](http://localhost:15672)
   - Prometheus: [http://localhost:9090](http://localhost:9090)
   - Grafana: [http://localhost:3000](http://localhost:3000)

## Project Structure
```
FitMInd-ai/
├── activityservice/         # Activity microservice (Spring Boot)
├── aiservice/              # AI recommendation microservice (Spring Boot)
├── configserver/           # Spring Cloud Config server
├── gateway/                # API Gateway (Spring Boot)
├── fitness-app-frontend/   # React frontend
├── docker-compose.yml      # Multi-service orchestration
└── README.md               # Project documentation
```

## Contributing
Contributions are welcome! Please open issues and submit pull requests for improvements or bug fixes.

## License
This project is licensed under the MIT License. 