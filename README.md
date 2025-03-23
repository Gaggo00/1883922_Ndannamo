# 🌍 Ndannamo — Where are we going

**Ndannamo** is a collaborative web application that simplifies and centralizes the process of planning trips with friends.  

It has been realized as a project for the Laboratory of Advance Programming course from the master's degree in Engineering in Computer Science at the university "La Sapienza" of Rome.


---

## 🚀 Features

- 🗓️ Day-by-day itinerary planning  
- 💬 Real-time group chat  
- 💸 Expense splitting and tracking  
- 📷 Upload and view bookings, photos, and maps  
- 🌦️ Live weather forecast  
- 🌍 City info with images and coordinates

---

## 🔧 Architecture

Ndannamo uses a **microservices-based architecture** orchestrated via Docker Compose, including:

- **Frontend:** `React` (JavaScript)
- **Backend Microservices:** `Spring Boot` (Java)
  - `authentication`: login and registration
  - `backend`: profile, trips, schedule, expenses, photos
  - `chat`: group messaging
  - `cities`: city data
- **Databases (PostgreSQL):**
  - `Postgres_main`: users, trips, expenses, photos
  - `Postgres_chat`: chat messages
  - `Postgres_cities`: city metadata

### External APIs

- 📍 **LocationIQ** — for geocoding addresses  
- 🗺️ **OpenStreetMap** — for map rendering  
- 🌤️ **MeteoMatics** — for weather forecasts

---

## 📦 Tech Stack

| Layer           | Technology                  |
|----------------|------------------------------|
| Frontend        | React (JavaScript)           |
| Backend         | Spring Boot (Java)           |
| Databases       | PostgreSQL                   |
| API Integration | LocationIQ, MeteoMatics, OpenStreetMap |
| DevOps          | Docker, Docker Compose       |

---

## 👥 Team

Alessandro Monteleone (Scrum Master) 1883922

Anna Carini 1771784

Jacopo Fabi 1809860

Gavriel Di Nepi 2067753

---
## ▶️ Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

```bash
git clone https://github.com/your-org/ndannamo.git
cd ndannamo
docker-compose up --build


