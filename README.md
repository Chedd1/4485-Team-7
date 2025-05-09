# 4485-Team-7
Disaster Post Analysis Dashboard

# Current functionality

Backend access to database, frontend connection to database via axios HTTP requests to backend. api.js handles all communication with the backend. FastAPI receives requests from frontend, uses SQLModel to connect to Neon database. 

# Instructions for running locally
1. Install Python 3 and NodeJS and have "trained_model_bert_uncased" folder sent to you by JT and just drag and drop it into the root folder

2. Go to database.py, at line 22 replace "PASS" of DATABASE_URL with our database password. You can find this in our Google Drive folder.
IMPORTANT: remove the password and replace it with "PASS" from your code before committing.

3. Create virtual environment (venv) with CTRL+SHIFT+P in your code editor(VS Code and maybe VS?)with python interpreter version 3.10.11, should be recommended? This is the one that works with spacy.

4. pip install -r requirements.txt in the root folder; e.g. 4485-Team-7, NOT /frontend or /backend.

5. Run this in one terminal and let it cook for a bit before moving to step 6:
```bash
cd backend
python app.py
```

6. Then, run this in a new terminal:
```bash
cd frontend
npm install
npm run dev
```
After you run "pip install" and "npm install" once, you can ignore those lines when running the app in the future.

7. Finally, go to http://localhost:5173/