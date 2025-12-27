import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { authService } from '../services/auth';
import { theme } from '../theme';

const VerificationScreen = ({ route, navigation }: any) => {
    const { mobile } = route.params;
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (code.length !== 6) {
            Alert.alert('Error', 'Please enter a 6-digit code');
            return;
        }

        try {
            setLoading(true);
            await authService.verify(mobile, code);
            navigation.replace('Browse');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.emoji}>📱</Text>
                <Text style={styles.title}>Enter Code</Text>
                <Text style={styles.subtitle}>
                    We sent a verification code to{'\n'}
                    <Text style={styles.mobile}>{mobile}</Text>
                </Text>

                <View style={styles.form}>
                    <TextInput
                        placeholder="000000"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        maxLength={6}
                        style={styles.codeInput}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleVerify}
                        disabled={loading || code.length !== 6}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Verify</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        padding: theme.spacing.l,
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 64,
        textAlign: 'center',
        marginBottom: theme.spacing.m,
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.s,
    },
    subtitle: {
        ...theme.typography.body,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    mobile: {
        fontWeight: 'bold',
        color: theme.colors.secondary,
    },
    form: {
        width: '100%',
        alignItems: 'center',
    },
    codeInput: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        color: theme.colors.text,
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 8,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        width: '100%',
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        ...theme.typography.button,
    },
});

export default VerificationScreen;
