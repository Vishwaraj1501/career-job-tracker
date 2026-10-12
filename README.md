# CareerTrack — Job Application Tracker

A responsive job-application tracking dashboard built with HTML, CSS, and vanilla JavaScript. It runs in the browser and saves your entries with LocalStorage.

## Features

- Dashboard stats for applications, interviews, offers, and due follow-ups
- Add, edit, and delete job applications
- Search by company, role, or notes
- Filter applications by status
- Responsive layout for desktop and mobile
- Browser persistence with LocalStorage
- Accessible form labels and confirmation before deleting

## Run locally

1. Download or clone this repository.
2. Open `index.html` in your browser.
3. Add or edit an application. Your data is stored in that browser on that device.

No dependencies, build tools, server, or API keys are required.

## Publish with GitHub Pages

1. Create a new repository on GitHub, for example `careertrack-job-tracker`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then save.
6. Wait for the deployment and open the URL GitHub Pages provides.

## Project structure

```text
careertrack-project/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Notes

- The first launch includes sample applications so the dashboard is not empty. You can delete them and add your own.
- LocalStorage is local to a browser profile and device. It is not a shared cloud database.
- This is a frontend portfolio project. A future full-stack version could use Python Flask, SQLite/PostgreSQL, authentication, and a real job API.

## Resume description

**CareerTrack — Job Application Tracker:** Built a responsive job tracking dashboard using HTML, CSS, and JavaScript with application CRUD operations, search/filter functionality, dynamic status analytics, and LocalStorage persistence. Published the site using GitHub Pages.
