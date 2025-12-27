import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import apiClient from '../services/api';
import { Nightclub } from '../types';
import { theme } from '../theme';
import { authService } from '../services/auth';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // 2 columns with padding

const BrowseScreen = ({ navigation }: any) => {
    const [nightclubs, setNightclubs] = useState<Nightclub[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('Home');
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadNightclubs();
        loadEvents();
        loadUser();
    }, []);

    const loadUser = async () => {
        const storedUser = await authService.getStoredUser();
        setUser(storedUser);
    };

    const loadNightclubs = async () => {
        try {
            const response = await apiClient.get<Nightclub[]>('/nightclubs');
            console.log('Loaded clubs:', response.data.map(c => ({ name: c.name, hasImage: !!c.imageUrl })));
            setNightclubs(response.data);
        } catch (error) {
            console.error('Failed to load nightclubs:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadEvents = async () => {
        try {
            const response = await apiClient.get('/events');
            console.log('Loaded events:', response.data.length);
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to load events:', error);
        }
    };

    const filters = ['All Events', 'Electronic Music', 'South America', 'Pop Music', 'Rock', 'Hip Hop', 'Techno', 'House Music', 'R&B', 'Jazz', 'Latin', 'Reggaeton'];

    // Filter nightclubs based on search query
    const filteredNightclubs = nightclubs.filter(club => {
        const matchesSearch = searchQuery.trim() === '' ||
            club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            club.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            club.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Hardcoded club images - guaranteed to work!
    const clubImages: { [key: string]: string } = {
        'Sky Garden': 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800',
        'Neon Sanctum': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        'Velvet Rope': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    };

    const getImageUrl = (url?: string, clubName?: string) => {
        // First try: Use hardcoded image for this specific club
        if (clubName && clubImages[clubName]) {
            return clubImages[clubName];
        }

        // Second try: Use the URL from database
        if (url && url.trim() !== '' && url.startsWith('http')) {
            return url;
        }

        // Final fallback
        return 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800';
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with User Greeting */}
            <View style={styles.header}>
                <View style={styles.userSection}>
                    <TouchableOpacity
                        style={styles.avatar}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Text style={styles.avatarText}>
                            {user?.firstName?.charAt(0) || 'U'}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.greetingSection}>
                        <Text style={styles.greetingText}>Good Evening 👋</Text>
                        <Text style={styles.userName}>
                            {user?.firstName || 'Guest'}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Icon name="bell" size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('SignIn')}
                    >
                        <Icon name="sign-out" size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="What club are you looking for..."
                        placeholderTextColor={theme.colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Tonight's Vibe Button */}
            <TouchableOpacity
                style={styles.vibeButton}
                onPress={() => navigation.navigate('TonightsVibe')}
                activeOpacity={0.8}
            >
                <View style={styles.vibeButtonContent}>
                    <Icon name="magic" size={20} color="#000" />
                    <Text style={styles.vibeButtonText}>Tonight's Vibe</Text>
                </View>
            </TouchableOpacity>

            {/* Navigation Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[
                        { name: 'Home', icon: 'home' },
                        { name: 'Clubs', icon: 'building' },
                        { name: 'Events', icon: 'calendar' },
                        { name: 'Popular', icon: 'star' }
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.name}
                            style={[
                                styles.filterTab,
                                selectedFilter === tab.name && styles.filterTabActive
                            ]}
                            onPress={() => setSelectedFilter(tab.name)}
                        >
                            <View style={[
                                styles.filterIconContainer,
                                selectedFilter === tab.name && styles.filterIconContainerActive
                            ]}>
                                <Icon
                                    name={tab.icon}
                                    size={20}
                                    color={selectedFilter === tab.name ? theme.colors.primary : theme.colors.textSecondary}
                                />
                            </View>
                            <Text style={[
                                styles.filterTabText,
                                selectedFilter === tab.name && styles.filterTabTextActive
                            ]}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Conditional rendering based on selected filter */}
                {selectedFilter === 'Events' ? (
                    /* Events View */
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Upcoming Events</Text>
                        <View style={styles.venuesGrid}>
                            {events.map((event) => (
                                <TouchableOpacity
                                    key={event.id}
                                    style={styles.venueCard}
                                    onPress={() => navigation.navigate('ClubEvents', { clubId: event.nightclubId })}
                                >
                                    <Image
                                        source={{ uri: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800' }}
                                        style={styles.venueImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.venueInfo}>
                                        <Text style={styles.venueName}>{event.name}</Text>
                                        <Text style={styles.venueLocation}>{new Date(event.date).toLocaleDateString()}</Text>
                                        <Text style={styles.venuePrice}>${event.price || '25'}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : (
                    /* Nightclubs View */
                    <>
                        {/* What we think you would like */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>What we think you would like...</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.eventsRow}
                            >
                                {filteredNightclubs.slice(0, 4).map((venue, index) => (
                                    <TouchableOpacity
                                        key={`event-${index}`}
                                        style={styles.eventCard}
                                        onPress={() => navigation.navigate('ClubDetail', {
                                            club: venue,
                                        })}
                                    >
                                        <Image
                                            source={{ uri: getImageUrl(venue.imageUrl, venue.name) }}
                                            style={styles.eventImage}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.heartIcon}>
                                            <Text>💖</Text>
                                        </View>
                                        <View style={styles.priceTag}>
                                            <Text style={styles.priceText}>$$$</Text>
                                        </View>
                                        <View style={styles.eventDetails}>
                                            <Text style={styles.eventName}>{venue.name}</Text>
                                            <Text style={styles.eventLocation}>Nightclub • {venue.city || 'Lisboa'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Klarna Payment Banner */}
                        <View style={styles.klarnaBanner}>
                            <Text style={styles.klarnaText}>
                                <Text style={styles.klarnaBold}>Book now.{'\n'}</Text>
                                Pay later with <Text style={styles.klarnaBold}>Klarna.</Text>
                            </Text>
                        </View>

                        {/* Popular Venues */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Popular in {user?.location || 'Lisboa'}</Text>
                            <View style={styles.venuesGrid}>
                                {filteredNightclubs.map((venue) => (
                                    <TouchableOpacity
                                        key={venue.id}
                                        style={styles.venueCard}
                                        onPress={() => navigation.navigate('ClubDetail', {
                                            club: venue,
                                        })}
                                    >
                                        <Image
                                            source={{ uri: getImageUrl(venue.imageUrl, venue.name) }}
                                            style={styles.venueImage}
                                        />
                                        <View style={styles.venueInfo}>
                                            <Text style={styles.venueName} numberOfLines={1}>{venue.name}</Text>
                                            <Text style={styles.venueCity} numberOfLines={1}>📍 {venue.city}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Upcoming Events */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Upcoming events</Text>
                            {events.map((event, index) => (
                                <TouchableOpacity
                                    key={`upcoming-${event.id}`}
                                    style={styles.upcomingCard}
                                    onPress={() => navigation.navigate('ClubDetail', {
                                        club: {
                                            id: event.nightclubId,
                                            name: event.nightclub?.name || 'Club',
                                        }
                                    })}
                                >
                                    <Image
                                        source={{ uri: getImageUrl(event.imageUrl, event.nightclub?.name) }}
                                        style={styles.upcomingImage}
                                    />
                                    <View style={styles.upcomingInfo}>
                                        <Text style={styles.upcomingName}>{event.name}</Text>
                                        <Text style={styles.upcomingLocation}>📍 {event.nightclub?.name || 'Club'}</Text>
                                        <Text style={styles.upcomingDate}>
                                            🕐 {new Date(event.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })} • €{event.price ? Number(event.price).toFixed(0) : '0'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={{ height: 40 }} />
                    </>
                )}

            </ScrollView>
        </View>
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
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greetingSection: {
        marginLeft: 12,
    },
    greetingText: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    userName: {
        ...theme.typography.h2,
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    favoritesButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    logoutButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    buttonText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    tabsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    tabs: {
        flexDirection: 'row',
        gap: 8,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    tabActive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
    },
    tabText: {
        fontSize: 14,
        color: theme.colors.text,
    },
    tabTextActive: {
        color: '#000',
        fontWeight: 'bold',
    },
    filterTab: {
        alignItems: 'center',
        marginRight: 20,
        paddingVertical: 8,
    },
    filterTabActive: {
        // Active state handled by child elements
    },
    filterIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: theme.colors.border,
    },
    filterIconContainerActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterTabText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    filterTabTextActive: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        ...theme.typography.body,
        fontSize: 15,
        color: theme.colors.text,
    },
    vibeButton: {
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: theme.colors.primary,
        elevation: 4,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    vibeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    vibeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 0.5,
    },
    filterChip: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginRight: 12,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterChipText: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.text,
    },
    filterChipTextActive: {
        color: '#000',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        ...theme.typography.h2,
        fontSize: 20,
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    eventsRow: {
        paddingHorizontal: 20,
        gap: 16,
    },
    eventCard: {
        width: 180,
        marginRight: 16,
        borderRadius: 12,
        position: 'relative',
    },
    eventImage: {
        width: 180,
        height: 200,
        borderRadius: 12,
    },
    heartIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceTag: {
        position: 'absolute',
        bottom: 60,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priceText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    eventOverlay: {
        padding: 12,
    },
    eventDetails: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginTop: 8,
    },
    eventName: {
        ...theme.typography.h2,
        fontSize: 16,
        marginBottom: 4,
        fontWeight: 'bold',
    },
    eventLocation: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    klarnaBanner: {
        backgroundColor: '#FFC0CB',
        marginHorizontal: 20,
        marginVertical: 16,
        padding: 24,
        borderRadius: 16,
    },
    klarnaText: {
        fontSize: 18,
        color: '#000',
        lineHeight: 26,
    },
    klarnaBold: {
        fontWeight: 'bold',
    },
    venuesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 16,
    },
    venueCard: {
        width: CARD_WIDTH,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        marginBottom: 8,
    },
    venueImage: {
        width: '100%',
        height: 140,
        backgroundColor: '#1E293B',
    },
    venueInfo: {
        padding: 10,
    },
    venueName: {
        ...theme.typography.h2,
        fontSize: 14,
        marginBottom: 2,
    },
    venueCity: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    venueLocation: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    venuePrice: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginTop: 4,
    },
    upcomingCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 12,
        overflow: 'hidden',
    },
    upcomingImage: {
        width: 100,
        height: 100,
        backgroundColor: '#1E293B',
    },
    upcomingInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    upcomingName: {
        ...theme.typography.h2,
        fontSize: 15,
        marginBottom: 4,
    },
    upcomingLocation: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    upcomingDate: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
});

export default BrowseScreen;
