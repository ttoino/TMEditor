import React, { useState } from "react";
import Button from "./Button";
import { MdDeleteOutline } from "react-icons/md";
import Dialog, { DialogTitle } from "./Dialog";

interface Props extends React.ComponentProps<typeof Button> {}

export default function DeleteButton({ onClick, ...props }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button icon onClick={() => setOpen(!open)} {...props}>
                <MdDeleteOutline />
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Are you sure?</DialogTitle>

                <Button
                    onClick={(e) => {
                        setOpen(false);
                        return onClick?.(e);
                    }}
                >
                    Yes
                </Button>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
            </Dialog>
        </>
    );
}
