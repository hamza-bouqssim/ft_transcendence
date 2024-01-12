# ft_transcendance  
Welcome to ft_transcendance, a unique web application that combines the thrill of virtual ping-pong gaming with real-time conversation. This project is not just about playing a game; it's an immersive experience where players can engage in lively conversations while enjoying intense matches. The project features multi-authentication, including Local Authentication, Google Authentication, and 42 Authentication, ensuring a seamless and secure user experience. In addition, we've enhanced the security measures with the implementation of a robust Two-Factor Authentication (2FA) system.

### Features
#### 1. Virtual Ping-Pong Gaming
Experience the excitement of playing virtual ping-pong with your friends in real-time. Our game mechanics provide a dynamic and engaging gaming experience.

#### 2. Real-Time Chat System
Engage in conversations with your opponents or fellow players through our integrated real-time chat system. Share strategies, exchange banter, and make the gaming experience more social.

#### 3. Multi-Authentication
Choose your preferred authentication method. Whether it's the convenience of Local Authentication, the familiarity of Google Authentication, or the seamless integration with 42 Authentication, we've got you covered.

#### 4. Two-Factor Authentication (2FA)
Security is a top priority. Our implementation of a Two-Factor Authentication system adds an extra layer of protection to ensure that your account remains secure.

# Getting Started
### 1. To get started with ft_transcendance, follow these simple steps:

Clone the repository:

```bash
git clone git@github.com:hamza-bouqssim/ft_transcendence.git
```
## Environment Variables Setup

### Frontend Directory

In the `frontend` directory, create a `.env.local` file and add the following:

```env
NEXT_PUBLIC_HOST=http://localhost:8000

NEXT_PUBLIC_CLOUD_PRESET=
NEXT_PUBLIC_CLOUD_NAME=
NEXT_PUBLIC_CLOUD_ENDPOINT=
```

### Backend Directory
In the backend directory, create a .env file and add the following:

```env
DATABASE_URL=
COOKIE_SECRET=
S_2FA=
ROOT_FRONT=http://localhost:3000
ROOT_BACK=http://localhost:8000

# Google strategy
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALL_BACK_URL=

# 42 strategy
INTRA_CLIENT_ID=
INTRA_CLIENT_SECRET=
INTRA_CALL_BACK_URL=
```

### Root Directory
In the root directory, add the following to your existing .env file:

```env
DATABASE_URL=
PORT=8000
```

# Run The Project 
#### NOTE: You must have docker installed in your machine !

Open terminel and Run the following Command:

```shell
docker compose up --build
```

## OR

## Make Commands
To make your life easier, we've provided some handy Docker commands:
- `make build`: Build the Docker containers.
- `make up`: Start the Docker containers.
- `make down`: Stop and remove the Docker containers.
- `make bash-api`: Open a bash shell in the API container.
- `make bash-frontend`: Open a bash shell in the Frontend container.
- `make bash-postgres`: Open a bash shell in the PostgreSQL container.
- `make remove-images`: Remove all Docker images.
- `make remove-volumes`: Remove all Docker volumes.

### for windows
```
sed -i 's/\r$//' init.sh
```

### for prisma studio 

```
make bash-api
```

```
npx prisma studio
```

