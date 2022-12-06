import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const P_AWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3_BucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = 300

export class AttachmentUtils{
    constructor(
        private readonly s3 = new P_AWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = s3_BucketName
    ) {}

    getAttachmentUrl(todoId: string) {
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
    }

    getUploadUrl(todoId: string): string {
        console.log('getUploadUrl called')
        const url = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: urlExpiration
        })
        return url as string
    }
}