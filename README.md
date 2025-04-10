# 4485-Team-7
Disaster Post Analysis Dashboard

# Current functionality

Backend access to database, frontend connection to database via axios HTTP requests to backend. api.js handles all communication with the backend. FastAPI receives requests from frontend, uses SQLModel to connect to Neon database. 

# Instructions for running locally (Make sure your python interpreter, CTRL+SHIFT+P, is 3.10.11 for the venv(virtual environment) should be default recommended)

1. Install Python 3 and NodeJS
2. Go to main.py. Replace "PASS" in the value of DATABASE_URL with our database password. You can find this in our Google Drive folder. Note: remove the password from your code before committing anything. Our repo is public so this is just to be safe

3. Run this in one terminal:
```bash
cd backend
pip install -r requirements.txt (venv probably already has all the libraries we need when I set it up)
python main.py
```

4. Then, run this in a new terminal:
```bash
cd frontend
npm install
npm run dev
```
After you run "pip install" and "npm install" once, you can ignore those lines when running the app in the future.

5. Finally, go to http://localhost:5173/