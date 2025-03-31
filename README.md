# 4485-Team-7
Disaster Post Analysis Dashboard

# Current functionality

Right now, this is just a template project. It displays a list of fruits stored in a database online, and lets you add fruits to that list.

# Instructions for running locally

1. Install Python 3 and NodeJS
2. Go to main.py. Replace "PASS" in the value of DATABASE_URL with our database password. You can find this in our Google Drive folder. Note: remove the password from your code before committing anything. Our repo is public so this is just to be safe

3. Run this in one terminal:
```bash
cd backend
venv\Scripts\Activate
pip install -r requirements.txt
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