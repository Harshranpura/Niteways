import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { authService } from '../services/auth';
import { theme } from '../theme';

const SignUpScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password || !firstName || !lastName) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            // For now, use email as mobile placeholder
            const mobile = email.split('@')[0].replace(/[^0-9]/g, '').substring(0, 10) || '0000000000';
            const response = await authService.signUp(firstName, lastName, email, mobile, password, birthday, gender);
            Alert.alert('Success', 'Account created! Please sign in.', [
                { text: 'OK', onPress: () => navigation.navigate('SignIn') }
            ]);
        } catch (error: any) {
            let errorMessage = error.response?.data?.message || 'Sign up failed';
            if (Array.isArray(errorMessage)) {
                errorMessage = errorMessage.join('\n');
            }
            Alert.alert('Error', String(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.logo}>NITEWAYS</Text>
                    <Text style={styles.tagline}>Sign up to discover, book and{'\n'}share your nights. All in one place.</Text>

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

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="First name"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Last name"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Birthday (YYYY-MM-DD)"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={birthday}
                                onChangeText={setBirthday}
                            />
                        </View>

                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                style={[styles.genderButton, gender === 'Male' && styles.genderButtonActive]}
                                onPress={() => setGender('Male')}
                            >
                                <Text style={[styles.genderText, gender === 'Male' && styles.genderTextActive]}>Male</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderButton, gender === 'Female' && styles.genderButtonActive]}
                                onPress={() => setGender('Female')}
                            >
                                <Text style={[styles.genderText, gender === 'Female' && styles.genderTextActive]}>Female</Text>
                            </TouchableOpacity>
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

                        <Text style={styles.terms}>
                            By signing up, you agree to our Terms. You{'\n'}
                            can learn how we collect, use, and share your{'\n'}
                            data in our Privacy Policy, and how we use{'\n'}
                            cookies and similar technologies in our Cookie{'\n'}
                            Policy.
                        </Text>

                        <TouchableOpacity
                            style={styles.signUpButton}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={styles.signUpButtonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => navigation.navigate('SignIn')}
                        >
                            <Text style={styles.loginLinkText}>
                                Already have an account? <Text style={styles.loginLinkHighlight}>Log in</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 60,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    tagline: {
        ...theme.typography.body,
        fontSize: 14,
        marginBottom: 32,
        lineHeight: 20,
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
    genderContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 12,
    },
    genderButton: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
    },
    genderButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    genderText: {
        color: theme.colors.textSecondary,
        fontSize: 15,
        fontWeight: '500',
    },
    genderTextActive: {
        color: '#000',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
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
    terms: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 16,
    },
    signUpButton: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    signUpButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        alignItems: 'center',
    },
    loginLinkText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    loginLinkHighlight: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
