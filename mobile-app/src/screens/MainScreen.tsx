import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../theme';
import { authService } from '../services/auth';
import apiClient from '../services/api';

const MainScreen = ({ navigation }: any) => {
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedUser = await authService.getStoredUser();
            setUser(storedUser);

            // Load bookings - wrap in try-catch to handle auth errors
            try {
                const bookingsResponse = await apiClient.get('/bookings');
                setBookings(bookingsResponse.data || []);
            } catch (bookingsError) {
                console.log('Could not load bookings:', bookingsError);
                setBookings([]);
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        navigation.replace('SignIn');
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.firstName?.charAt(0) || 'U'}
                        </Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                            {user?.firstName} {user?.lastName}
                        </Text>
                        <Text style={styles.userLocation}>
                            📍 {user?.location || 'Lisboa'}
                        </Text>
                        <View style={styles.ratingContainer}>
                            <Icon name="star" size={14} color="#FFD700" />
                            <Text style={styles.rating}>4.8 / 5</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('ProfileEdit')}
                >
                    <Icon name="edit" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Upcoming Bookings */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
                    <TouchableOpacity>
                        <Icon name="angle-down" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                {bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                        <View key={index} style={styles.bookingCard}>
                            <Image
                                source={{ uri: booking.venueImage || 'https://images.unsplash.com/photo-1571407981552-c15f60688a2c' }}
                                style={styles.bookingImage}
                            />
                            <View style={styles.bookingInfo}>
                                <Text style={styles.bookingVenue}>{booking.venueName}</Text>
                                <Text style={styles.bookingDetails}>
                                    📍 {booking.tableNumber || 'Table'} • {new Date(booking.bookingDate).toLocaleDateString()}
                                </Text>
                                <TouchableOpacity style={styles.viewButton}>
                                    <Text style={styles.viewButtonText}>View QR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No upcoming bookings</Text>
                )}
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Browse')}
                >
                    <Icon name="search" size={20} color={theme.colors.primary} />
                    <Text style={styles.actionText}>Browse</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="heart" size={20} color={theme.colors.primary} />
                    <Text style={styles.actionText}>Favorites</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="history" size={20} color={theme.colors.primary} />
                    <Text style={styles.actionText}>Booking History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="credit-card" size={20} color={theme.colors.primary} />
                    <Text style={styles.actionText}>Payment Method</Text>
                </TouchableOpacity>
            </View>

            {/* Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>

                <TouchableOpacity style={styles.settingItem}>
                    <Icon name="info-circle" size={18} color={theme.colors.text} />
                    <Text style={styles.settingText}>About</Text>
                    <Icon name="angle-right" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Icon name="envelope" size={18} color={theme.colors.text} />
                    <Text style={styles.settingText}>Contact Us</Text>
                    <Icon name="angle-right" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Icon name="cog" size={18} color={theme.colors.text} />
                    <Text style={styles.settingText}>Account Settings</Text>
                    <Icon name="angle-right" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Icon name="question-circle" size={18} color={theme.colors.text} />
                    <Text style={styles.settingText}>Help Center</Text>
                    <Icon name="angle-right" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Icon name="star" size={18} color={theme.colors.text} />
                    <Text style={styles.settingText}>Rate Us</Text>
                    <Icon name="angle-right" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
                    <Icon name="sign-out" size={18} color="#FF4444" />
                    <Text style={[styles.settingText, { color: '#FF4444' }]}>Log Out</Text>
                    <Icon name="angle-right" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...theme.typography.h1,
        fontSize: 20,
        marginBottom: 4,
    },
    userLocation: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        ...theme.typography.h2,
        fontSize: 18,
    },
    bookingCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    bookingImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#1E293B',
    },
    bookingInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    bookingVenue: {
        ...theme.typography.h2,
        fontSize: 15,
    },
    bookingDetails: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    viewButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    viewButtonText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    emptyText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 20,
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 12,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        ...theme.typography.body,
        fontSize: 13,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        gap: 12,
    },
    settingText: {
        flex: 1,
        ...theme.typography.body,
        fontSize: 15,
    },
});

export default MainScreen;
