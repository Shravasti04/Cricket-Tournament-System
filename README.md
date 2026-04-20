# 🏏 Cricket Tournament Management System

A comprehensive, web-based application designed to streamline the management of cricket tournaments. This system replaces manual tracking with an automated, data-driven approach, providing seamless management for teams, players, schedules, and live scoring.

## ✨ Features

- **Tournament Management**: Register and manage multiple ongoing tournaments.
- **Team & Player Registration**: Create teams, assign coaches, and enroll players with specific roles (Batsman, Bowler, All-rounder) directly into tournaments.
- **Match Scheduling**: Schedule upcoming matches with detailed date and venue tracking.
- **Live Score Logging**: Log innings scores, wickets, and overs dynamically.
- **Dynamic Dashboard**: View all data categorized seamlessly. Select a tournament to view relevant matches, teams, and players.
- **Automated Points Table**: The system automatically calculates Wins, Losses, and Points based on match scores using advanced MongoDB aggregations.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Variables, CSS Grid/Flexbox), Vanilla JavaScript (ES6+ with Fetch API)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed (v14 or higher)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI.

### Installation

1. **Clone the repository** (or download the source):
   ```bash
   git clone <your-repository-url>
   cd "Cricket Tournament System"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and configure your MongoDB connection:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/cricket_tournament
   ```

4. **Start the server**:
   ```bash
   npm run dev
   # or
   node server.js
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:5000`

## 📂 Project Structure

```
├── models/
│   ├── Match.js
│   ├── Player.js
│   ├── Score.js
│   ├── Team.js
│   └── Tournament.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   ├── index.html
│   ├── add_tournament.html
│   ├── add_team.html
│   ├── add_player.html
│   ├── schedule_match.html
│   ├── enter_score.html
│   ├── points_table.html
│   └── view_data.html
├── routes/
│   └── api.js
├── .env
├── package.json
└── server.js
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the MIT License.
