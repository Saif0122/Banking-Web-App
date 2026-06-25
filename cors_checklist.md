# Production CORS & Cookie Configuration

Here is the complete review and fix for your CORS and cookie issues between your Vercel frontend and Render backend.

I've already updated your `server/src/app.js` file with the robust CORS configuration. Below is the documentation of the changes, the environment variables you need to set, and a verification checklist.

## 1. Updated Express CORS Middleware (`server/src/app.js`)

I have updated your Express backend to properly handle multiple origins, completely eliminate trailing slash issues, and allow credentials.

```javascript
// Enable CORS
const rawOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:3000', 'https://banking-web-app-theta.vercel.app'];
const allowedOrigins = rawOrigins.map(origin => origin.trim().replace(/\/+$/, '')); // Removes trailing slashes

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like server-to-server or curl)
    if (!origin) return callback(null, true);
    
    // remove trailing slash from incoming origin just in case
    const cleanOrigin = origin.replace(/\/+$/, '');
    
    if (allowedOrigins.indexOf(cleanOrigin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
```

## 2. Cookie Configuration (`server/src/controllers/auth.controller.js`)

Your cookie configuration was already mostly correct in your `auth.controller.js`, but here is the exact verified configuration that ensures cookies work cross-domain in production and locally in development:

```javascript
const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true, // Prevents JavaScript from accessing the cookie (mitigates XSS)
  secure: isProd, // Must be TRUE in production (requires HTTPS)
  sameSite: isProd ? 'none' : 'lax' // 'none' is REQUIRED for cross-domain cookies
};

// Example usage:
res.cookie('accessToken', accessToken, {
  ...cookieOptions,
  maxAge: 15 * 60 * 1000 // 15 minutes
});
```

> [!IMPORTANT]
> **Cross-Domain Cookies Requirement:** Because your frontend (`vercel.app`) and backend (`onrender.com`) are on entirely different domains, the browser considers this a cross-site request. To send cookies, you **must** set `SameSite=None` and `Secure=true`. This is handled dynamically by the `isProd` check.

## 3. Environment Variables

You must set the following environment variables precisely as written below on your hosting platforms.

### 🏢 Render (Backend)
Navigate to your Render Dashboard > Environment > Environment Variables:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Critical for enabling `Secure=true` and `SameSite=none` on cookies. |
| `CLIENT_URL` | `https://banking-web-app-theta.vercel.app` | **Do not** add a trailing slash. If you need multiple, comma-separate them: `https://url1.com,https://url2.com`. |

### 🚀 Vercel (Frontend)
Navigate to Vercel Dashboard > Project > Settings > Environment Variables:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://banking-web-app-by0q.onrender.com/api/v1` | **Do not** add a trailing slash at the very end. |

## 4. Frontend Axios Verification

Ensure your frontend Axios (or fetch) instance is configured to send cookies. Without this, your frontend will reject the cookies sent by Render.

Check `frontend/src/services/api-client.ts` (or your axios configuration file) and ensure `withCredentials: true` is set globally:

```javascript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // CRITICAL: This allows cookies to be sent cross-domain
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
```

## 5. Deployment Verification Checklist

Run through these steps to guarantee your deployment is functioning:

- [ ] **Redeploy Backend:** Commit the changes to `app.js` and push to GitHub so Render triggers a new build.
- [ ] **Check Render Logs:** Ensure the server starts correctly and `NODE_ENV` is definitely mapped to `production`.
- [ ] **Check Vercel Build:** Ensure `NEXT_PUBLIC_API_URL` is correct. You may need to trigger a redeploy on Vercel so the environment variables bake into the Next.js build.
- [ ] **Test Login:** Open the Vercel app, open Chrome DevTools > Network tab. Attempt to log in.
- [ ] **Verify `Set-Cookie` Header:** Click the login request in the Network tab. Look at the **Response Headers**. You should see:
  `Set-Cookie: accessToken=...; Path=/; HttpOnly; Secure; SameSite=None`
- [ ] **Verify Subsequent Requests:** Navigate to the dashboard. Ensure the next API request automatically includes the `Cookie: accessToken=...` in the **Request Headers**.
