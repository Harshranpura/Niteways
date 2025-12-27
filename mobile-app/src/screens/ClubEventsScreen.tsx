import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import apiClient from '../services/api';
import { theme } from '../theme';

type Props = StackScreenProps<RootStackParamList, 'ClubEvents'>;

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    price: number;
    imageUrl?: string;
}

export default function ClubEventsScreen({ route }: Props) {
    const { club } = route.params;
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const response = await apiClient.get('/events');
            const clubEvents = response.data.filter(
                (event: any) => event.nightclubId === club.id
            );
            setEvents(clubEvents);
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const renderEvent = ({ item }: { item: Event }) => (
        <View style={styles.eventCard}>
            {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
            ) : (
                <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>📅</Text>
                </View>
            )}
            <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                    <Text style={styles.eventName}>{item.name}</Text>
                    <Text style={styles.eventPrice}>
                        €{item.price ? Number(item.price).toFixed(2) : '0.00'}
                    </Text>
                </View>
                <Text style={styles.eventDate}>📅 {formatDate(item.date)}</Text>
                <Text style={styles.eventDescription} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading events...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Club Header */}
            <View style={styles.clubHeader}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubLocation}>📍 {club.location}</Text>
                <Text style={styles.clubDescription}>{club.description}</Text>
            </View>

            {/* Events List */}
            <View style={styles.eventsSection}>
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                <FlatList
                    data={events}
                    renderItem={renderEvent}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyEmoji}>🎫</Text>
                            <Text style={styles.emptyText}>
                                No events scheduled yet.
                            </Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    clubHeader: {
        backgroundColor: theme.colors.surface,
        padding: 24,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    clubName: {
        ...theme.typography.h1,
        color: theme.colors.primary,
        marginBottom: 8,
    },
    clubLocation: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.secondary,
        marginBottom: 12,
        fontWeight: '600',
    },
    clubDescription: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    eventsSection: {
        flex: 1,
        paddingTop: 24,
    },
    sectionTitle: {
        ...theme.typography.h2,
        fontSize: 20,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    list: {
        padding: 20,
        paddingTop: 0,
    },
    eventCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    eventImage: {
        width: '100%',
        height: 140,
        backgroundColor: '#1E293B',
    },
    placeholderImage: {
        width: '100%',
        height: 140,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 50,
    },
    eventContent: {
        padding: 16,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventName: {
        ...theme.typography.h2,
        fontSize: 18,
        flex: 1,
        marginRight: 8,
    },
    eventPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.secondary,
    },
    eventDate: {
        ...theme.typography.body,
        fontSize: 14,
        marginBottom: 8,
        color: theme.colors.primary,
    },
    eventDescription: {
        ...theme.typography.body,
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.textSecondary,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        marginTop: 16,
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
        opacity: 0.7,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        ...theme.typography.body,
        textAlign: 'center',
    },
});
