import { log } from "console";
import $api from "../auth/api";
import { getToken } from "../auth/utils";
import { Course, Module, NewCourseDto, NewModuleDto, Teacher, NewTeacherDto } from "./type";


export async function fechCoursesList(): Promise<Course[]> {
    const res = await $api.get(
        `/courses`,
        {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            withCredentials: true,
        }
    );
    return res.data;
}

export async function fechCourseById(id: string): Promise<Course> {
    const res = await $api.get(
        `/courses/${id}`,
        {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            withCredentials: true,
        }
    );
    return res.data;
}

export async function fechNewCourse(newCourseDto: NewCourseDto): Promise<Course> {
    console.log(newCourseDto);
    
    const res = await $api.post(
        `/courses`,
        newCourseDto,
        {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            withCredentials: true,
        }
    );
    return res.data;
}

export async function fechAddModule(newModuleDto: NewModuleDto): Promise<Module> {
    console.log(newModuleDto);

    // Убираем лишний JSON.stringify и ручные заголовки, 
    // если $api уже настроен на JSON
    const res = await $api.post<Module>(
        `/courses/modules`,
        newModuleDto
    );
    return res.data;
}

export async function deleteCourse(id: string): Promise<void> {
    await $api.delete(
        `/courses/${id}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            withCredentials: true,
        }
    );
}

export async function deleteModule(id: string): Promise<void> {
    await $api.delete(
        `/modules/${id}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            withCredentials: true,
        }
    );
}

export async function fechModuleById(id: string): Promise<Module> {
    const res = await $api.get(
        `/courses/modules/${id}`,
        {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            withCredentials: true,
        }
    );
    return res.data;
}



export async function fechModulesByCourseId(id: string): Promise<Module[]> {
    const res = await $api.get(
        `/modules/${id}/courses`,
        {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            withCredentials: true,
        }
    );
    return res.data;
}

