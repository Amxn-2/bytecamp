import { create } from "zustand";

export interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markAsRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAllNotifications: () => set(() => ({ notifications: [] })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
}));
