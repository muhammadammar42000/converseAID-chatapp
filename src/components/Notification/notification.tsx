'use-client'
import React, { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'

interface NotificationProps {
    notify: {
        open: boolean
        type?: 'success' | 'error' | 'info' | 'warning'
        message: string
    }
    setNotify: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            type?: 'success' | 'error' | 'info' | 'warning'
            message: string
        }>
    >
}

const Notification: React.FC<NotificationProps> = ({ notify, setNotify }) => {
    const toast = useToast()

    useEffect(() => {
        if (notify.open) {
            toast({
                title: notify.message,
                status: notify.type,
                duration: 9000,
                isClosable: true,
                onCloseComplete() {
                    setNotify({
                        open: false,
                        type: 'success',
                        message: ''
                    })
                },
            })
        }

    }, [notify.open])

    return (
        <>
        </>

    )
}

export default Notification
