export type SuccessResponse = {
    statusCode: number
    message: string
    data: any
}

export type FailedResponse = {
    statusCode: number,
    error: string
}