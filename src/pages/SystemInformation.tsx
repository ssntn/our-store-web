import { useEffect, useState } from 'react'
import axios from 'axios'
import { checkHealth } from '../api/health'
import {
    Container,
    Typography,
    Dialog,
    Box,
    CircularProgress,
    Alert,
    Button
} from '@mui/material'

type Status = 'ok' | 'down' | null

export default function SystemInformation() {
    const [status, setStatus] = useState<Status>(null)
    const [loading, setLoading] = useState(false)

    const fetchStatus = async (): Promise<void> => {
        setLoading(true)
        setStatus(null)

        try {
            const response = await checkHealth()

            if (response.status === 200) {
                setStatus('ok')
            } else {
                setStatus('down')
            }

        } catch (error: unknown) {
            // ✅ Proper error handling (no 'any')
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    setStatus('down') // timeout
                } else if (error.response?.status === 500) {
                    setStatus('down')
                } else {
                    setStatus('down')
                }
            } else {
                setStatus('down')
            }

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void fetchStatus() // ✅ fix ignored promise warning
    }, [])

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4">
                System Information
            </Typography>

            <Typography sx={{ mt: 2 }}>
                API Status
            </Typography>

            {status === 'ok' && (
                <Alert severity="success">
                    API is OK (200)
                </Alert>
            )}

            {status === 'down' && (
                <Alert severity="error">
                    API is DOWN (500 or timeout)
                </Alert>
            )}

            <Dialog open={loading}>
                <Box sx={{ p: 4, display: 'flex', gap: 2 }}>
                    <CircularProgress />
                    <Typography>Checking API status...</Typography>
                </Box>
            </Dialog>

            <Button
                sx={{ mt: 3 }}
                variant="contained"
                onClick={fetchStatus}
            >
                Retry
            </Button>
        </Container>
    )
}