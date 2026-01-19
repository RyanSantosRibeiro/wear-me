"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { cancelSubscription } from "@/actions/subscription";
import { DialogClose } from "@radix-ui/react-dialog";

export default function SubscribeCancelButton({ subscriptionId }: { subscriptionId: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-sm text-destructive hover:underline disabled:opacity-50"
                >
                    Cancelar
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancelar assinatura</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja cancelar a assinatura?
                        <br />
                        Essa ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose><Button variant="outline">Cancelar</Button></DialogClose>
                    <Button
                        variant="destructive"
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => cancelSubscription(subscriptionId)}
                    >
                        Confirmar cancelamento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}