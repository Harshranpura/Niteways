import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { authService } from '../services/auth';
import { theme } from '../theme';

const SignInScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        try {
            setLoading(true);
            await authService.signIn(email, password);
            navigation.replace('Browse');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Sign in failed');
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
                <Text style={styles.logo}>NITEWAYS</Text>
                <Text style={styles.tagline}>Your night out starts here.</Text>

                <View style={styles.form}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="E-post eller mobilnummer"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleSignIn}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.loginButtonText}>Log In</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Auth Buttons */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                            <Icon name="facebook" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                            <Icon name="google" size={20} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
                            <Icon name="apple" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.signUpLink}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        <Text style={styles.signUpLinkText}>
                            No account? <Text style={styles.signUpLinkHighlight}>Sign up here</Text>
                        </Text>
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
        padding: 24,
        justifyContent: 'center',
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        fontStyle: 'italic',
        marginBottom: 8,
        textAlign: 'center',
    },
    tagline: {
        ...theme.typography.body,
        fontSize: 14,
        marginBottom: 48,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
        color: theme.colors.text,
        fontSize: 15,
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: theme.colors.textSecondary,
        fontSize: 13,
    },
    loginButton: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    dividerText: {
        marginHorizontal: 16,
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 16,
    },
    socialButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    facebookButton: {
        backgroundColor: '#1877F2',
    },
    googleButton: {
        backgroundColor: '#fff',
    },
    appleButton: {
        backgroundColor: '#000',
    },
    signUpLink: {
        alignItems: 'center',
    },
    signUpLinkText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    signUpLinkHighlight: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});

export default SignInScreen;
