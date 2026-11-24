# StudyFlow

**A student productivity and academic management application.**

StudyFlow is a web application designed to help students organise their academic workload, manage assignment deadlines, and keep track of their subjects in one place.

The project focuses on providing a clean, intuitive workspace where students can manage coursework and visualise upcoming deadlines without switching between multiple tools.

## Features

### Dashboard
- Overview of total, completed, pending and in-progress assignments.
- Assignment completion rate.
- Deadline overview, including overdue and upcoming assignments.
- Quick access to active assignments.

### Assignment Management
- Create, view, edit and delete assignments.
- Assign assignments to specific subjects.
- Set due dates, priorities and completion statuses.
- Search assignments and filter them by status.

### Subject Management
- Create, edit and delete subjects.
- Assign individual colours to subjects.
- View the number of assignments associated with each subject.

### Interactive Calendar
- Monthly calendar view with previous and next month navigation.
- Highlight the current date.
- Display assignments on their respective due dates.
- Use subject colours to distinguish assignments.
- Select assignments directly from the calendar to edit their details.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, JavaScript, CSS |
| Build tool | Vite |
| Routing | React Router |
| Backend | Python, Flask |
| Database | PostgreSQL |
| Database connectivity | Psycopg 3 |
| Environment configuration | python-dotenv |

## Project Structure

```text
StudyFlow/
│
├── backend/
│   ├── run.py
│   ├── database.py
│   ├── requirements.txt
│   └── test_db.py
│
├── database/
│   └── creating-tables.sql
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Assignments.jsx
│   │   │   ├── Subjects.jsx
│   │   │   └── Calendar.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── .env
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd StudyFlow
```

### 2. Set up the database

Create a PostgreSQL database named `studyflow`.

Run the SQL script in `database/creating-tables.sql` against your database to create the required tables.

The application currently uses a development user with `user_id = 1`. Ensure that a corresponding user record exists before using the application.

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studyflow
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
```

Replace the example values with your own PostgreSQL credentials.

**Important:** Never commit your `.env` file or expose database credentials in your repository.

### 4. Set up the backend

Open a terminal in the project root:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Start the Flask development server:

```bash
python run.py
```

The backend runs at:

`http://127.0.0.1:5000`

### 5. Set up the frontend

Open a second terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local development URL provided by Vite, usually:

`http://localhost:5173`

## API Endpoints

The Flask backend provides REST API endpoints for managing assignments and subjects.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/assignments` | Retrieve assignments |
| POST | `/api/assignments` | Create an assignment |
| PUT | `/api/assignments/:id` | Update an assignment |
| DELETE | `/api/assignments/:id` | Delete an assignment |
| GET | `/api/subjects` | Retrieve subjects |
| POST | `/api/subjects` | Create a subject |
| PUT | `/api/subjects/:id` | Update a subject |
| DELETE | `/api/subjects/:id` | Delete a subject |

## Future Improvements

Potential enhancements for future development include:

- **Study Tracker:** Log study sessions and monitor daily and weekly study hours.
- **Study Analytics:** Visualise study patterns and time spent on individual subjects.
- **Authentication:** Introduce user registration, login and personalised workspaces.
- **Study Goals:** Allow students to set weekly study targets and monitor progress.

## Development

To build the frontend for production:

```bash
cd frontend
npm run build
```

To run the frontend lint checks:

```bash
npm run lint
```

---

**StudyFlow** — Making academic organisation simpler, one assignment at a time.