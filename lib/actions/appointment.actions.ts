"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
    APPOINTMENT_COLLECTION_ID,
    DATABASE_ID,
    databases,
    messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";

//  CREATE APPOINTMENT
export const createAppointment = async (
    appointment: CreateAppointmentParams
) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        );
        revalidatePath("/admin");
        return parseStringify(newAppointment);
    } catch (error) {
        console.error("An error occurred while creating a new appointment:", error);
    }
};

//  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")]
        );
        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };
        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
                switch (appointment.status) {
                    case "scheduled":
                        acc.scheduledCount++;
                        break;
                    case "pending":
                        acc.pendingCount++;
                        break;
                    case "cancelled":
                        acc.cancelledCount++;
                        break;
                }
                return acc;
            },
            initialCounts
        );
        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
        };
        return parseStringify(data);
    } catch (error) {
        console.error(
            "An error occurred while retrieving the recent appointments:",
            error
        );
    }
};

//  SEND SMS NOTIFICATION
export const sendEmailNotification = async (userId: string,subject:string, content: string) => {
    try {
        const message = await messaging.createEmail(
            ID.unique(),
            subject,
            content,
            [],
            [userId]
        );
        return parseStringify(message);
    } catch (error) {
        console.error("An error occurred while sending sms:", error);
    }
};

//  UPDATE APPOINTMENT
export const updateAppointment = async ({
    appointmentId,
    userId,
    appointment,
    type,
}: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        );
        if (!updatedAppointment) throw Error;
        const emailHeading = type==="schedule" ? 'Appointment Confirmed' : 'Appointment Rejected'
        const emailMessage = `
            <!DOCTYPE html>
            <html>
            <head></head>
            <body style="margin: 0; padding: 0; box-sizing: border-box; font-family: sans-serif; background-color: #131619; color: #6b7280;">
                <div class="container" style="width: 80%; max-width: 600px; margin: 0 auto; padding: 10px; border-radius: 10%; text-align: center; background-color: #131619; color: #6b7280;">
                    <div class="header" style="text-align: center; padding: 10px; color: white;">
                        <img src="https://cloud.appwrite.io/v1/storage/buckets/668d1cc10006a18a84b1/files/66979d9a0030b07962e6/view?project=668d1b73002fa79babcd" alt="Logo" style="width: 60%;">
                        <h1 style="font-size: 32px; margin: 10px 0; font-weight: bold;">Greetings from CarePulse</h1>
                    </div>
                    <div class="content" style="padding: 10px;">
                        ${type === "schedule" ? `<p>Your appointment is <span style="color: #24AE7C;">confirmed</span> for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}</p>` : `<p>We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is <span style="color: #F37877;">cancelled</span>. Reason:  ${appointment.cancellationReason}.</p>`}
                    </div>
                </div>
            </body>
            </html>`;
        await sendEmailNotification(userId, emailHeading,emailMessage);
        revalidatePath("/admin");
        return parseStringify(updatedAppointment);
    } catch (error) {
        console.error("An error occurred while scheduling an appointment:", error);
    }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        );
        return parseStringify(appointment);
    } catch (error) {
        console.error(
            "An error occurred while retrieving the existing patient:",
            error
        );
    }
};