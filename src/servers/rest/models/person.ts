export type Person = {
  firstname: string;
  lastname: string;
  type: PersonType;
  gender: PersonGender;
  teacherCode: string | null;
  accountId: string | null;
};

export type PersonType = 'student' | 'teacher' | 'parent' | 'admin' | 'other';

export type PersonGender = 'male' | 'female' | 'other';
