import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    Animated,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
    const scrollY = useRef(new Animated.Value(0)).current;

    const features = [
        {
            icon: 'search',
            title: 'Discover Nightlife',
            description: 'Browse the hottest clubs and events in your city',
        },
        {
            icon: 'ticket',
            title: 'Book Tables & Tickets',
            description: 'Reserve your spot at exclusive venues instantly',
        },
        {
            icon: 'star',
            title: 'VIP Experience',
            description: 'Get access to premium tables and guest lists',
        },
        {
            icon: 'bell',
            title: 'Stay Updated',
            description: 'Never miss out on the latest events and parties',
        },
    ];

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200' }}
                style={styles.backgroundImage}
                blurRadius={3}
            >
                <View style={styles.overlay}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Hero Section */}
                        <View style={styles.heroSection}>
                            <View style={styles.logoContainer}>
                                <Text style={styles.discoBall}>🪩</Text>
                                <Text style={styles.appName}>NITEWAYS</Text>
                                <Text style={styles.tagline}>Your Gateway to Nightlife</Text>
                            </View>
                        </View>

                        {/* Features Section */}
                        <View style={styles.featuresSection}>
                            <Text style={styles.sectionTitle}>Why Choose Niteways?</Text>
                            {features.map((feature, index) => (
                                <View key={index} style={styles.featureCard}>
                                    <View style={styles.featureIconContainer}>
                                        <Icon name={feature.icon} size={28} color={theme.colors.primary} />
                                    </View>
                                    <View style={styles.featureContent}>
                                        <Text style={styles.featureTitle}>{feature.title}</Text>
                                        <Text style={styles.featureDescription}>{feature.description}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Stats Section */}
                        <View style={styles.statsSection}>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>50+</Text>
                                <Text style={styles.statLabel}>Venues</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>1000+</Text>
                                <Text style={styles.statLabel}>Events</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>10K+</Text>
                                <Text style={styles.statLabel}>Users</Text>
                            </View>
                        </View>

                        {/* CTA Section */}
                        <View style={styles.ctaSection}>
                            <TouchableOpacity
                                style={styles.getStartedButton}
                                onPress={() => navigation.navigate('SignIn')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonText}>Get Started</Text>
                                <Icon name="arrow-right" size={20} color="#000" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.signInLink}
                                onPress={() => navigation.navigate('SignIn')}
                            >
                                <Text style={styles.signInText}>
                                    Already have an account? <Text style={styles.signInBold}>Sign In</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 50 }} />
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroSection: {
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
    },
    discoBall: {
        fontSize: 100,
        marginBottom: 20,
    },
    appName: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.primary,
        letterSpacing: 4,
        marginBottom: 10,
    },
    tagline: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        fontWeight: '300',
        letterSpacing: 2,
    },
    featuresSection: {
        paddingHorizontal: 20,
        marginTop: 40,
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 30,
        textAlign: 'center',
    },
    featureCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 255, 0.2)',
    },
    featureIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 0, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
        justifyContent: 'center',
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 6,
    },
    featureDescription: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginTop: 40,
        marginBottom: 40,
    },
    statCard: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    ctaSection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    getStartedButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 40,
        gap: 12,
        elevation: 8,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 1,
    },
    signInLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    signInText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    signInBold: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});

export default WelcomeScreen;
