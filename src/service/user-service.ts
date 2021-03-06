import { injectable, inject } from 'inversify';
import Types from '../config/types';
import { NotFound, Conflict } from '../utils/exceptions';
import { User, UserInterface } from '../entity/user';
import { UserRepository } from '../repository/user-repository';


export interface UserService {
    getAll(): Promise<User[]>;
    getById(id: string): Promise<User>;
    save(user: UserInterface): Promise<User>;
    getByEmail(email: string): Promise<User>;
}

@injectable()
export class UserServiceImp implements UserService {

    constructor(
        @inject(Types.UserRepository) private userRepository: UserRepository
    ) {}

    public async getAll(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    public async getById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (user !== undefined) return user;
        throw new NotFound('cant find the user');
    }

    public async save(user: UserInterface): Promise<User> {
        const createdUser = await this.userRepository.save(user);
        if (!!createdUser) return createdUser;
        throw new Conflict('Cant create new user');
    }

    public async getByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findByQuery({ where: { email }, take: 1 });
        if (!!user && user.length > 0) return user[0];
        throw new NotFound('No user found');
    }

}
