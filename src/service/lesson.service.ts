import BaseService from './base.service';

interface ILessonService{
     create({teacherId, roomId, name, day, hour}: {teacherId: number, roomId: number, name: string, day: number, hour: number}): Promise<number>;
}

/*
* TODOS: unit test
* implement IoC for easier unit test
*/
export default class LessonService extends BaseService implements ILessonService{
     
     constructor(){
          super('LessonService');
     }

     async create({teacherId, roomId, name, day, hour}: {teacherId: number, roomId: number, name: string, day: number, hour: number}){
          
          const creatingSession = { day, startTime: hour };
          this._debug('creatingSession = ', creatingSession);
          
          let session = await this._prisma.session.findFirst({where : creatingSession });
          this._debug('foundSession = ', session);
  
          if( !session ){
              session = await this._prisma.session.create({ data: creatingSession })
              this._debug('createdSession = ', session);
          }
    
          const foundTeacherLesson = await this._prisma.lesson.findFirst({ where: { teacherId, sessionId: session.id}});
          const foundRoomLesson = await this._prisma.lesson.findFirst({ where: { roomId, sessionId: session.id}});
  
          this._debug('foundTeacherLesson = ', foundTeacherLesson);
          this._debug('foundRoomLesson = ', foundRoomLesson);
  
          if( foundTeacherLesson ){
              const foundTeacher = await this._prisma.teacher.findFirst({ where: { id: teacherId}});
              throw new Error(`Teacher (${foundTeacher.title} ${foundTeacher.name}) has been booked for this session (${day} ${hour}:00)`);
          }
  
          if( foundRoomLesson ){
              const foundRoom = await this._prisma.room.findFirst({ where: { id: roomId}});
              throw new Error(`Room (${foundRoom.name}) has been booked for this session (${day} ${hour}:00)`);
          }
  
          const lesson = await this._prisma.lesson.create({ data: { name, teacherId , roomId, sessionId: session.id}});
  
          this._log('created lesson = ', lesson);   
          
          return lesson.id;
     }

}
