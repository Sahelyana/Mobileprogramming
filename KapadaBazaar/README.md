# Kapda Thrift Bazaar - Web Version

A web application for buying and selling pre-loved fashion items online.

## Features

- 🏠 Browse featured products
- 🔍 Search for items
- ➕ List items for sale
- 💬 Chat with buyers/sellers
- 👤 User profiles and ratings
- 🎨 Modern, responsive UI

## Getting Started

### Option 1: Using Python (Simplest)

```bash
cd KapadaBazaar
python -m http.server 8000
```

Then visit: `http://localhost:8000`

### Option 2: Using Node.js

```bash
cd KapadaBazaar
npm install
npm start
```

Then visit: `http://localhost:3000`

### Option 3: Using Live Server (VS Code)

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Project Structure

```
KapadaBazaar/
├── index.html           # Main HTML entry point
├── index.js             # JavaScript entry point
├── web-package.json     # npm dependencies (optional)
├── web/
│   ├── router.js        # Page routing and navigation
│   ├── firebase-init.js # Firebase configuration
│   ├── ui.js            # UI utilities
├── src/
│   ├── screens/         # Screen components (for reference)
│   ├── components/      # Reusable components
│   └── config/          # Configuration files
└── README.md            # This file
```

## Available Routes

- `/` - Home page
- `/search` - Search products
- `/sell` - List item for sale
- `/chats` - Messages
- `/profile` - User profile
- `/login` - Login page
- `/register` - Registration page

## Technologies

- **HTML5** - Markup
- **CSS3** - Styling
- **Vanilla JavaScript** - No build step required
- **Firebase** - Backend services (when ready)

## Development

The app uses vanilla JavaScript without any build tools, making it simple to develop and deploy.

### Making Changes

1. Edit `index.html` for page structure
2. Edit `web/router.js` for routing and page content
3. Edit `web/ui.js` for UI utilities
4. Refresh browser to see changes

## Deployment

### Deploy to GitHub Pages

```bash
# Push to GitHub
git add .
git commit -m "Deploy Kapda Bazaar"
git push origin main
```

### Deploy to Netlify

```bash
# Connect your GitHub repo to Netlify
# Automatic deployments on push
```

### Deploy to Vercel

```bash
# Connect your GitHub repo to Vercel
# Automatic deployments on push
```

## Next Steps

1. ✅ Set up basic web structure
2. 🔄 Implement Firebase Authentication
3. 🔄 Add product database integration
4. 🔄 Implement real-time chat
5. 🔄 Add payment integration
6. 🔄 Deploy to production

## Troubleshooting

### Port already in use?

```bash
# Use different port
python -m http.server 8001
```

### CORS errors?

The app runs on the same origin, so CORS shouldn't be an issue. If you're testing with external APIs, you may need a CORS proxy.

### Firebase not working?

Make sure you have internet connection. The Firebase SDK is loaded from CDN.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
