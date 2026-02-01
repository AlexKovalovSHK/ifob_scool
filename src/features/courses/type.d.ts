export interface Course {
    id: number;
    title: string;
    description: string;
    image: string;
    author: string;
    price?: number;
    rating: number;
    createdAt?: string;
    updatedAt?: string;
    modules: Module[];
}

export interface CourseState {
    courses: Course[];
    loading: boolean;
    error: string | null;
}

export interface Module {
    id: number;
    title: string;
    description: string;
    topics?: string[];
    homework?: string;
    image: string;
    author: string;
    price?: number;
    rating: number;
    createdAt?: string;
    updatedAt?: string;
    hours?: number;
}

export interface Teacher {
    id: number;
    name: string;
    bio: string;
    image: string;
    specialization: string;
}
