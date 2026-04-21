# Mini Project Report: Cricket Tournament Management System

## 1. Introduction
Database Management Systems (DBMS) form the backbone of modern software applications by ensuring data is stored securely, retrieved efficiently, and maintained consistently. In sports management, particularly in cricket tournaments, vast amounts of data including team rosters, match schedules, and ball-by-ball scores are generated. The traditional manual method of tracking this information using spreadsheets or physical ledgers is highly prone to human error, difficult to scale, and makes statistical analysis cumbersome. 

The purpose of this project is to design and develop a web-based Cricket Tournament Management System that digitizes this process. The system provides a centralized platform to manage multiple tournaments concurrently, register teams and players, schedule matches, and record match outcomes. By leveraging a NoSQL database (MongoDB), the solution overcomes the limitations of manual systems, offering real-time data filtering, dynamic points table generation, and structured dashboards for intuitive data visualization.

## 2. Scope
The scope of this project encompasses the end-to-end management of local cricket tournaments. It is designed to be utilized by sports clubs, school administrations, and local event organizers who require a reliable digital tool to orchestrate league matches. The system successfully handles the core entities of tournament management: Tournaments, Teams, Players, Matches, and Scores. 

While the system is robust for its intended use case, it currently operates with certain limitations. It is designed primarily as an administrative portal and does not currently feature distinct user authentication roles (such as separating Admin vs. Public Viewer). Furthermore, the scoring system records the final match summary (runs, wickets, and overs) rather than granular, live ball-by-ball tracking. These limitations keep the project realistic and focused on core DBMS principles while leaving room for future scalability.

## 3. Requirements

### Functional Requirements
The system provides a comprehensive suite of features to ensure smooth tournament operations. It allows users to create and manage multiple distinct tournaments. Users can register participating teams and seamlessly assign players to these specific teams. The system facilitates the scheduling of matches between registered teams within a selected tournament. Furthermore, it allows for the entry of final match scores, automatically determines the winning team based on the submitted runs, and dynamically generates and updates a tournament-specific points table using advanced database aggregation techniques. The user interface also provides a structured dashboard to filter and view all entered data based on the active tournament.

### Non-Functional Requirements
**Performance:** The system is designed to respond rapidly to user requests. By implementing database indexing on frequently queried fields (such as tournament IDs and team IDs), the application ensures fast data retrieval even as the database grows.
**Usability:** The application features a clean, responsive, and intuitive graphical user interface (GUI). It is designed to be accessible via standard desktop web browsers without requiring extensive user training.
**Scalability:** Utilizing MongoDB's document-oriented structure allows the database to scale horizontally. The system can accommodate an increasing number of tournaments and players without significant degradation in performance.
**Reliability:** The system guarantees data persistence. All transactions are securely stored in the MongoDB database, ensuring that no tournament records or score data are lost during server restarts or unexpected interruptions.

## 4. System Overview
The Cricket Tournament Management System is built upon a standard 3-tier architecture, which logically separates the application into three distinct computing tiers. This separation of concerns ensures that the application is modular, easier to maintain, and highly scalable.

The Presentation Tier (Frontend) is developed using standard HTML, CSS, and JavaScript. This layer is entirely responsible for user interaction, rendering input forms, and displaying data in tables. The Application Tier (Backend) is powered by Node.js and the Express.js framework. This layer acts as the intermediary brain of the system; it receives HTTP requests from the frontend, processes business logic (such as calculating match winners), and handles routing. The Data Tier (Database) utilizes MongoDB, a NoSQL database, to permanently store all application data. 

**Description for System Architecture Diagram:**
To visually represent this, the architecture diagram should consist of three vertical blocks. The left block, labeled "Client Layer (Frontend)", represents the user's web browser containing HTML/CSS/JS. An arrow labeled "HTTP Fetch Requests" points from this block to the center block. The center block, labeled "Application Layer (Backend)", represents the Node.js/Express server. An arrow labeled "JSON Responses" points back to the Client Layer. Finally, an arrow labeled "Mongoose Queries" points from the center block to the rightmost block, labeled "Database Layer (MongoDB)". A returning arrow labeled "Document Data" points back to the Application Layer, completing the flow.

## 5. Database Connectivity
Establishing a secure and efficient connection to the database is a critical component of this project. The Node.js backend connects to the MongoDB database utilizing an Object Data Modeling (ODM) library known as Mongoose. Mongoose acts as a bridge, translating Node.js objects into MongoDB documents and providing a rigorous, schema-based solution to model application data.

The connection is initiated upon server startup using a connection string URI (e.g., `mongodb://127.0.0.1:27017/cricket_db`). This string acts as a digital address, instructing the Node.js application on exactly where the database is hosted and which specific database namespace to access. 

Mongoose enforces structure through Schemas and Models. A Schema acts as a strict blueprint, defining the data types (e.g., String, Number) and validation rules for a specific entity. A Model is a compiled version of the Schema that provides an interface to directly query and manipulate the MongoDB database. When a user submits data from the frontend, the JavaScript `fetch` API sends a POST request containing a JSON payload to the backend. The Express.js router intercepts this request, parses the data, and instantiates the appropriate Mongoose Model. The backend then issues a `.save()` command, and Mongoose asynchronously writes the document into the MongoDB storage layer.

The database design relies heavily on relational concepts adapted for a NoSQL environment using distinct collections:
- **Tournament Collection:** Stores overarching details such as tournament name and dates.
- **Team Collection:** Stores squad details and utilizes an `ObjectId` reference to link the team to a specific Tournament.
- **Player Collection:** Stores individual athlete metrics and links to a Team via a `team_id` reference.
- **Match Collection:** Acts as a junction, linking two opposing Teams and tying them to a specific Tournament.
- **Score Collection:** Records the runs and wickets, strictly tied to a specific Match and Team `ObjectId`.
By passing these `ObjectIds` between collections, the system maintains referential integrity, allowing complex queries—such as fetching all matches for a specific tournament—to be executed efficiently.

## 6. Screenshots of Project Execution

*[Placeholder: Screenshot of the Home Page]*
**Figure 1: Home Page** - The landing interface providing navigation to various modules of the Tournament Management System.

*[Placeholder: Screenshot of the Add Tournament Page]*
**Figure 2: Add Tournament Module** - A form allowing the administrator to define a new tournament's parameters, including dates and organizer details.

*[Placeholder: Screenshot of the Add Team Page]*
**Figure 3: Team Registration Module** - Interface demonstrating the assignment of a new team to an existing, actively selected tournament.

*[Placeholder: Screenshot of the Match Scheduling Page]*
**Figure 4: Match Scheduling Interface** - Dynamic dropdowns allowing the user to select a tournament and subsequently choose two participating teams to schedule a fixture.

*[Placeholder: Screenshot of the Score Entry Page]*
**Figure 5: Score Entry Module** - The form utilized to securely input runs, wickets, and overs for a specific team in a previously scheduled match.

*[Placeholder: Screenshot of the View Data Page]*
**Figure 6: Global Dashboard** - A centralized dashboard featuring dynamic filtering, allowing users to view teams, players, and match summaries categorized by tournament.

*[Placeholder: Screenshot of the Points Table Page]*
**Figure 7: Dynamic Points Table** - The automatically generated standings table, utilizing MongoDB aggregation to calculate matches played, wins, losses, and total points based on live score data.

## 7. Conclusion
The Cricket Tournament Management System successfully addresses the inefficiencies associated with manual sports administration. By implementing a modern 3-tier web architecture, the project provides a highly scalable, modular, and fast solution for tracking tournament progress. 

Through the development of this project, significant learning outcomes were achieved, particularly in the realm of Database Management Systems. Practical experience was gained in designing NoSQL database schemas, managing relational data using `ObjectIds`, and establishing robust database connectivity using Mongoose and Node.js. Furthermore, the implementation of the dynamic points table provided deep insights into utilizing MongoDB Aggregation Pipelines to perform complex mathematical operations directly within the database layer, thereby optimizing backend processing.

Future improvements for this system could include the implementation of JWT-based user authentication to restrict data entry to authorized organizers only. Additionally, expanding the database schema to support live, ball-by-ball scoring would transform the application into a real-time tracking platform, further enhancing its real-world utility.
