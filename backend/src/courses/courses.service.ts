import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDto, ResourceDto, SectionDto } from 'src/dto/courses.dto';
import { CourseDocument, Courses } from 'src/models/courses.Schema';
import { DeleteResult } from 'mongodb';

@Injectable()
export class CoursesService 
{
    constructor(@InjectModel(Courses.name) private courseModel: Model<CourseDocument>){}

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

      async FindCourseByInstructorID(instructorID: string) {
        return this.courseModel.find(
            {taught_by: instructorID}
        )
      }
      
}
