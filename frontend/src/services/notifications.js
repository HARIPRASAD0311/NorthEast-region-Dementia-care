import { loadReminders } from "./storage.js";

const SENT_KEY = "limbo_reminder_notifications_sent";

function readSentMap() {
  try {
    const raw = localStorage.getItem(SENT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSentMap(map) {
  try {
    localStorage.setItem(SENT_KEY, JSON.stringify(map));
  } catch {
    // ignore storage-related failures
  }
}

function weekdayIndex(name) {
  const map = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
  return map[String(name).slice(0, 3).toLowerCase()] ?? 0;
}

function parseTimeToDate(rawTime, fallbackDate = new Date()) {
  if (!rawTime) return null;

  const simpleMatch = rawTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (simpleMatch) {
    const hours = parseInt(simpleMatch[1], 10);
    const minutes = parseInt(simpleMatch[2], 10);
    const meridiem = simpleMatch[3].toUpperCase();
    const normalized = meridiem === "PM" && hours < 12 ? hours + 12 : hours;
    const date = new Date(fallbackDate);
    date.setHours(normalized, minutes, 0, 0);
    return date;
  }

  const weekdayMatch = rawTime.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[,\s]+(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (weekdayMatch) {
    const targetDay = weekdayIndex(weekdayMatch[1]);
    const hours = parseInt(weekdayMatch[2], 10);
    const minutes = parseInt(weekdayMatch[3], 10);
    const meridiem = weekdayMatch[4].toUpperCase();
    const normalized = meridiem === "PM" && hours < 12 ? hours + 12 : hours;

    const date = new Date(fallbackDate);
    const diff = (targetDay - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + diff);
    date.setHours(normalized, minutes, 0, 0);

    if (date <= fallbackDate) {
      date.setDate(date.getDate() + 7);
    }

    return date;
  }

  return null;
}

function getNotificationMeta(reminder) {
  switch (reminder.type) {
    case "Medication":
      return {
        title: "Medication Reminder",
        body: "It's time for your scheduled medication.",
      };
    case "Hydration":
      return {
        title: "Hydration Reminder",
        body: "Time to drink some water.",
      };
    case "Appointment":
      return {
        title: "Medical Appointment",
        body: reminder.label ? `You have a medical appointment scheduled: ${reminder.label}.` : "You have a medical appointment scheduled.",
      };
    default:
      return {
        title: "Reminder",
        body: reminder.label || "You have a reminder scheduled.",
      };
  }
}

export function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";

  return Notification.requestPermission();
}

export function showNotification(title, options = {}) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }

  try {
    new Notification(title, options);
    return true;
  } catch {
    return false;
  }
}

export function checkDueRemindersAndNotify() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const now = new Date();
  const reminders = loadReminders([]);
  const sentMap = readSentMap();
  const nextSentMap = { ...sentMap };

  reminders.forEach((reminder) => {
    if (!reminder || reminder.done) return;

    const occurrence = parseTimeToDate(reminder.time, now);
    if (!occurrence) return;

    const dueWindowStart = new Date(occurrence);
    dueWindowStart.setMinutes(dueWindowStart.getMinutes() - 2);

    const dueWindowEnd = new Date(occurrence);
    dueWindowEnd.setMinutes(dueWindowEnd.getMinutes() + 2);

    if (now < dueWindowStart || now > dueWindowEnd) return;

    const occurrenceKey = `${reminder.id}-${occurrence.toDateString()}-${occurrence.getHours()}:${occurrence.getMinutes()}`;
    if (sentMap[occurrenceKey]) return;

    const meta = getNotificationMeta(reminder);
    showNotification(meta.title, {
      body: meta.body,
      tag: occurrenceKey,
    });

    nextSentMap[occurrenceKey] = true;
  });

  writeSentMap(nextSentMap);
}

export function startReminderNotificationMonitor() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return () => {};
  }

  checkDueRemindersAndNotify();

  const intervalId = window.setInterval(() => {
    checkDueRemindersAndNotify();
  }, 30000);

  return () => window.clearInterval(intervalId);
}
