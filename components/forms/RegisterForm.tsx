"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { optional, z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, getUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldTypes } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"

const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",
        },
    })
    const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
        setIsLoading(true);
        let formData;
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,

            });
            formData = new FormData();
            formData.append('blobFile', blobFile);
            formData.append('fileName', values.identificationDocument[0].name);
        }
        console.log(user.$id);
        try {
            const patient = {
                userId: user.$id,
                name: values.name,
                email: values.email,
                phone: values.phone,
                birthDate: new Date(values.birthDate),
                gender: values.gender,
                address: values.address,
                occupation: values.occupation,
                emergencyContactName: values.emergencyContactName,
                emergencyContactNumber: values.emergencyContactNumber,
                primaryPhysician: values.primaryPhysician,
                insuranceProvider: values.insuranceProvider,
                insurancePolicyNumber: values.insurancePolicyNumber,
                allergies: values.allergies,
                currentMedication: values.currentMedication,
                familyMedicalHistory: values.familyMedicalHistory,
                pastMedicalHistory: values.pastMedicalHistory,
                identificationType: values.identificationType,
                identificationNumber: values.identificationNumber,
                identificationDocument: values.identificationDocument
                    ? formData
                    : undefined,
                privacyConsent: values.privacyConsent,
                treatmentConsent: values.treatmentConsent,
                disclosureConsent: values.disclosureConsent,
            };
            const newPatient = await registerPatient(patient);
            if (newPatient) {
                router.push(`/patients/${user.$id}/new-appointment`);
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>
                <section className="space-y-6">
                    <section className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </section>
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
                <section className="flex flex-col gap-6 xl:flex-row">
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
                </section>
                <section className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.DATE_PICKER}
                        control={form.control}
                        name="birthDate"
                        label="Date of Birth"
                    />
                    <CustomFormField
                        fieldType={FormFieldTypes.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                                    {GenderOptions.map((option) => (
                                        <section key={option} className="radio-group">
                                            <RadioGroupItem value={option} id={option} />
                                            <Label htmlFor={option} className="cursor-pointer">{option[0].toUpperCase() + option.slice(1)}</Label>
                                        </section>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </section>
                <section className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.INPUT}
                        control={form.control}
                        name="address"
                        label="Address"
                        placeholder="51 C Commercial, PIA Main Boulevard"
                    />
                    <CustomFormField
                        fieldType={FormFieldTypes.INPUT}
                        control={form.control}
                        name="occupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                    />
                </section>
                <section className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.INPUT}
                        control={form.control}
                        name="emergencyContactName"
                        label="Emergency Contact Name"
                        placeholder="Guardian's name"
                    />
                    <CustomFormField
                        fieldType={FormFieldTypes.PHONE_INPUT}
                        control={form.control}
                        name="emergencyContactNumber"
                        label="Emergency Contact Number"
                        placeholder="(555) 123-34567"
                    />
                </section>
                <section className="space-y-6">
                    <section className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </section>
                </section>
                <CustomFormField
                    fieldType={FormFieldTypes.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Primary Physician"
                    placeholder="Select a Physician"
                >
                    {Doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                            <section className="flex cursor-pointer items-center gap-2">
                                <Image src={doctor.image} width={32} height={32} alt={doctor.name} className="rounded-full border border-dark-500" />
                                <p>{doctor.name}</p>
                            </section>
                        </SelectItem>
                    ))}
                </CustomFormField>
                <section className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.INPUT}
                        control={form.control}
                        name="insuranceProvider"
                        label="Insurance Provider"
                        placeholder="State Life"
                    />
                    <CustomFormField
                        fieldType={FormFieldTypes.INPUT}
                        control={form.control}
                        name="insurancePolicyNumber"
                        label="Insurance Policy Number"
                        placeholder="ABC1234567890"
                    />
                </section>
                <section className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.TEXTAREA}
                        control={form.control}
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="Peanuts, Penicillin, Pollen"
                    />
                    <CustomFormField
                        fieldType={FormFieldTypes.TEXTAREA}
                        control={form.control}
                        name="currentMedication"
                        label="Current Medication (if any)"
                        placeholder="Ibuprofen 200mg, Paracetamol 500mg"
                    />
                </section>
                <section className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.TEXTAREA}
                        control={form.control}
                        name="familyMedicalHistory"
                        label="Family Medical History"
                        placeholder="Mother had diabetes, Father has hypertension"
                    />
                    <CustomFormField
                        fieldType={FormFieldTypes.TEXTAREA}
                        control={form.control}
                        name="pastMedicalHistory"
                        label="Past Medical History"
                        placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
                    />
                </section>
                <section className="space-y-6">
                    <section className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </section>
                </section>
                <CustomFormField
                    fieldType={FormFieldTypes.SELECT}
                    control={form.control}
                    name="identificationType"
                    label="Identification Type"
                    placeholder="Select an Identification Type"
                >
                    {IdentificationTypes.map((idType) => (
                        <SelectItem key={idType} value={idType}>
                            {idType}
                        </SelectItem>
                    ))}
                </CustomFormField>
                <CustomFormField
                    fieldType={FormFieldTypes.INPUT}
                    control={form.control}
                    name="identificationNumber"
                    label="Identification Number"
                    placeholder="1234567890"
                />
                <CustomFormField
                    fieldType={FormFieldTypes.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned copy of Identification Document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange} />
                        </FormControl>
                    )}
                />
                <section className="space-y-6">
                    <section className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </section>
                </section>
                <CustomFormField
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to receive treatment for my health condition."
                />
                <CustomFormField
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to use and disclosure of my health information for treatment purpose."
                />
                <CustomFormField
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I acknowledge that I gave reviewed and agree to the privacy policy."
                />
                <SubmitButton isLoading={isLoading}>
                    Get Started
                </SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm