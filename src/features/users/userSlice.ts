import { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"
import { User, UserUpdate } from "./type"
import { userApi } from "../auth/api";

interface UserState {
  data: User | null;
  status: "idle" | "loading" | "failed";
}

const initialState: UserState = {
  data: null,
  status: "idle",
}

export const userSlice = createAppSlice({
  name: "user",
  initialState,
  reducers: create => ({
    // Синхронная установка пользователя (например, при логине)
    setUser: create.reducer((state, action: PayloadAction<User>) => {
      state.data = action.payload
    }),

    // Асинхронное получение профиля "Обо мне"
        fetchUser: create.asyncThunk(
      async (id: string) => {
        return await userApi.getUserById(id);
      },
      {
        pending: state => { state.status = "loading" },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.data = action.payload;
        },
        rejected: state => { state.status = "failed" }
      }
    ),


    // Асинхронное обновление профиля
    updateUserProfile: create.asyncThunk(
      async (updateData: UserUpdate) => {
        // Предполагается, что в userApi есть метод update(id, data)
        // Если его нет, используем userApi.update(state.data.id, updateData)
        return await userApi.updateProfile(updateData) 
      },
      {
        fulfilled: (state, action) => {
          state.data = action.payload // Обновляем данные в сторе новыми данными от сервера
        },
      }
    ),

    logout: create.reducer(state => {
      state.data = null
      localStorage.removeItem("token")
    }),
  }),
  selectors: {
    selectUser: state => state.data,
    selectUserStatus: state => state.status,
  },
})

export const { setUser, fetchUser, updateUserProfile, logout } = userSlice.actions
export const { selectUser, selectUserStatus } = userSlice.selectors