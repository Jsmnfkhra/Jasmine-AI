const CHAT_KEY = "jasmine_ai_chats";
const ACTIVE_CHAT_KEY = "jasmine_ai_active";

export function saveChats(chats) {
  localStorage.setItem(
    CHAT_KEY,
    JSON.stringify(chats)
  );
}

export function loadChats() {
  const data = localStorage.getItem(CHAT_KEY);

  return data ? JSON.parse(data) : [];
}

export function saveActiveChat(id) {
  localStorage.setItem(
    ACTIVE_CHAT_KEY,
    id
  );
}

export function loadActiveChat() {
  return localStorage.getItem(
    ACTIVE_CHAT_KEY
  );
}