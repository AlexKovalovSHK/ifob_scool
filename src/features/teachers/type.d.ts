export interface Teacher {
  id: string
  email: string
  name: string
  bio: string
  image?: string
  specialization: string
}

export interface NewTeacherDto {
  name: string
  email: string
  bio: string
  specialization: string
  image?: string
}

export interface UpdateTeacherDto {
  id: string
  name?: string;
  email?: string;
  bio?: string;
  specialization?: string
}