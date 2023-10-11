import {FormEvent, FormHTMLAttributes} from "react";

export type Props = {
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void
} & FormHTMLAttributes<HTMLFormElement>
