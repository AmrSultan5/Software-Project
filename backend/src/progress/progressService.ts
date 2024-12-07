import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress , ProgressDocument } from 'src/models/progress.Schema';
import { Courses ,CourseDocument } from 'src/models/courses.Schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    @InjectModel(Courses.name) private courseModel: Model<CourseDocument>,
  ) {}

  // Fetch progress for a specific student
  async getStudentProgress(studentId: string) {
    const progress = await this.progressModel
      .find({ userId: studentId })
      .populate('courseId', 'title') // Populate with 'title' for courses
      .populate('completedModules', 'title') // Populate 'title' for completed modules
      .exec();
  
    return progress.map((p) => ({
      course: p.courseId,
      completionPercentage: p.completionPercentage,
      timeSpent: p.timeSpent,
      averageScore: p.averageScore,
      completedModules: p.completedModules.map((module) => module),
      lastAccessed: p.lastAccessed,
    }));
  }
  

  // Update a student's progress
  async updateStudentProgress(studentId: string, courseId: string, updateData: any) {
    const progress = await this.progressModel.findOneAndUpdate(
      { userId: studentId, courseId },
      { $set: updateData },
      { new: true, upsert: true },
    );
    return progress;
  }

  // Fetch analytics for courses created by an instructor
  async getInstructorAnalytics(instructorId: string) {
    const courses = await this.courseModel.find({ createdBy: instructorId });

    const analytics = await Promise.all(
      courses.map(async (course) => {
        const progressData = await this.progressModel.find({ courseId: course._id });

        const totalStudents = progressData.length;
        const averageCompletion =
          progressData.reduce((sum, p) => sum + p.completionPercentage, 0) /
          (totalStudents || 1);

        const averageScore =
          progressData.reduce((sum, p) => sum + p.averageScore, 0) /
          (totalStudents || 1);

        const totalTimeSpent = progressData.reduce((sum, p) => sum + p.timeSpent, 0);

        return {
          course: course.title,
          totalStudents,
          averageCompletion,
          averageScore,
          totalTimeSpent,
        };
      }),
    );

    return analytics;
  }
}
