export const theme = {
    colors: {
        background: '#0F172A', // Deep Dark Blue/Black
        surface: 'rgba(255, 255, 255, 0.05)', // Glassmorphism
        primary: '#00D9FF', // Vibrant Cyan
        secondary: '#0099FF', // Electric Blue
        text: '#FFFFFF',
        textSecondary: '#94A3B8',
        border: 'rgba(255, 255, 255, 0.1)',
        error: '#EF4444',
        success: '#10B981',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        s: 8,
        m: 12,
        l: 16,
        round: 999,
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: '700' as const,
            color: '#FFFFFF',
        },
        h2: {
            fontSize: 24,
            fontWeight: '700' as const,
            color: '#FFFFFF',
        },
        body: {
            fontSize: 16,
            color: '#94A3B8',
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
            color: '#FFFFFF',
        },
    },
};
