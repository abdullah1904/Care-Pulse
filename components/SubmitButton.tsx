import { ReactNode } from "react"
import { Button } from "./ui/button"
import Image from "next/image"

type Props = {
    isLoading: boolean,
    className?:string,
    children: ReactNode
}

const SubmitButton = ({isLoading, className, children}: Props) => {
    return (
        <Button type="submit" disabled={isLoading} className={className ?? "shad-primary-btn w-full"}>
            {isLoading ? (
                <section className="flex items-center gap-4">
                    <Image src="/assets/icons/loader.svg" alt="loader" height={24} width={24} className="animate-spin" />
                    Loading...
                </section>
            ) : children}
        </Button>
    )
}

export default SubmitButton