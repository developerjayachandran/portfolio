# Portfolio (Local)

This is a lightweight, static portfolio scaffold (HTML/CSS/JS) you can edit locally.

Quick pointers for a developer:

- Replace profile image: put your image at `assets/me.jpg` and in the browser console run:

```js
window.portfolio.setProfileImage('assets/me.jpg')
```

- Add or edit projects: open `assets/scripts.js` and update the `projects` array. Each project item supports:

```js
{ id, title, desc, tech: ['list','of','tech'], link: 'https://...', code: 'optional code snippet' }
```

- Project details: click "Details" on a project card to see an expanded view with an optional code snippet.

- Export workouts: in the browser console run `window.portfolio.downloadWorkouts()` to save the fake workouts as `workouts.json`.

- Run locally: open `index.html` in your browser. No build tools required.

Next steps suggestions:

- Replace placeholder links with real repo URLs.
- Add a contact form backend or integrate a service (Formspree, Netlify Forms).
- Add CI badges or README per project and link them from the project card.
# portfolio
Jayachandran's portfolio
