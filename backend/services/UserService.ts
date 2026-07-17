import type {User} from "../models/User";
import UserRepository = require("../repositories/UserRepostiory");

class UserService {
    constructor(private userRepository: UserRepository){}

    async findAll() {
        return this.userRepository.findAll();
    }
    async register(form: User){
        const user =  await this.userRepository.register(form);
        return user;
    }
    async findById(id: number){
        const user = await this.userRepository.findById(id);
        if(!user){
            throw new Error('user not found')
        }
        return user;
    }
    async findByEmail(email: string){
        const user = await this.userRepository.findByEmail(email);
        if(!user){
            throw new Error('user not found')
        }
        return user;
    }
}

export = UserService;