# 🧠 SMEBoost – Angular Frontend

This is the frontend for **SMEBoost**, an AI-powered content creation platform for small and local businesses. Built using Angular, this SPA collects business data, connects to AI via backend APIs, and lets users generate personalized content — all in one click.

---

## ⚙️ Tech Stack

| Layer     | Tech Used                   |
|-----------|-----------------------------|
| Framework | Angular 17                  |
| Styling   | Tailwind CSS / Bootstrap    |
| Auth      | Clerk (Angular SDK)         |
| Forms     | Angular Reactive Forms      |
| State     | RxJS, Angular Services      |
| Hosting   | Firebase Hosting / GCS CDN  |

---

## 📦 Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/smeboost-client.git
cd smeboost-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Clerk (Authentication)
Update your `app.module.ts` with your **Clerk Frontend API key**:
```ts
ClerkModule.forRoot({
  frontendApi: 'YOUR_CLERK_FRONTEND_API',
}),
```

You can get this from [Clerk Dashboard](https://dashboard.clerk.com).

---

### 4. Run the App
```bash
ng serve
```
Visit: [http://localhost:4200](http://localhost:4200)

---

## 🗂️ Project Structure

```
src/app/
│
├── auth/               # Clerk login, auth guards
├── sme-form/           # Multi-step form for business/product input
├── dashboard/          # Display generated content
├── shared/             # Buttons, alerts, loaders
├── services/           # HTTP API calls
└── app-routing.module.ts
```

---

## 🔐 Auth with Clerk

- OAuth / Email login
- JWT passed to backend via `Authorization` header
- Secure route guards for Dashboard and Generation tools

---

## 🔗 API Integration

Make sure your backend (FastAPI) is running on `http://localhost:8000`.

API requests should include the JWT token from Clerk:
```ts
const token = await this.clerk.getToken();
this.http.post('/api/generate/caption', payload, {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## 🌐 Deployment (Firebase Hosting)

```bash
ng build --configuration production
firebase login
firebase init
firebase deploy
```

> Make sure `dist/` points to the correct Angular output folder in `firebase.json`.

---

## 📄 License

MIT © 2025 

---

## 🙌 Connect

**📧** xyz@gmail.com  
**🔗** [LinkedIn]
