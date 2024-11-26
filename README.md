# Specifications / Infrastructure Information / Prerequisite

- npm
- node
- npx

# Setup

Setup .env file

.env
.env.example

npm install

Start local dev
npm run start

Testing (Jest)
npm run test

# Technical Solution

I'm using REST API to expose secure downloadable link of the report. I'm using JWT to generate token and used it as signed url for the report.

Secure Report Download via JWT

Access Control: Ensure the user has permission to access the report. (Mock data)

JWT Token Generation: Generate a signed JWT token with a secret (JWT_SECRET) and expiration time.

Token Verification: Validate the token for authenticity and expiration.

Report Availability: Confirm the report exists.

Download Permission: If the token is valid and the user has access, allow the report to be downloaded.

Testing API URLS

Generate Download Link
POST: http://localhost:4000/reports/generate-download-link

Download Report Data
GET: http://localhost:4000/reports/:token
token

Lacking download PDF in front end using the pdfbuffer
