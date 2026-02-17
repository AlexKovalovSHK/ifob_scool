export interface Course {
  id: string | number
  title: string
  description: string
  image: string
  author: string
  authorId?: string
  price?: number
  priceAmount?: number
  priceCurrency?: string
  note?: string
  rating: number
  createdAt?: string
  updatedAt?: string
  modules: Module[]
}

export interface CourseState {
  courses: Course[]
  loading: boolean
  error: string | null
}

export interface Module {
  id: number
  title: string
  description: string
  topics?: string[]
  homework?: string
  image: string
  author: string
  price?: number
  rating: number
  createdAt?: string
  updatedAt?: string
  hours?: number
}

export interface Teacher {
  id: string
  name: string
  bio: string
  image: string
  specialization: string
}

export interface NewCourseDto {
  title: string;
    slug: string;
    description: string;
    priceAmount: number;
    priceCurrency?: string = 'RUB';
    authorId: string;
    note?: string;
}

export interface NewModuleDto {
  courseId: string
  title: string
  description: string
  topics?: string[]
  homework?: string
  image?: string
  author: string
  rating?: number
}

export interface NewTeacherDto {
  name: string
  specialization: string
  bio: string
  image: string
}
