import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../theme';
import { authService } from '../services/auth';
import apiClient from '../services/api';

const ProfileEditScreen = ({ navigation }: any) => {
    const [user, setUser] = useState<any>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState('');
    const [birthday, setBirthday] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedUser = await authService.getStoredUser();
            setUser(storedUser);
            setFirstName(storedUser?.firstName || '');
            setLastName(storedUser?.lastName || '');
            setEmail(storedUser?.email || '');
            setMobile(storedUser?.mobile || '');
            setGender(storedUser?.gender || '');
            setBirthday(storedUser?.birthday || '');
            setProfileImage(storedUser?.profileImage || null);
        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImagePick = () => {
        // For POC: Use predefined avatar images
        const avatars = [
            'https://i.pravatar.cc/300?img=1',
            'https://i.pravatar.cc/300?img=2',
            'https://i.pravatar.cc/300?img=3',
            'https://i.pravatar.cc/300?img=4',
            'https://i.pravatar.cc/300?img=5',
        ];

        // Cycle through avatars
        const currentIndex = avatars.findIndex(url => url === profileImage);
        const nextIndex = (currentIndex + 1) % avatars.length;
        const newImage = avatars[nextIndex];

        setProfileImage(newImage);
        Alert.alert('Success', 'Profile picture updated! Tap Save Changes to keep it.');
    };

    const handleSave = async () => {
        try {
            console.log('Updating profile with data:', { firstName, lastName, email, mobile, gender, birthday });
            // Update user profile via API
            const response = await apiClient.put('/auth/profile', {
                firstName,
                lastName,
                email,
                mobile,
                gender,
                birthday,
            });
            console.log('Profile update response:', response.data);

            // Update AsyncStorage with new user data - explicitly include all fields
            const updatedUser = {
                ...user,
                firstName,
                lastName,
                email,
                mobile,
                gender,
                birthday,
                profileImage,
                ...response.data, // Override with any additional fields from API
            };
            console.log('Saving to AsyncStorage:', updatedUser);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (error: any) {
            console.error('Profile update error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <Text style={styles.avatarText}>
                                    {firstName?.charAt(0) || 'U'}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.editAvatarButton}
                            onPress={handleImagePick}
                        >
                            <Icon name="camera" size={14} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* NITEWAYS ID */}
                <View style={styles.idSection}>
                    <Text style={styles.idLabel}>NITEWAYS ID</Text>
                    <View style={styles.idBox}>
                        <Text style={styles.idText}>{user?.id || 'N/A'}</Text>
                        <TouchableOpacity>
                            <Icon name="copy" size={16} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact</Text>

                    <View style={styles.inputGroup}>
                        <Icon name="user" size={18} color={theme.colors.textSecondary} />
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Icon name="user" size={18} color={theme.colors.textSecondary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputIcon}>📱</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mobile Number"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={mobile}
                            onChangeText={setMobile}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Icon name="envelope" size={18} color={theme.colors.textSecondary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                {/* Gender Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Gender</Text>
                    <TouchableOpacity style={styles.dropdownButton}>
                        <Text style={styles.dropdownText}>{gender || 'Select Gender'}</Text>
                        <Icon name="angle-down" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                    <View style={styles.genderButtons}>
                        <TouchableOpacity
                            style={[styles.genderButton, gender === 'Male' && styles.genderButtonActive]}
                            onPress={() => setGender('Male')}
                        >
                            <Text style={[styles.genderButtonText, gender === 'Male' && styles.genderButtonTextActive]}>
                                Male
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.genderButton, gender === 'Female' && styles.genderButtonActive]}
                            onPress={() => setGender('Female')}
                        >
                            <Text style={[styles.genderButtonText, gender === 'Female' && styles.genderButtonTextActive]}>
                                Female
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Birthday Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Birthday</Text>
                    <View style={styles.birthdayPicker}>
                        <TextInput
                            style={styles.birthdayInput}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={birthday}
                            onChangeText={setBirthday}
                        />
                    </View>
                </View>

                {/* Social Interactions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Social Interactions</Text>

                    <View style={styles.socialItem}>
                        <View style={styles.socialIcon}>
                            <Icon name="instagram" size={24} color="#fff" />
                        </View>
                        <Text style={styles.socialText}>Instagram</Text>
                        <Icon name="link" size={20} color={theme.colors.textSecondary} />
                    </View>

                    <View style={styles.socialItem}>
                        <View style={[styles.socialIcon, { backgroundColor: '#1877F2' }]}>
                            <Icon name="facebook" size={24} color="#fff" />
                        </View>
                        <Text style={styles.socialText}>Facebook</Text>
                        <Icon name="link" size={20} color={theme.colors.textSecondary} />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    headerTitle: {
        ...theme.typography.h1,
        fontSize: 20,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    idSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    idLabel: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 8,
        textAlign: 'center',
    },
    idBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        padding: 12,
    },
    idText: {
        ...theme.typography.body,
        fontSize: 14,
        flex: 1,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        ...theme.typography.h2,
        fontSize: 16,
        marginBottom: 16,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        padding: 14,
        marginBottom: 12,
        gap: 12,
    },
    inputIcon: {
        fontSize: 18,
    },
    input: {
        flex: 1,
        ...theme.typography.body,
        fontSize: 15,
        color: theme.colors.text,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        padding: 14,
        marginBottom: 12,
    },
    dropdownText: {
        ...theme.typography.body,
        fontSize: 15,
    },
    genderButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    genderButton: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    genderButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    genderButtonText: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.text,
    },
    genderButtonTextActive: {
        color: '#000',
        fontWeight: 'bold',
    },
    birthdayPicker: {
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        padding: 14,
    },
    birthdayInput: {
        ...theme.typography.body,
        fontSize: 15,
        color: theme.colors.text,
    },
    socialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        padding: 14,
        marginBottom: 12,
        gap: 12,
    },
    socialIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E1306C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialText: {
        flex: 1,
        ...theme.typography.body,
        fontSize: 15,
    },
    saveButton: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.text,
    },
    saveButtonText: {
        ...theme.typography.button,
        color: theme.colors.background,
        fontSize: 16,
    },
});

export default ProfileEditScreen;
