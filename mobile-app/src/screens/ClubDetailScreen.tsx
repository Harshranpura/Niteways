import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';
import apiClient from '../services/api';

const { width } = Dimensions.get('window');

const ClubDetailScreen = ({ route, navigation }: any) => {
    const { club } = route.params;
    const [selectedTab, setSelectedTab] = useState('Tables');
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [clubData, setClubData] = useState<any>(null);

    useEffect(() => {
        loadClubData();
    }, []);

    const loadClubData = async () => {
        try {
            setLoading(true);
            // Set club data first
            setClubData(club);

            // Try to fetch events (silently fail if endpoint doesn't exist)
            try {
                const eventsResponse = await apiClient.get(`/events/club/${club.id}`);
                setEvents(eventsResponse.data || []);
            } catch (err) {
                // Silently handle - endpoint might not be ready
                setEvents([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Hardcoded club images mapping
    const clubImages: { [key: string]: string } = {
        'Sky Garden': 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800',
        'Neon Sanctum': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        'Velvet Rope': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    };

    // Sample images for the club gallery
    const getClubGallery = () => {
        const clubImage = clubImages[club.name] || club.imageUrl || 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800';
        // Return same image multiple times for gallery effect
        return [clubImage, clubImage, clubImage, clubImage];
    };

    const clubGallery = getClubGallery();

    // Mock tables data (in real app, fetch from backend)
    const tables = [
        { id: 1, name: 'VIP Table 1', capacity: 4, price: 300, date: '2024-12-31', time: '22:00' },
        { id: 2, name: 'Premium Table 2', capacity: 6, price: 450, date: '2024-12-31', time: '22:00' },
        { id: 3, name: 'Standard Table 3', capacity: 4, price: 200, date: '2024-12-31', time: '23:00' },
        { id: 4, name: 'VIP Table 4', capacity: 8, price: 600, date: '2024-12-31', time: '22:00' },
    ];

    const tabs = ['Tables', 'Tickets', 'Guest List', 'Menu'];

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Image Gallery */}
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.imageGallery}
            >
                {clubGallery.map((image, index) => (
                    <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.galleryImage}
                        resizeMode="cover"
                    />
                ))}
            </ScrollView>

            {/* Club Info */}
            <View style={styles.infoSection}>
                <View style={styles.headerRow}>
                    <Text style={styles.clubName}>{clubData?.name || 'Club Name'}</Text>
                    <TouchableOpacity style={styles.favoriteButton}>
                        <Text style={styles.heartIcon}>🤍</Text>
                    </TouchableOpacity>
                </View>

                {/* Rating */}
                <View style={styles.ratingRow}>
                    <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
                    <Text style={styles.ratingText}>• 5.0</Text>
                </View>

                {/* Location */}
                <View style={styles.detailRow}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.detailText}>{clubData?.city || 'Lisboa'}</Text>
                </View>

                {/* Hours */}
                <View style={styles.detailRow}>
                    <Text style={styles.clockIcon}>🕐</Text>
                    <Text style={styles.detailText}>Opens at 22:00 • Closes at 03:00</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    {clubData?.description || 'Experience the best nightlife in town with amazing music, drinks, and atmosphere.'}
                </Text>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.bookButton}>
                        <Text style={styles.bookIcon}>🍸</Text>
                        <Text style={styles.bookButtonText}>Book a Table</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.instagramButton}>
                        <Text style={styles.instagramIcon}>📷</Text>
                        <Text style={styles.instagramButtonText}>Instagram</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                selectedTab === tab && styles.activeTab,
                            ]}
                            onPress={() => setSelectedTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.tabUnderline} />
            </View>

            {/* Tab Content */}
            {selectedTab === 'Tables' && (
                <View style={styles.tabContent}>
                    {/* Floor Plan */}
                    <Text style={styles.sectionTitle}>Floor Plan</Text>
                    <View style={styles.floorPlanContainer}>
                        <View style={styles.floorPlan}>
                            <Text style={styles.floorPlanLabel}>Floor Plan</Text>
                            {/* Table markers */}
                            <View style={[styles.tableMarker, { top: 40, left: 30 }]}>
                                <View style={styles.markerDot} />
                            </View>
                            <View style={[styles.tableMarker, { top: 40, right: 30 }]}>
                                <View style={styles.markerDot} />
                            </View>
                            <View style={[styles.tableMarker, { bottom: 40, left: 30 }]}>
                                <View style={styles.markerDot} />
                            </View>
                            <View style={[styles.tableMarker, { bottom: 40, right: 30 }]}>
                                <View style={styles.markerDot} />
                            </View>
                        </View>
                    </View>

                    {/* Tables List */}
                    <Text style={styles.sectionTitle}>Tables</Text>
                    {tables.map((table) => (
                        <View key={table.id} style={styles.tableCard}>
                            <View style={styles.tableIcon}>
                                <Text style={styles.tableIconText}>👥</Text>
                            </View>
                            <View style={styles.tableInfo}>
                                <Text style={styles.tableName}>
                                    {table.capacity} pax - {table.name}
                                </Text>
                                <Text style={styles.tableTime}>
                                    {table.date} • {table.time}
                                </Text>
                            </View>
                            <View style={styles.tablePrice}>
                                <Text style={styles.priceText}>€{table.price}</Text>
                                <TouchableOpacity style={styles.selectButton}>
                                    <Text style={styles.selectButtonText}>Select</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {selectedTab === 'Tickets' && (
                <View style={styles.tabContent}>
                    {events.length > 0 ? (
                        <>
                            <Text style={styles.sectionTitle}>Upcoming Events</Text>
                            {events.map((event) => (
                                <View key={event.id} style={styles.tableCard}>
                                    <View style={styles.tableIcon}>
                                        <Text style={styles.tableIconText}>🎉</Text>
                                    </View>
                                    <View style={styles.tableInfo}>
                                        <Text style={styles.tableName}>{event.name}</Text>
                                        <Text style={styles.tableTime}>
                                            {new Date(event.date).toLocaleDateString()} • {event.time || '22:00'}
                                        </Text>
                                    </View>
                                    <View style={styles.tablePrice}>
                                        <Text style={styles.priceText}>€{event.price || '25'}</Text>
                                        <TouchableOpacity style={styles.selectButton}>
                                            <Text style={styles.selectButtonText}>Book</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <Text style={styles.emptyText}>No upcoming events</Text>
                    )}
                </View>
            )}

            {selectedTab === 'Guest List' && (
                <View style={styles.tabContent}>
                    <Text style={styles.emptyText}>Guest list coming soon</Text>
                </View>
            )}

            {selectedTab === 'Menu' && (
                <View style={styles.tabContent}>
                    <Text style={styles.emptyText}>Menu coming soon</Text>
                </View>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    imageGallery: {
        height: 250,
    },
    galleryImage: {
        width: width,
        height: 250,
    },
    infoSection: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    clubName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    favoriteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartIcon: {
        fontSize: 20,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    stars: {
        fontSize: 14,
    },
    ratingText: {
        color: '#FFD700',
        fontSize: 14,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    clockIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    detailText: {
        color: '#AAA',
        fontSize: 14,
    },
    description: {
        color: '#CCC',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 12,
        marginBottom: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    bookButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#00FF9D',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    bookIcon: {
        fontSize: 18,
    },
    bookButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    instagramButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    instagramIcon: {
        fontSize: 18,
    },
    instagramButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tabsContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    tab: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#00FF9D',
    },
    tabText: {
        color: '#888',
        fontSize: 15,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#00FF9D',
    },
    tabUnderline: {
        height: 1,
        backgroundColor: '#222',
    },
    tabContent: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 16,
    },
    floorPlanContainer: {
        marginBottom: 32,
    },
    floorPlan: {
        height: 200,
        backgroundColor: '#111',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    floorPlanLabel: {
        color: '#666',
        fontSize: 14,
    },
    tableMarker: {
        position: 'absolute',
        width: 16,
        height: 16,
    },
    markerDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FF1493',
    },
    tableCard: {
        flexDirection: 'row',
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    tableIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#7C3AED',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    tableIconText: {
        fontSize: 20,
    },
    tableInfo: {
        flex: 1,
    },
    tableName: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    tableTime: {
        color: '#888',
        fontSize: 13,
    },
    tablePrice: {
        alignItems: 'flex-end',
    },
    priceText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    selectButton: {
        backgroundColor: '#00FF9D',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    selectButtonText: {
        color: '#000',
        fontSize: 13,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#666',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 40,
    },
});

export default ClubDetailScreen;
