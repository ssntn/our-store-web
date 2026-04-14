import { useEffect, useState } from 'react'
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

    const fetchStatus = async () => {
        setLoading(true)
        setStatus(null)

        try {
            const response = await checkHealth()

            // ✅ RULE: 200 = OK
            if (response.status === 200) {
                setStatus('ok')
            } else {
                setStatus('down')
            }

        } catch (error: any) {
            // ❌ RULE: 500 OR TIMEOUT = DOWN
            if (error.code === 'ECONNABORTED') {
                setStatus('down') // timeout
            } else if (error.response?.status === 500) {
                setStatus('down')
            } else {
                setStatus('down')
            }

        } finally {
            // ✅ ALWAYS STOP LOADING
            setLoading(false)
        }
    }

    // auto run on page load
    useEffect(() => {
        fetchStatus()
    }, [])

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4">
                System Information
            </Typography>

            <Typography sx={{ mt: 2 }}>
                API Status
            </Typography>

            {/* STATUS UI */}
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

            {/* LOADING MODAL */}
            <Dialog open={loading}>
                <Box sx={{ p: 4, display: 'flex', gap: 2 }}>
                    <CircularProgress />
                    <Typography>Checking API status...</Typography>
                </Box>
            </Dialog>

            {/* MANUAL RETRY */}
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