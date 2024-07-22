"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, getPatient } from "@/lib/actions/patient.actions"

export enum FormFieldTypes {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phone",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = 'select',
    SKELETON = "skeleton"
}


const PatientForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })
    const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
        setIsLoading(true);
        try {
            const user = {
                name: values.name,
                email: values.email,
                phone: values.phone,
            };
            const newUser = await createUser(user);
            if (newUser?.success && newUser.newUser) {
                router.push(`/patients/${newUser.newUser.$id}/register`);
            }
            else if (newUser?.existingUser) {
                const patient = await getPatient(newUser?.existingUser.$id)
                if (patient) {
                    router.push(`/patients/${newUser?.existingUser?.$id}/new-appointment`);
                }
                else {
                    router.push(`/patients/${newUser?.existingUser.$id}/register`);
                }
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi there 👋</h1>
                    <p className="text-dark-700">Schedule your first appointment.</p>
                </section>
                <CustomFormField
                    fieldType={FormFieldTypes.INPUT}
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Abdullah"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
                <CustomFormField
                    fieldType={FormFieldTypes.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="abdullah@gmail.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />
                <CustomFormField
                    fieldType={FormFieldTypes.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder="(555) 123-34567"
                />
                <SubmitButton isLoading={isLoading}>
                    Get Started
                </SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm