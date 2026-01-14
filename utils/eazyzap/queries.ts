import { cache } from "react";

export const getConversations = cache(async (accessToken: string) => {
    try {
        const response = await fetch("http://localhost:8080/whatsapp/conversations", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log({ conversationsresponse: response });
        if (!response.ok) {
            throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        return data.chats;
    } catch (error) {
        console.log(error);
        return null;
    }
});

export const getSession = cache(async (accessToken: string) => {
    try {
        const response = await fetch("http://localhost:8080/whatsapp/session", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log({ response });
        if (!response.ok) {
            throw new Error("Failed to fetch session");
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Erro ao buscar chats:', error?.message);
        return null;
    }

});

export const getQrCode = cache(async (accessToken: string, sessionId: string) => {
    try {
        const response = await fetch(`http://localhost:8080/whatsapp/session/${sessionId}/qr`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log({ qrcoderesponde: response });
        if (!response.ok) {
            throw new Error("Failed to fetch session");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
});

export const sendMessage = cache(async (accessToken: string, chatId: string, message: string) => {
    try {
        const response = await fetch("http://localhost:8080/whatsapp/messages/send", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId: chatId,
                message: message
            })
        });
        console.log({ response });
        if (!response.ok) {
            throw new Error("Failed to fetch session");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
});

export const getMessages = cache(async (accessToken: string, chatId: string) => {
    try {
        const response = await fetch(`http://localhost:8080/whatsapp/conversations/${chatId}/messages`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log({ response });
        if (!response.ok) {
            throw new Error("Failed to fetch session");
        }
        const data = await response.json();
        return data.messages;
    } catch (error) {
        console.log(error);
        return null;
    }
});
