🏏 Cricket Tournament Management System
📌 Detailed Project Specification (Updated)
1️⃣ Project Objective and Overview
🎯 Goal

Build a web-based application to manage all cricket tournament activities using a centralized MongoDB database, replacing manual tracking.

🧩 Problem Statement

Manual management of tournaments:

Is time-consuming
Causes data errors
Makes tracking difficult
✅ Solution

We will develop a system where:

Users input data through web pages
Data is stored in MongoDB
Data can be easily retrieved and displayed
🎯 Core Purpose

The system will allow users to:

Add and manage teams and players
Schedule matches
Record scores
View tournament data efficiently
2️⃣ Technical Stack (Updated)
🖥 Frontend
HTML → Structure
CSS → Design
JavaScript → Send/receive data
⚙️ Backend
Node.js + Express.js
Handles API requests and logic
🗄 Database
MongoDB
Stores data in document format
🧱 Architecture
Frontend (HTML, CSS, JS)
        ↓
Backend (Node.js + Express)
        ↓
MongoDB
🔁 Data Flow
User fills a form (frontend)
JavaScript sends data using fetch()
Backend receives request
Backend stores/retrieves data from MongoDB
Response is sent back to frontend
3️⃣ Core Modules and Features
👥 Team Management
Add new teams
View team details
Store coach information
🧍 Player Management
Add players
Assign players to teams
Store roles (Batsman/Bowler/All-rounder)
📅 Match Management
Schedule matches
Select teams
Store date and venue
📊 Score Management
Enter match results
Store runs, wickets, overs
Record winner
🏆 Points Table (Optional but recommended)
Show matches played
Wins and losses
Calculate points automatically
4️⃣ Database Schema (MongoDB)
📁 teams
{
  "_id": ObjectId,
  "team_name": "Mumbai Indians",
  "coach": "Coach A"
}
📁 players
{
  "_id": ObjectId,
  "player_name": "Rohit Sharma",
  "age": 35,
  "role": "Batsman",
  "team_id": ObjectId
}
📁 matches
{
  "_id": ObjectId,
  "team1_id": ObjectId,
  "team2_id": ObjectId,
  "date": "2026-04-20",
  "venue": "Mumbai"
}
📁 scores
{
  "_id": ObjectId,
  "match_id": ObjectId,
  "team_id": ObjectId,
  "runs": 180,
  "wickets": 6,
  "overs": 20
}
🔗 Relationships
Use ObjectId references to link collections
Similar to foreign keys in SQL
5️⃣ API Endpoints
📥 POST APIs
/addTeam → Add team
/addPlayer → Add player
/addMatch → Schedule match
/addScore → Add score
📤 GET APIs
/teams → Get teams
/players → Get players
/matches → Get matches
🔄 Optional
PUT → Update data
DELETE → Remove data
6️⃣ Frontend Structure
Pages:
index.html → Home
add_team.html
add_player.html
schedule_match.html
enter_score.html
view_data.html
What frontend will do:
Take input using forms
Send data using JavaScript (fetch)
Display data using tables
7️⃣ Implementation Plan
🔹 Phase 1: Planning
Understand requirements
Divide work among team
🔹 Phase 2: Frontend Design
Create HTML pages
Add forms and basic styling
Use dummy data for layout
🔹 Phase 3: Backend Development
Setup Node.js + Express server
Connect to MongoDB
Create API endpoints
🔹 Phase 4: Integration
Connect frontend to backend using fetch()
Test all forms and data flow
🔹 Phase 5: Testing
Add sample data
Verify:
Data insertion
Data retrieval
Correct outputs
8️⃣ Key Functionalities (CRUD)
Create → Add teams, players, matches
Read → View stored data
Update → Modify data (optional)
Delete → Remove records (optional)
🎯 Conclusion

This project demonstrates:

Database management using MongoDB
Backend API development
Frontend-backend integration
Real-world application of DBMS