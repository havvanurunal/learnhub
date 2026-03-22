# LearnHub 📖

LearnHub is a web application that lets users search for educational YouTube videos and save their favourites for later. It uses the YouTube Data API v3 to fetch and display video results, and stores saved videos locally in the browser.

## Features

- Search for educational videos via the YouTube Data API
- Watch videos directly embedded on the page
- Save and remove videos using the browser's local storage
- Responsive design — works on desktop and mobile
- Accessible UI with ARIA labels and semantic HTML

## Tech Stack

- HTML, CSS, JavaScript
- YouTube Data API v3

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/havvanurunal/learnhub.git
cd learnhub
```

### 2. Get a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **YouTube Data API v3**
4. Go to **Credentials** and create an API key

### 3. Add your API key

Create a file called `secret.js` in the root of the project with the following content:

```javascript
const YOUTUBE_ACCESS_KEY = 'YOUR_API_KEY_HERE';
```

> `secret.js` is listed in `.gitignore` and will not be pushed to GitHub. You must create this file manually after cloning.

### 4. Run the project

Open `index.html` in your browser. No build step or server is required.

## Pages

- `index.html` — main search page
- `saved.html` — saved videos page

## Notes

- The app uses `localStorage` to persist saved videos between sessions
- Make sure your API key has access to the YouTube Data API v3 and is not restricted to specific domains during development
