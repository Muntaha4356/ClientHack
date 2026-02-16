# Notification Implementation - Integration Guide

## ✅ What Has Been Implemented

### Backend Changes

#### 1. **Notification Model Updated** (`models/Notification.js`)
- `message` field is now an object with `title` and `message` properties
- Added `type` enum: `['alert', 'success', 'warning', 'failure']`
- Removed old `created_at` field (using Mongoose timestamps)

#### 2. **Notification Controller Updated** (`controllers/notificationController.js`)
- Added `getRelativeTime()` helper - formats timestamps as "Just now", "5m ago", etc.
- Updated `createNotification()` signature to accept `(userId, type, title, message, metadata)`
- Updated `getUnreadNotifications()` and `getAllNotifications()` to return properly formatted responses

#### 3. **Transaction Controller Enhanced** (`controllers/transactionController.js`)
- **On Add Transaction:**
  - **Expense:** Creates an "alert" notification with title "Money Spent" and message "You spent ${amount} on ${category}"
  - **Income:** Creates a "success" notification with title "${amount} Received"
  - **Low Balance:** After expense, if balance ≤ 10% of monthly income, creates "warning" notification
  - **Failure:** Creates "failure" notification if transaction creation fails
  
- **On Update Transaction:**
  - Creates "failure" notification if transaction not found, unauthorized, or error occurs

- **On Delete Transaction:**
  - Creates "failure" notification if transaction not found, unauthorized, or error occurs

#### 4. **User Controller Enhanced** (`controllers/userController.js`)
- **On Change Password Failure:**
  - Creates "failure" notification for validation errors, incorrect current password, or server errors

### Frontend Changes

#### 1. **New NotificationContext** (`context/NotificationContext.tsx`)
```tsx
- Manages all notification state
- Provides hooks: useNotifications()
- Functions: fetchNotifications(), markAsRead(), deleteNotification(), markAllAsRead()
- Notifications auto-sorted by most recent first
- Includes loading state
```

#### 2. **Updated NotificationPanel** (`components/NotificationPanel.tsx`)
```tsx
- Removed mock data
- Connected to NotificationContext using useNotifications()
- Displays actual data from backend
- Shows loading state while fetching
- Displays relative timestamps ("Just now", "5m ago")
- Supports all notification types including 'failure'
- Recent notifications appear first
```

---

## 🔧 How to Use

### Step 1: Wrap Your App with NotificationProvider

In your main App.tsx or index.tsx file:

```tsx
import { NotificationProvider } from './app/context/NotificationContext';
import { YourApp } from './app/YourApp';

export default function App() {
  return (
    <NotificationProvider>
      <YourApp />
    </NotificationProvider>
  );
}
```

### Step 2: Use Notifications in Any Component

```tsx
import { useNotifications } from '../context/NotificationContext';

export function MyComponent() {
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    deleteNotification 
  } = useNotifications();

  // Notifications are automatically fetched on mount
  // Access them via notifications array
  
  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {notifications.map(notif => (
        <div key={notif.id}>
          <h4>{notif.title}</h4>
          <p>{notif.message}</p>
          <p>{notif.timestamp}</p>
        </div>
      ))}
    </div>
  );
}
```

### Step 3: NotificationPanel Usage

The NotificationPanel component is already updated and connected. Just make sure it's rendered in your Header:

```tsx
import { NotificationPanel } from './components/NotificationPanel';

export function YourApp() {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <>
      <button onClick={() => setNotificationOpen(!notificationOpen)}>
        Open Notifications
      </button>
      
      <NotificationPanel 
        isOpen={notificationOpen} 
        onClose={() => setNotificationOpen(false)} 
      />
    </>
  );
}
```

---

## 📊 Notification Types & Messages

### 1. **Expense Transaction** (type: 'alert')
- **Title:** "Money Spent"
- **Message:** "You spent $X.XX on Category"
- **Icon:** Shield (red)

### 2. **Income Transaction** (type: 'success')
- **Title:** "$X.XX Received"
- **Message:** "You received $X.XX"
- **Icon:** CheckCircle (green)

### 3. **Low Balance Warning** (type: 'warning')
- **Title:** "Warning: Low Balance"
- **Message:** "You have only $X.XX in your account"
- **Condition:** Triggered after expense if balance ≤ 10% of monthly income
- **Icon:** AlertTriangle (yellow)

### 4. **Transaction Failure** (type: 'failure')
- **Title:** "Transaction Failure"
- **Message:** "Your transaction [action] failed. Try again."
- **Triggered:** When CREATE/UPDATE/DELETE fails
- **Icon:** X (orange)

### 5. **Password Change Failure** (type: 'failure')
- **Title:** "Password Change Failed"
- **Message:** Specific error message
- **Icon:** X (orange)

---

## 🎯 Key Features

✅ **Automatic Notifications**
- Created immediately after transactions/updates
- No manual intervention needed

✅ **Recent First**
- Notifications automatically sorted with most recent at top
- Reduces context switching for users

✅ **Formatted Timestamps**
- "Just now" → immediate actions
- "5m ago" → recent actions
- "2h ago" → older actions
- "3d ago" → much older

✅ **Multiple Notification Types**
- alert (expenses)
- success (incomes)
- warning (low balance)
- failure (errors)
- info (other)

✅ **Context-Based Management**
- Fetch once on mount
- Reuse across entire app
- No duplicate API calls
- Efficient state management

✅ **User Actions**
- Mark as read
- Mark all as read
- Delete individual notifications
- Filter by read/unread

---

## 📝 API Endpoints Used

- **GET** `/api/notifications` - Fetch all notifications
- **PUT** `/api/notifications/:id/read` - Mark as read
- **DELETE** `/api/notifications/:id` - Delete notification

---

## 🚀 Testing the Notifications

### Test Expense Notification
1. Login to app
2. Add an expense transaction
3. Notification "Money Spent" should appear in NotificationPanel

### Test Low Balance
1. Set monthly income to 100
2. Add expense of 91 (using 91% of budget)
3. Add expense of 10 (going below 10% threshold)
4. Should see both "Money Spent" + "Low Balance" notifications

### Test Failure Notification
1. Try to delete a transaction that doesn't exist
2. Should see "Transaction Failure" notification

---

## 🔄 Real-Time Updates

**Note:** Notifications are fetched on:
- Component mount
- Manual `fetchNotifications()` call
- After actions via API

For true real-time updates (WebSockets), you can extend the context with:

```tsx
// Example: Add WebSocket listener
useEffect(() => {
  const socket = io(API_URL);
  
  socket.on('new_notification', () => {
    fetchNotifications();
  });
  
  return () => socket.disconnect();
}, []);
```

---

## ⚙️ Environment Setup

Make sure your app has:

1. **API Client** (`utils/apiClient.ts`) with auth headers
2. **NotificationProvider** wrapping your app
3. **NotificationPanel** in your Header or Layout

That's it! Everything else is automatic! 🎉

