import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDto, ResourceDto, SectionDto } from 'src/dto/courses.dto';
import { CourseDocument, Courses } from 'src/models/courses.Schema';
import { DeleteResult } from 'mongodb';
import { Enrollment, EnrollmentDocument } from 'src/models/enrollment-schema';

@Injectable()
export class CoursesService 
{
    constructor(
        @InjectModel(Courses.name) private courseModel: Model<CourseDocument>,
        @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,
){}

    CreateCourse(body: CourseDto)
    {
        return this.courseModel.create(body);
    }

    AllCourses()
    {
        return this.courseModel.find();
    }

    OneCourse(id: string)
    {
        return this.courseModel.findOne({course_id: id});
    }

    UpdateCourse(id: string, body: CourseDto)
    {
        return this.courseModel.findOneAndUpdate(
            {course_id: id}, 
            {$set: body},
            { new: true }
        );
    }

    DeleteCourse(id: string): Promise<DeleteResult>
    {
        return this.courseModel.deleteOne({course_id: id}).exec();
    }

    Search(key: string) {
        const keyword = key
            ? {
                $or: [
                    { course_id: { $regex: key, $options: 'i' } },
                    { title: { $regex: key, $options: 'i' } },
                    { description: { $regex: key, $options: 'i' } },
                    { category: { $regex: key, $options: 'i' } },
                    { difficulty_level: { $regex: key, $options: 'i' } },
                    { created_by: { $regex: key, $options: 'i' } },
                    { 'resources.url': { $regex: key, $options: 'i' } },
                    { 'resources.type': { $regex: key, $options: 'i' } },
                    { 'hierarchy.section': { $regex: key, $options: 'i' } },
                    { 'hierarchy.lessons.title': { $regex: key, $options: 'i' } },
                    { 'hierarchy.lessons.content': { $regex: key, $options: 'i' } },
                ],
            }
            : {};
        return this.courseModel.find(keyword).exec().then((result) => result || []);
    }    
    

    async AddResource(courseId: string, resource: ResourceDto) {
        return this.courseModel.findOneAndUpdate(
          { course_id: courseId },
          { $push: { resources: resource } },
          { new: true },
        );
      }
    
      
      async AddHierarchy(courseId: string, hierarchy: SectionDto[]) {
        return this.courseModel.findOneAndUpdate(
          { course_id: courseId },
          { $set: { hierarchy } },
          { new: true },
        );
      }

      async enrollUserInCourse(user_id: string, course_id: string): Promise<any> {
        const course = await this.courseModel.findOne({ course_id });
        if (!course) {
            throw new Error(`Course with ID ${course_id} not found.`);
        }
    
        // Check if user is already enrolled
        const existingEnrollment = await this.enrollmentModel.findOne({ user_id, course_id });
        if (existingEnrollment) {
            throw new Error('User is already enrolled in this course.');
        }
    
        // Create enrollment
        const enrollment = {
            user_id, // Use the explicit user_id passed from the JWT
            course_id,
            enrolled_at: new Date(),
            status: 'active',
        };
        return this.enrollmentModel.create(enrollment);
    }

    async getUserEnrollments(user_id: string) {
        console.log("Service: Fetching enrollments for user_id:", user_id);
    
        const enrollments = await this.enrollmentModel.find({ user_id });
        console.log("Service: Enrollments found:", enrollments);
    
        if (!enrollments || enrollments.length === 0) {
            console.log("Service: No enrollments found for user_id:", user_id);
            return [];
        }
    
        return enrollments;
    }  
    
    async FindCourseByInstructorID(instructorID: string) {
        return this.courseModel.find(
            {taught_by: instructorID}
        )
      }
    
}
