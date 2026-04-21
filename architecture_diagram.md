# System Architecture Diagram

Here is the 3-tier architecture diagram for your project. You can screenshot this diagram for your report!

```mermaid
graph LR
    subgraph Frontend ["Client Layer (Frontend)"]
        HTML[HTML5 Structure]
        CSS[CSS3 Styling]
        JS[JavaScript & Fetch API]
        UI[Web Browser UI]
        HTML --- UI
        CSS --- UI
        JS --- UI
    end

    subgraph Backend ["Application Layer (Backend)"]
        Node[Node.js Runtime]
        Express[Express.js Server]
        Mongoose[Mongoose ODM]
        Routes[API Routes]
        Node --- Express
        Express --- Routes
        Routes --- Mongoose
    end

    subgraph Database ["Data Layer (Database)"]
        Mongo[(MongoDB)]
        Collections[Collections:<br/>Teams, Players, Matches, Scores]
        Agg[Aggregation Pipeline]
        Mongo --- Collections
        Mongo --- Agg
    end

    %% Connections between tiers
    JS <-->|HTTP Requests (GET/POST)<br/>JSON Responses| Express
    Mongoose <-->|TCP/IP Connection<br/>Queries & Documents| Mongo

    classDef front fill:#FF6B6B,stroke:#EE5A24,stroke-width:2px,color:white;
    classDef back fill:#4834D4,stroke:#686DE0,stroke-width:2px,color:white;
    classDef db fill:#10AC84,stroke:#1DD1A1,stroke-width:2px,color:white;
    classDef main fill:none,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5;

    class Frontend,HTML,CSS,JS,UI front;
    class Backend,Node,Express,Mongoose,Routes back;
    class Database,Mongo,Collections,Agg db;
```
