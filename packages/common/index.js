import * as Yup from "yup";

export const formSchema = Yup.object({
    username: Yup.string()
        .required("Username required")
        .min(6, "Username too short!")
        .max(28, "Username too long!"),
    password: Yup.string()
        .required("Password required")
        .min(6, "Password too short!")
        .max(28, "Password too long!"),
});

export const friendSchema = Yup.object({
    friendName: Yup.string()
        .required("Username required")
        .min(6, "Invalid username!")
        .max(28, "Invalid username!")
})