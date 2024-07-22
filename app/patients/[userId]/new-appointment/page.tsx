import AppointmentForm from '@/components/forms/AppointmentForm'
import { getPatient } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import React from 'react'
import * as Sentry from "@sentry/nextjs"

const page = async ({params: {userId}}: SearchParamProps) => {
  const patient = await getPatient(userId);
  Sentry.metrics.set('user_view_new-appointment',patient.name);
  return (
    <section className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <section className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />
          <p className="copyright py-12">© 2024 CarePluse</p>
        </section>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </section>
  )
}

export default page