export class ServerError extends Error {
    constructor () {
        super('There is a new error. Please contact admin')
        this.name = 'ServerError'
    }
}
