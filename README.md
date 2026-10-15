# David's Kitchen — responsive website + backend

This project contains the responsive front end and a small Node.js/Express backend. The backend saves orders and contact form messages into JSON files in `data/`.

## Requirements
- Node.js 18 or newer
- Internet connection for the first dependency installation

## Start the project in VS Code
1. Extract this ZIP file.
2. Open the extracted folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run `npm install` and wait for it to finish.
5. Run `npm start`.
6. Open `http://localhost:3000` in your browser. Do not open `index.html` directly; use the localhost address so the backend can receive orders.

Check that the backend is running at `http://localhost:3000/api/health`.

## What the backend does
- `GET /api/health` — confirms the server is running.
- `GET /api/menu` — returns menu information.
- `POST /api/orders` — validates an order, recalculates prices on the server, and saves it to `data/orders.json`.
- `POST /api/contact` — validates and saves a contact message to `data/messages.json`.

## Important notes
- This is a learning/demo backend. It does not send emails or WhatsApp messages automatically.
- Online payment is labelled as a demo and does not charge a customer. A real payment provider and verified payment callbacks must be configured before accepting payments.
- The JSON files are suitable for a school project or local demo, not a high-traffic production restaurant. Production use should add a database, authentication/admin access, rate limiting, HTTPS, backups, and privacy protections.
- Customer details are saved locally in the `data` folder. Do not publish real customer data or commit these files to a public repository.
