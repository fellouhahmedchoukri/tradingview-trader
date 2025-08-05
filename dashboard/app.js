

### Fichier `dashboard/app.js`

```javascript
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dashboardRouter from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET || 'tradingbot-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware d'authentification
app.use('/dashboard', (req, res, next) => {
  if (!req.session.authenticated) {
    return res.redirect('/');
  }
  next();
});

// Configuration des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', dashboardRouter);

export default app;
