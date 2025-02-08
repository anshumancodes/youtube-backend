# YouTube Backend Clone

A robust backend API that replicates core YouTube functionalities, built with Node.js, Express, and MongoDB.

## 🚀 Features

- User authentication and authorization
- Video upload and management
- Channel management
- Community posts
- Watch history tracking
- File upload handling for avatars, cover images, and video thumbnails
- Refresh token mechanism
- Docker support

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Container**: Docker
- **File Storage**: [Add your storage solution here, e.g., AWS S3, Local filesystem]
- **Authentication**: JWT (JSON Web Tokens)

## 🏁 Getting Started

### Prerequisites

- Node.js 14.0 or higher
- MongoDB instance
- Docker (optional)
- Environment variables configured (see Configuration section)

### Local Installation

1. Clone the repository:
```bash
git clone https://github.com/anshumancodes/youtube-backend
cd youtube-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Start the server:
```bash
npm run server
```

### 🐳 Docker Deployment

1. Build the image:
```bash
docker build -t youtube-backend .
```

2. Run the container:
```bash
docker run -p <port_you_want>:3000 --env-file .env youtube-backend
```

3. Verify the running container:
```bash
docker ps
```

4. Stop the container:
```bash
docker stop <container_id>
```

## 🔑 Configuration

Create a `.env` file with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
# Add other required environment variables
```

## 📚 API Documentation

### User Management

Base URL: `/api/v0/user`

| Endpoint | Method | Description | Auth Required | File Upload |
|----------|---------|-------------|---------------|-------------|
| `/register` | POST | Create new user account | No | `avatar`, `coverImage` |
| `/login` | POST | Authenticate user | No | - |
| `/logout` | POST | End user session | Yes | - |
| `/refreshtoken` | POST | Get new access token | No | - |
| `/change-password` | POST | Update password | Yes | - |
| `/get-user` | GET | Get user profile | Yes | - |
| `/update-avatar` | PATCH | Update profile picture | Yes | `avatar` |
| `/update-coverimage` | PATCH | Update cover image | Yes | `coverImage` |
| `/channel/:username` | GET | Get channel info | Yes | - |
| `/get-watch-history` | GET | Get user's watch history | Yes | - |

### Video Management

Base URL: `/api/v0/video`

| Endpoint | Method | Description | Auth Required | File Upload |
|----------|---------|-------------|---------------|-------------|
| `/upload` | POST | Upload new video | Yes | `videoFile`, `thumbnail` |
| `/play/:videoId` | GET | Stream video | No | - |
| `/update/:videoId` | PUT | Update video details | Yes | `thumbnail` |
| `/delete/:videoId` | DELETE | Remove video | Yes | - |

### Community Posts

Base URL: `/api/v0/post`

| Endpoint | Method | Description | Auth Required |
|----------|---------|-------------|---------------|
| `/compose` | POST | Create post | Yes |
| `/posts` | GET | Get user's posts | Yes |
| `/update/:postId` | PUT | Edit post | Yes |
| `/delete/:postId` | DELETE | Remove post | Yes |

## 🧪 Testing

The API is deployed at: [https://youtube-backend-1ybt.onrender.com](https://youtube-backend-1ybt.onrender.com)
> Note: Initial request may have a 50-second delay due to cold start

## 📖 Additional Resources

- [Project Blog Post](https://anshumancdx.xyz/blog/Building_youtube_api_project)




## 📫 Connect with me

- Email: [anshumanprof01@gmail.com](mailto:anshumanprof01@gmail.com)
- Twitter: [@anshumancdx](https://x.com/anshumancdx)


