import $api from "../auth/api";
import { getToken } from "../auth/utils";
import { NewTeacherDto, Teacher } from "../courses/type";

export async function fechTeachersList(): Promise<Teacher[]> {
    const res = await $api.get(
        `/teachers`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            withCredentials: true,
        }
    );
    return res.data;
}

export async function fechAddTeacher(newTeacher: NewTeacherDto): Promise<Teacher> {
    const res = await $api.post(
        `/teachers`,
        newTeacher,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            withCredentials: true,
        }
    );
    return res.data;
}

export async function fechDeleteTeacher(id: string): Promise<void> {
    await $api.delete(
        `/teachers/${id}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            withCredentials: true,
        }
    );
}