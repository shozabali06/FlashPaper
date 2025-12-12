# FlashPaper

FlashPaper is a web application for sharing self-destructing, encrypted secrets. Create a secret, share the link, and once it's viewed, it's gone forever. This ensures your sensitive information is viewed only once and is not persisted anywhere.

The application is built with a focus on security, employing end-to-end encryption where the server has zero knowledge of the secret's content.

## Key Features

-   **End-to-End Encryption**: Secrets are encrypted in your browser using AES before being sent to the server. The decryption key is never sent to the server, as it's stored in the URL fragment.
-   **Self-Destructing**: Each secret can only be viewed once. The moment it is retrieved, it is permanently deleted from the database.
-   **Time-Limited**: Secrets automatically expire and are deleted after 24 hours, even if they haven't been viewed.
-   **Minimalist "Hacker" UI**: A clean, responsive interface with a retro-terminal aesthetic.
-   **No Sign-Up Required**: Quickly and anonymously share secrets without needing an account.

## How It Works

FlashPaper ensures that only the sender and the intended recipient can view the secret content through the following process:

1.  **Encryption**: When you create a secret, a random, cryptographically secure encryption key is generated in your browser. Your message is encrypted using this key with AES.
2.  **Storage**: Only the encrypted message is sent to the server. It is stored in the database alongside a unique, randomly generated slug. The server never sees the unencrypted message or the encryption key.
3.  **Link Generation**: A unique URL is created containing the secret's slug and the encryption key as a URL fragment (`#`). For example: `https://flashpaper.app/secret/z9x8y7w6#my-secret-key`.
4.  **Decryption**: When the recipient opens the link, the browser fetches the encrypted message from the server using the slug. The server then immediately deletes the secret from the database. The client-side JavaScript then uses the key from the URL fragment to decrypt and display the message. The key is never exposed to the server because URL fragments are not sent in HTTP requests.

## Tech Stack

-   **Frontend**:
    -   React (with Vite)
    -   Tailwind CSS for styling
    -   shadcn/ui for components
    -   `crypto-js` for client-side AES encryption
-   **Backend**:
    -   Node.js
    -   Express.js
-   **Database**:
    -   Neon (Serverless PostgreSQL)
-   **Deployment**:
    -   Vercel

## Project Structure

The repository is structured as a monorepo with two main directories:

-   `client/`: Contains the React frontend application.
-   `server/`: Contains the Node.js and Express backend API.

## Local Development

To run this project locally, you will need to set up both the server and the client.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   A NeonDB or other PostgreSQL database connection string.

### Backend Setup

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `server` directory and add your database connection string:
    ```
    DATABASE_URL="your-postgresql-connection-string"
    PORT=5000
    ```

4.  Start the development server:
    ```bash
    npm run server
    ```
    The backend will be running on `http://localhost:5000`.

### Frontend Setup

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `client` directory and point it to your local backend API:
    ```
    VITE_API_URL=http://localhost:5000
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173` (or another port if 5173 is in use).

## API Endpoints

The backend exposes a simple REST API for managing secrets.

-   **Create a Secret**
    -   **URL**: `/api/secret/create`
    -   **Method**: `POST`
    -   **Body**: `{ "message": "<encrypted_string>" }`
    -   **Response**: `{ "success": true, "message": "Secret created", "slug": "<unique_slug>" }`

-   **Get a Secret**
    -   **URL**: `/api/secret/:slug`
    -   **Method**: `GET`
    -   **Response**: `{ "success": true, "message": "<encrypted_string>" }`
    -   **Note**: This endpoint retrieves the secret and immediately deletes it from the database. It will return a `404` on subsequent requests. It will return `410` if the secret has expired.