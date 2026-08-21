export type Conversation = {
  id: string
  name: string
  preview: string
  time: string
  initials: string
  unread?: number
  group?: boolean
  company?: boolean
  members?: number
}

export const conversations = [
  {
    id: "1",
    name: "Product Team",
    preview: "James: Here's the latest update on the roadmap.",
    time: "10:24 AM",
    unread: 3,
    initials: "PT",
    group: true,
    members: 12,
  },
  {
    id: "2",
    name: "Sophia Bennett",
    preview: "Thanks Olivia! Can you share the deck?",
    time: "9:48 AM",
    unread: 1,
    initials: "SB",
  },
  {
    id: "3",
    name: "Design Team",
    preview: "Liam: Uploaded 3 new files.",
    time: "9:15 AM",
    initials: "DT",
    group: true,
    members: 8,
  },
  {
    id: "4",
    name: "Ethan Brooks",
    preview: "Great, let's sync tomorrow.",
    time: "Yesterday",
    initials: "EB",
  },
  {
    id: "5",
    name: "Marketing Team",
    preview: "Mia: Campaign results are in!",
    time: "Yesterday",
    unread: 2,
    initials: "MT",
    group: true,
    members: 6,
  },
  {
    id: "6",
    name: "Jack Mitchell",
    preview: "Sounds good, thanks!",
    time: "May 14",
    initials: "JM",
  },
  {
    id: "7",
    name: "Client: Acme Corp",
    preview: "Sarah: Let's schedule a call.",
    time: "May 13",
    initials: "AC",
    company: true,
  },
  {
    id: "8",
    name: "# General",
    preview: "Riley: Welcome to the team!",
    time: "May 12",
    initials: "#",
    members: 24,
  },
] satisfies readonly Conversation[]

export function getConversationById(conversationId: string) {
  return conversations.find(({ id }) => id === conversationId)
}
