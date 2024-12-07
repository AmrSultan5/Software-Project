import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { UserDocument, users } from 'src/models/users.Schema';
import { UserDto } from 'src/dto/users.dto'; // Correct import path
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService {
  constructor(@InjectModel(users.name) private userModel: Model<UserDocument>) {}

  // Add(body: UserDto) {

  //   return this.userModel.create(body); 
  // }

  FindAll() {
    return this.userModel.find();
  }
 
  FindOne(_id: string) {
    return this.userModel.findById( _id);
  }

  Update(id: string, body: UserDto) {
    return this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }

  Delete(_id: string): Promise<DeleteResult> {
    return this.userModel.findByIdAndDelete( _id); // Use .exec() for proper Promise handling
  }

  Search(key: string) {
    const keyword = key
      ? {
          $or: [
            { fullname: { $regex: key, $options: 'i' } },
            { email: { $regex: key, $options: 'i' } },
          ],
        }
      : {}; 
    return this.userModel.findOne({keyword});
  }

  Faker() {
    for (let index = 0; index < 30; index++) {
      const fakeUser = {
        user_id: faker.string.uuid(), // Replace with faker.string.uuid()
        name: faker.person.fullName(), // Generates a random full name
        email: faker.internet.email(), // Generates a unique email
        password: faker.internet.password({ length: 10 }),// Generates a random 10-character password
        role: faker.helpers.arrayElement(['student', 'instructor', 'admin']), // Randomly selects a role
        coursesTaught: [],
        coursesEnrolled: [],
        profile_picture_url: faker.image.avatar(), // Generates a random profile picture URL
        createdAt: new Date(),
      };
  
      this.userModel.create(fakeUser);
    }
    return 'success';
  }
}  