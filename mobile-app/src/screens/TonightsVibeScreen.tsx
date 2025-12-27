import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../theme';
import apiClient from '../services/api';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 2;

interface Vibe {
    id: string;
    name: string;
    icon: string;
    gradient: string[];
    description: string;
    tags: string[];
}

const vibes: Vibe[] = [
    {
        id: 'chill',
        name: 'Chill',
        icon: 'coffee',
        gradient: ['#667eea', '#764ba2'],
        description: 'Relaxed vibes & smooth music',
        tags: ['lounge', 'jazz', 'r&b', 'chill'],
    },
    {
        id: 'party',
        name: 'Party',
        icon: 'music',
        gradient: ['#f093fb', '#f5576c'],
        description: 'High energy & dancing',
        tags: ['edm', 'house', 'techno', 'party'],
    },
    {
        id: 'date',
        name: 'Date Night',
        icon: 'heart',
        gradient: ['#fa709a', '#fee140'],
        description: 'Romantic atmosphere',
        tags: ['romantic', 'intimate', 'wine bar', 'date'],
    },
    {
        id: 'vip',
        name: 'VIP',
        icon: 'star',
        gradient: ['#30cfd0', '#330867'],
        description: 'Exclusive & luxurious',
        tags: ['vip', 'exclusive', 'luxury', 'premium'],
    },
];

const TonightsVibeScreen = ({ navigation }: any) => {
    const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
    const [nightclubs, setNightclubs] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [scaleAnims] = useState(
        vibes.map(() => new Animated.Value(1))
    );

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [clubsRes, eventsRes] = await Promise.all([
                apiClient.get('/nightclubs'),
                apiClient.get('/events'),
            ]);
            setNightclubs(clubsRes.data);
            setEvents(eventsRes.data);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleVibePress = (vibeId: string, index: number) => {
        // Animation
        Animated.sequence([
            Animated.timing(scaleAnims[index], {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnims[index], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        setSelectedVibe(vibeId === selectedVibe ? null : vibeId);
    };

    const getFilteredResults = () => {
        if (!selectedVibe) return { clubs: nightclubs, events };

        const vibe = vibes.find(v => v.id === selectedVibe);
        if (!vibe) return { clubs: nightclubs, events };

        // Simple filtering - in real app, you'd match against club/event tags
        const filteredClubs = nightclubs.slice(0, 3);
        const filteredEvents = events.slice(0, 3);

        return { clubs: filteredClubs, events: filteredEvents };
    };

    const { clubs, events: filteredEvents } = getFilteredResults();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tonight's Vibe</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>What's your vibe tonight?</Text>
                    <Text style={styles.subtitle}>
                        Choose a mood and we'll find the perfect spots for you
                    </Text>
                </View>

                {/* Mood Cards */}
                <View style={styles.moodGrid}>
                    {vibes.map((vibe, index) => (
                        <Animated.View
                            key={vibe.id}
                            style={[
                                styles.moodCardWrapper,
                                { transform: [{ scale: scaleAnims[index] }] },
                            ]}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.moodCard,
                                    selectedVibe === vibe.id && styles.moodCardSelected,
                                ]}
                                onPress={() => handleVibePress(vibe.id, index)}
                                activeOpacity={0.9}
                            >
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            backgroundColor:
                                                selectedVibe === vibe.id
                                                    ? theme.colors.primary
                                                    : theme.colors.surface,
                                        },
                                    ]}
                                >
                                    <Icon
                                        name={vibe.icon}
                                        size={32}
                                        color={
                                            selectedVibe === vibe.id
                                                ? '#000'
                                                : theme.colors.primary
                                        }
                                    />
                                </View>
                                <Text style={styles.moodName}>{vibe.name}</Text>
                                <Text style={styles.moodDescription}>
                                    {vibe.description}
                                </Text>
                                {selectedVibe === vibe.id && (
                                    <View style={styles.selectedBadge}>
                                        <Icon name="check" size={16} color="#000" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {/* Results Section */}
                {selectedVibe && (
                    <View style={styles.resultsSection}>
                        <Text style={styles.resultsTitle}>
                            Perfect matches for {vibes.find(v => v.id === selectedVibe)?.name}
                        </Text>

                        {/* Clubs */}
                        {clubs.length > 0 && (
                            <View style={styles.resultCategory}>
                                <Text style={styles.categoryTitle}>Top Clubs</Text>
                                {clubs.map((club) => (
                                    <TouchableOpacity
                                        key={club.id}
                                        style={styles.resultCard}
                                        onPress={() =>
                                            navigation.navigate('ClubDetail', { club })
                                        }
                                    >
                                        <Image
                                            source={{
                                                uri:
                                                    club.imageUrl ||
                                                    'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400',
                                            }}
                                            style={styles.resultImage}
                                        />
                                        <View style={styles.resultInfo}>
                                            <Text style={styles.resultName}>{club.name}</Text>
                                            <Text style={styles.resultLocation}>
                                                📍 {club.city || 'Lisboa'}
                                            </Text>
                                        </View>
                                        <Icon
                                            name="chevron-right"
                                            size={20}
                                            color={theme.colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Events */}
                        {filteredEvents.length > 0 && (
                            <View style={styles.resultCategory}>
                                <Text style={styles.categoryTitle}>Upcoming Events</Text>
                                {filteredEvents.map((event) => (
                                    <TouchableOpacity
                                        key={event.id}
                                        style={styles.resultCard}
                                        onPress={() =>
                                            navigation.navigate('ClubEvents', {
                                                clubId: event.nightclubId,
                                            })
                                        }
                                    >
                                        <Image
                                            source={{
                                                uri: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
                                            }}
                                            style={styles.resultImage}
                                        />
                                        <View style={styles.resultInfo}>
                                            <Text style={styles.resultName}>{event.name}</Text>
                                            <Text style={styles.resultLocation}>
                                                📅 {new Date(event.date).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <Icon
                                            name="chevron-right"
                                            size={20}
                                            color={theme.colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {!selectedVibe && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            👆 Select a vibe to see recommendations
                        </Text>
                    </View>
                )}

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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    titleSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
    moodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 16,
    },
    moodCardWrapper: {
        width: CARD_SIZE,
    },
    moodCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: theme.colors.border,
        minHeight: 180,
    },
    moodCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: 'rgba(0, 217, 255, 0.05)',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    moodName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    moodDescription: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        lineHeight: 18,
    },
    selectedBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultsSection: {
        marginTop: 40,
        paddingHorizontal: 20,
    },
    resultsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 24,
    },
    resultCategory: {
        marginBottom: 32,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 16,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    resultImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 16,
    },
    resultInfo: {
        flex: 1,
    },
    resultName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    resultLocation: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});

export default TonightsVibeScreen;
