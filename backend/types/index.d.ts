import { User } from "../../models/User";

declare global {
    namespace Express {
        interface Request {
            user: Omit<User,'id'>
        }
    }
}
export {};