export type CreateConversationPayload = { userId: string }
export type CreateGroupPayload = { name: string; participantIds: string[] }
export type CreatedConversation = {
  _id: string
  participants: string[]
  createdAt: string
}
export type CreatedGroup = { _id: string }
