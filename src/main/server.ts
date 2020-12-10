import { MongoHelper } from '../infra/db/mongodb/helper/mongodb-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
    .then(async (): Promise<void> => {
        const app = (await import('./config/app')).default
        app.listen(env.port, (): void => console.log(`Server running on port ${env.port}`))
    })
    .catch((err): void => {
        console.log(err)
    })
