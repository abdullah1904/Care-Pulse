"use client"
import { ReactNode } from "react"
import { E164Number } from "libphonenumber-js/core";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { FormFieldTypes } from "./forms/PatientForm"
import Image from "next/image"
import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

type Props = {
    control: Control<any>,
    fieldType: FormFieldTypes,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: ReactNode,
    renderSkeleton?: (field: any) => ReactNode
}

const RenderField = ({ field, props }: { field: any, props: Props }) => {
    const { iconSrc, fieldType, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton } = props;
    switch (fieldType) {
        case FormFieldTypes.INPUT:
            return (
                <section className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image src={iconSrc} height={24} width={24} alt={iconAlt || 'icon'} className="ml-2" />
                    )}
                    <FormControl>
                        <Input placeholder={placeholder} {...field} className="shad-input border-0" />
                    </FormControl>
                </section>
            )
        case FormFieldTypes.PHONE_INPUT:
            return (
                <section>
                    <FormControl>
                        <PhoneInput
                            defaultCountry="PK"
                            placeholder={props.placeholder}
                            international
                            withCountryCallingCode
                            value={field.value as E164Number | undefined}
                            onChange={field.onChange}
                            className="input-phone"
                        />
                    </FormControl>
                </section>
            )
        case FormFieldTypes.DATE_PICKER:
            return (
                <section className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image src="/assets/icons/calendar.svg" height={24} width={24} alt="calendar" className="ml-2" />
                    <FormControl>
                        <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat ?? "MM/dd/yyyy"}
                            showTimeSelect={showTimeSelect ?? false}
                            timeInputLabel="Time:"
                            wrapperClassName="date-picker"
                        />
                    </FormControl>
                </section>
            )
        case FormFieldTypes.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null;
        case FormFieldTypes.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )
        case FormFieldTypes.TEXTAREA:
            return(
                <FormControl>
                    <Textarea placeholder={placeholder} {...field} className="shad-textArea" disabled={props.disabled}/>
                </FormControl>
            )
        case FormFieldTypes.CHECKBOX:
            return (
                <FormControl>
                    <section className="flex items-center gap-4">
                        <Checkbox id={props.name} checked={field.value} onCheckedChange={field.onChange}/>
                        <label htmlFor={props.name} className="checkbox-label">
                            {props.label}
                        </label>
                    </section>
                </FormControl>
            )
        default: break;
    }
}

const CustomFormField = (props: Props) => {
    const { control, name, label, fieldType } = props;
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                    {fieldType !== FormFieldTypes.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}
                    <RenderField field={field} props={props} />
                    <FormMessage className="shad-error" />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField