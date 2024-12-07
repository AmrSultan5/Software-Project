import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, users } from 'src/models/users.Schema';
import { faker } from '@faker-js/faker';


@Injectable()
export class UsersService {
  constructor(@InjectModel(users.name) private userModel: Model<UserDocument>) {}
  Add(body: UserDto) {
    return this.userModel.create(body);
  }

  FindAll() {
    return this.userModel.find();
  }

  FindOne(id: string) {
    return this.userModel.findOne({ _id: id });
  }

  Update(id: string, body: UserDto) {
    return this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }

  Delete(id: string) {
    return this.userModel.remove({ _id: id });
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
    return this.userModel.find(keyword);
  }

  Faker() {
    for (let index = 0; index < 30; index++) {
      const fakeUser = {
        user_id: faker.datatype.uuid(), // Generates a unique user ID
        name: faker.name.fullName(), // Generates a random full name
        email: faker.internet.email(), // Generates a unique email
        password: faker.internet.password(10), // Generates a random 10-character password
        role: faker.helpers.arrayElement(['student', 'instructor', 'admin']), // Randomly selects a role
        coursesTaught: [], // Empty array for simplicity; update logic if necessary
        coursesEnrolled: [], // Empty array for simplicity; update logic if necessary
        profile_picture_url: faker.image.avatar(), // Generates a random profile picture URL
        createdAt: new Date(), // Sets the current date as creation date
      };
  
      this.userModel.create(fakeUser); // Creates the user in the database
    }
    return 'success';
  }
}