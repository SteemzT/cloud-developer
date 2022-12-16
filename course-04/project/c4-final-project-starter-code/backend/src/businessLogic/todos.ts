import { TodosAccess } from '../dataLayer/todosAcess'
import { TodoUpdate } from '../models/TodoUpdate'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import * as uuid from 'uuid'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import * as createError from 'http-errors'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'


// TODO: Implement businessLogic
//Declare log variable
const log = createLogger('TodosAccess')

//Declare attachment_Utils variable
const attachment_Utils = new AttachmentUtils()

//Declare todosAccess variable
const todosAccess = new TodosAccess()

// Write get todos function
// Implement async/await function for getTodosForUser
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  // log info message
    log.info(`Get todos for user ${userId}`, {userId})
    return todosAccess.get_todos(userId)
}

// Write create todo function
// Implement async/await function for createTodo
export async function createTodo(new_Todo: CreateTodoRequest, userId: string): Promise<TodoItem> {

  // Declare variables s3_Attachment_Url, createdAt and todoId
  
  const todoId = uuid.v4()
  const s3_Attachment_Url = attachment_Utils.getAttachmentUrl(todoId)
  const createdAt = new Date().toISOString()
  const new_Item = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: s3_Attachment_Url,
    ...new_Todo
  }

  // log info message
  log.info(`Create todo ${todoId} for user ${userId}`, {userId, todoId, new_Item})

  return await todosAccess.createTodoItem(new_Item)
}

// Write update todo function
// Implement async/await function for updateTodo
export async function updateTodo(todoId: string, todoUpdate: UpdateTodoRequest, userId: string): Promise<TodoUpdate> {
    // log info message
    log.info(`Update todo ${todoId} for user ${userId}`, {todoId, userId, todoUpdate})
    return todosAccess.updateTodoItem(todoId, userId, todoUpdate)
}

// Write delete todo function
// Implement async/await function for deleteTodo
export async function deleteTodo(todoId: string, userId: string): Promise<string> {
    // log info message
    log.info(`Delete todo ${todoId} for user ${userId}`, {todoId, userId})
    return todosAccess.deleteTodoItem(todoId, userId)
}

// Write create attachment function
// Implement async/await function for createAttachmentPresignUrl
export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    // log info message
    log.info('Called create attachment function by user', userId, todoId)
    return attachment_Utils.getUploadUrl(todoId)
}