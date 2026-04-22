import { useEffect, useState } from 'react'
import { checkHealth, checkNeonHealth } from '../api/health'
import {
    Container,
    Typography,
    Dialog,
    Box,
    CircularProgress,
    Alert,
    Button,
    Stack,
    AlertTitle
} from '@mui/material'
import { BASE_URL } from '../api/config'


type Status = 'ok' | 'down' | null

export default function SystemInformation() {
    const [status, setStatus] = useState<Status>(null)
    const [neonStatus, setNeonStatus] = useState<Status>(null)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const fetchStatus = async () => {
        setLoading(true)
        setErrorMsg(null)
        setStatus(null)
        setNeonStatus(null)

        console.log('🔍 Checking Base URL:', BASE_URL)

        // Run checks independently so one failure doesn't stop the other
        try {
            const healthRes = await checkHealth().catch(err => {
                console.error('❌ API Error:', err)
                return { status: 'error', data: err.message }
            })

            console.log('📡 API Response:', healthRes)

            if ('status' in healthRes && healthRes.status === 200) {
                if (healthRes.data?.status === 'success') {
                    setStatus('ok')
                } else {
                    console.warn('⚠️ API 200 but unexpected body:', healthRes.data)
                    setStatus('down')
                    setErrorMsg(`API returned 200 but body status is not "success". Received: ${JSON.stringify(healthRes.data)}`)
                }
            } else {
                setStatus('down')
            }
        } catch {
            setStatus('down')
        }

        try {
            const neonRes = await checkNeonHealth().catch(err => {
                console.error('❌ Neon Error:', err)
                return { status: 'error', data: err.message }
            })

            console.log('🗄️ Neon Response:', neonRes)

            if ('status' in neonRes && neonRes.status === 200) {
                if (neonRes.data?.status === 'success') {
                    setNeonStatus('ok')
                } else {
                    console.warn('⚠️ Neon 200 but unexpected body:', neonRes.data)
                    setNeonStatus('down')
                }
            } else {
                setNeonStatus('down')
            }
        } catch {
            setNeonStatus('down')
        }

        setLoading(false)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchStatus()
        }, 0)
        return () => clearTimeout(timer)
    }, [])

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                System Information
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Target: {BASE_URL || 'Local Origin (Environment Variable Missing)'}
            </Typography>

            <Stack spacing={2}>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        API Status
                    </Typography>
                    {status === 'ok' && (
                        <Alert severity="success">
                            API is Online (200 OK)
                        </Alert>
                    )}
                    {status === 'down' && (
                        <Alert severity="error">
                            <AlertTitle>API Error</AlertTitle>
                            API is Offline or reporting errors.
                            {errorMsg && (
                                <Box sx={{ mt: 1, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                    {errorMsg}
                                </Box>
                            )}
                        </Alert>
                    )}
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        Database Status (Neon)
                    </Typography>
                    {neonStatus === 'ok' && (
                        <Alert severity="success">
                            Neon Database is Connected
                        </Alert>
                    )}
                    {neonStatus === 'down' && (
                        <Alert severity="error">
                            Neon Database Connection Failed
                        </Alert>
                    )}
                </Box>
            </Stack>

            <Dialog open={loading}>
                <Box sx={{ p: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <CircularProgress size={24} />
                    <Typography>Verifying system integrity...</Typography>
                </Box>
            </Dialog>

            <Button
                sx={{ mt: 4 }}
                variant="contained"
                onClick={fetchStatus}
                disabled={loading}
            >
                Refresh Status
            </Button>
        </Container>
    )
}