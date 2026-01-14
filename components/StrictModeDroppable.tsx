
// StrictModeDroppable.tsx
// Credits to https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175625051
import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "@hello-pangea/dnd";

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    if (!enabled) {
        return null;
    }

    return <Droppable {...props}>{children}</Droppable>;
};
