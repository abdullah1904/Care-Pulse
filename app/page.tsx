import Image from 'next/image'
import PatientForm from '@/components/forms/PatientForm'
import Link from 'next/link'
import {PasskeyModal} from '@/components/PassKeyModal'

const Home = ({searchParams}:SearchParamProps) => {
  const isAdmin = searchParams.admin === 'true'

  return (
    <main className='flex h-screen max-h-screen'>
      {isAdmin && <PasskeyModal/>}
      <section className='remove-scrollbar container my-auto'>
        <section className='sub-container max-w-[496px] '>
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt='Patient'
            className='mb-12 h-10 w-fit' />
          <PatientForm />
          <section className='text-14-regular mt-20 flex justify-between'>
            <p className='justify-items-end text-dark-600 xl:text-left'>
              © 2024 Care Pulse
            </p>
            <Link href="/?admin=true" className='text-green-500'>
              Admin
            </Link>
          </section>
        </section>
      </section>
      <Image
        src='/assets/images/onboarding-img.png'
        height={1000}
        width={1000}
        alt='patient'
        className='side-img max-w-[50%] '
      />
    </main>
  )
}

export default Home