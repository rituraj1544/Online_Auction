import { useEffect, useRef, useState } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import api from '../services/api';

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch on mount to get initial unread count
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch {
      // user might not be logged in
    } finally {
      setLoading(false);
    }
  }

  function handleToggle() {
    setOpen((prev) => !prev);
    if (!open) fetchNotifications();
  }

  async function markRead(id) {
    try {
      await api.put(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {}
  }

  async function markAllRead() {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  }

  const token = localStorage.getItem('token');
  if (!token) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        id="notification-bell"
        onClick={handleToggle}
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-950 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-400" />
              <h3 className="font-semibold text-slate-100 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
            {loading && (
              <div className="py-8 text-center text-slate-500 text-sm">
                Loading...
              </div>
            )}
            {!loading && notifications.length === 0 && (
              <div className="py-10 text-center">
                <Bell className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No notifications yet</p>
              </div>
            )}
            {!loading &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                    !notification.read
                      ? 'bg-sky-950/30 hover:bg-sky-950/50'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex-shrink-0 h-2 w-2 rounded-full ${
                      !notification.read ? 'bg-amber-400' : 'bg-transparent'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${!notification.read ? 'text-slate-100' : 'text-slate-400'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markRead(notification.id)}
                      className="flex-shrink-0 text-slate-600 hover:text-sky-400 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
