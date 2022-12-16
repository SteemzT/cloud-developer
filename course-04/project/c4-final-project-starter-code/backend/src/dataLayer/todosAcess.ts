//import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import * as AWS from 'aws-sdk'
import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoUpdate } from '../models/TodoUpdate';

var AWSXRay = require('aws-xray-sdk');
const P_AWS = AWSXRay.captureAWS(AWS)

const log = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
// Create TodosAccess Class
export class TodosAccess {
    constructor(

        // Make Todos Table, Index and DocuClient properties readonly
        private readonly DocuClient: DocumentClient = new P_AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
    ) {}
    
    // Implement async/await function for get_todos
    async get_todos(userId: string): Promise<TodoItem[]> {
        // Log info message
        log.info('Called all get todo functions')

        const result = await this.DocuClient
        .query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
            ':userId': userId
            }
        })
        .promise()

        // Assign variable items using const
        const items = result.Items
        return items as TodoItem[]
    }

    // Implement async/await function for createTodoItem
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        log.info('Called create todo item function')

        const result = await this.DocuClient
        .put({
            TableName: this.todosTable,
            Item: todoItem
        })
        .promise()
        // log info message
        log.info('Created todo item', result)

        return todoItem as TodoItem

    }

    // Implement async/await function for updateTodoItem
    async updateTodoItem(
        todoId: string,
        userId: string,
        todoUpdate: TodoUpdate
    ): Promise<TodoUpdate> {
        log.info('Called update todo item function')
     
        const result = await this.DocuClient
        .update({
            TableName: this.todosTable,
            Key: {
            todoId,
            userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
            ':name': todoUpdate.name,
            ':dueDate': todoUpdate.dueDate,
            ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
            '#name': 'name'
            },
            ReturnValues: 'ALL_NEW'
        })
        .promise()

        const todoItemUpdate = result.Attributes
        log.info('Updated Todo item', todoItemUpdate)
        return todoItemUpdate as TodoUpdate
    }

    // Implement async/await function for deleteTodoItem
    async deleteTodoItem(todoId: string, userId: string): Promise<string> {
        // log info message
        log.info('Called delete todo item function')
        
        const result = await this.DocuClient
        .delete({
            TableName: this.todosTable,
            Key: {
            todoId,
            userId
            }
        })
        .promise()
        log.info('Deleted todo Item', result)
        return todoId as string
    }

    // Implement async/await function for updateTodoAttachmentUrl
    async updateTodoAttachmentUrl(
        todoId: string,
        userId: string,
        attachmentUrl: string
    ): Promise<void> {
        // log info message
        log.info('Called update todo attachment url function')

        await this.DocuClient
        .update({
            TableName: this.todosTable,
            Key: {
            todoId,
            userId },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
            ':attachmentUrl': attachmentUrl
            }
        })
        .promise()
    }
    
}