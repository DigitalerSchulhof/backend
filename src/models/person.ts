export type Person = {
  firstname: string;
  lastname: string;
  type: PersonType;
  gender: PersonGender;
  teacherCode: string | null;
  accountId: string | null;
};

export enum PersonType {
  Student,
  Teacher,
  Parent,
  Admin,
  Other,
}

export enum PersonGender {
  Male,
  Female,
  Other,
}
