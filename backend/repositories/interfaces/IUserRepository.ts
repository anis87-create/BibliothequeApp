import type { User } from './../../models/User';
export interface IUserRepository {
    findAll():  Promise<User[]>,
    register(user: User): Promise<User>,
    findById(id: number): Promise<User | null>,
    findByEmail(email: string): Promise<User|null>
}