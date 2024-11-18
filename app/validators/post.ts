import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  'required': 'The {{ field }} field is required',
  'string': 'The value of {{ field }} field must be a string',

  // Error message for the username field
  'title.required': 'Title is required',
  'content.required': 'Content is required',
  'title.string': 'Title must be a string',
  'content.string': 'Content must be a string',
})
export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string(),
    content: vine.string(),
  })
)
