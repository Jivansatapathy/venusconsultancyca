# Firebase Gallery Setup Guide

This guide explains how to set up Firebase Storage and Firestore for the gallery feature.

## Prerequisites

1. Firebase project already exists (venusglobal-847ea)
2. Firebase Admin SDK is configured on the server (already done)

## Step 1: Get Firebase Web App Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `venusglobal-847ea`
3. Click on the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and select the web icon (</>)
7. Register your app (you can name it "Venus Consultancy Web")
8. Copy the Firebase configuration object

## Step 2: Configure Environment Variables

1. Copy `env.example` to `.env` in the `client` folder (if not already done)
2. Add the following Firebase configuration variables to your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=venusglobal-847ea.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=venusglobal-847ea
VITE_FIREBASE_STORAGE_BUCKET=venusglobal-847ea.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=107018407090157496477
VITE_FIREBASE_APP_ID=your_app_id_here
```

Replace the placeholder values with the actual values from Firebase Console.

## Step 3: Set Up Firestore Security Rules

1. Go to Firebase Console > Firestore Database
2. Click on "Rules" tab
3. Update the rules to allow read access and admin-only write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Gallery collection - public read, authenticated admin write
    match /gallery1/{document=**} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && request.auth.token.admin == true; // Admin only
    }
  }
}
```

## Step 4: Set Up Firebase Storage Rules

1. Go to Firebase Console > Storage
2. Click on "Rules" tab
3. Update the rules to allow public read and admin-only write:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Gallery images - public read, authenticated admin write
    match /gallery/{allPaths=**} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && request.auth.token.admin == true; // Admin only
    }
  }
}
```

## Step 5: Seed Existing Gallery Data

To upload existing gallery images and data to Firebase:

1. Make sure you have the Firebase config in your `.env` file
2. Run the seed script:

```bash
cd client
node scripts/seed-gallery.js
```

The script will:
- Upload all images from `public/gallery/` to Firebase Storage
- Add all gallery items from `src/data/galleryData.js` to Firestore collection `gallery1`

## Step 6: Access Gallery Management

1. Log in to the admin dashboard at `/admin/dashboard`
2. Click on the "Gallery" tab
3. You can now:
   - View all gallery items
   - Add new photos
   - Edit existing items
   - Delete items

## Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid)"
- Make sure you've added the correct `VITE_FIREBASE_API_KEY` to your `.env` file
- Restart your development server after adding environment variables

### Error: "Permission denied" when accessing Firestore
- Check your Firestore security rules
- Make sure the rules allow public read access

### Images not uploading
- Check Firebase Storage rules
- Make sure you have write permissions
- Check browser console for detailed error messages

### Seed script fails
- Make sure all images exist in `public/gallery/` folder
- Check that Firebase config is correct in `.env`
- Make sure you have the necessary permissions in Firebase

## Notes

- The collection name is `gallery1` as specified
- Images are stored in Firebase Storage under the `gallery/` path
- The gallery page will automatically fetch data from Firebase
- If Firebase fails, the gallery will fallback to the static data in `galleryData.js`

