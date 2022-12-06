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
    log.info('Called get todos for user function')
    return todosAccess.getAllTodos(userId)
}

// Write create todo function
// Implement async/await function for createTodo
export async function createTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  // log info message
  log.info('Called create todo function')

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const s3_Attachment_Url = attachment_Utils.getAttachmentUrl(todoId)
  const new_Item = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: s3_Attachment_Url,
    ...newTodo
  }

  return await todosAccess.createTodoItem(new_Item)
}

// Write update todo function
// Implement async/await function for updateTodo
export async function updateTodo(
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string
    ): Promise<TodoUpdate> {
    // log info message
    log.info('Called update todo function')
    return todosAccess.updateTodoItem(todoId, userId, todoUpdate)
}

// Write delete todo function
// Implement async/await function for deleteTodo
export async function deleteTodo(
    todoId: string,
    userId: string
    ): Promise<string> {
    // log info message
    log.info('Called delete todo function')
    return todosAccess.deleteTodoItem(todoId, userId)
}

// Write create attachment function
// Implement async/await function for createAttachmentPresignUrl
export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string
    ): Promise<string> {
    // log info message
    log.info('Called create attachment function by user', userId, todoId)
    return attachment_Utils.getUploadUrl(todoId)
}