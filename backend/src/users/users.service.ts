import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, users } from 'src/models/users.Schema';
import { CourseDocument, Courses } from 'src/models/courses.Schema';
import { UserDto } from 'src/dto/users.dto';
import { DeleteResult } from 'mongodb';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(users.name) private userModel: Model<UserDocument>,
    @InjectModel(Courses.name) private courseModel: Model<CourseDocument>
) {}

  Add(body: UserDto): Promise<UserDocument> {
    return this.userModel.create(body); // Saves the new user to the database
  }

  FindAll() {
    return this.userModel.find().exec();
  }

  FindOne(user_id: number) {
    return this.userModel.findOne({ user_id }).exec();
  }

  Update(user_id: number, body: UserDto) {
    return this.userModel
      .findOneAndUpdate({ user_id }, { $set: body }, { new: true })
      .exec();
  }

  Delete(user_id: number): Promise<DeleteResult> {
    return this.userModel.deleteOne({ user_id }).exec().then((result) => {
      if (result.deletedCount === 0) {
        throw new Error(`No user found with user_id: ${user_id}`);
      }
      return result;
    });
  }    

  Search(user_id: number) {
    const keyword = user_id
      ? { user_id: user_id.toString() }
      : {};
  
    return this.userModel.find(keyword).exec();
  }   

  Faker() {
    for (let index = 0; index < 30; index++) {
      const fakeUser = {
        user_id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
        role: faker.helpers.arrayElement(['student', 'instructor', 'admin']),
        coursesTaught: [],
        coursesEnrolled: [],
        profile_picture_url: faker.image.avatar(),
        createdAt: new Date(),
      };

      this.userModel.create(fakeUser);
    }
    return 'success';
  }

  async GetEnrolledStudents(instructorId: string): Promise<UserDocument[]> {
    // Step 1: Find courses taught by the instructor
    const coursesTaught = await this.courseModel.find({ taught_by: instructorId }).exec();

    console.log(coursesTaught)
    if (!coursesTaught.length) {
      return []; // Return empty array if no courses found
    }

    const courseIds = coursesTaught.map(course => course.course_id); // Assuming course_id is unique

    console.log(courseIds)

    // Step 2: Find students enrolled in these courses
    const students = this.userModel.find({
      role: 'student',
      coursesEnrolled: { $in: courseIds },
    }).exec();

    return students;
  }
}
