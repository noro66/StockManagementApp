import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from "@/hooks/useProducts";
import {getTotalQuantity} from "@/utils/productUtils";

interface Product {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Statistics {
    totalProducts: number;
    outOfStock: number;
    totalStockValue: number;
    mostAddedProducts: Product[];
    mostRemovedProducts: Product[];
}

interface StatCardProps {
    icon: string;
    title: string;
    value: string | number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
    <View style={styles.cardContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
    </View>
);

const ProductList: React.FC<{ title: string; products: Product[] }> = ({ title, products }) => (
    <Card containerStyle={styles.largeCard}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {products.length > 0 ? (
            products.map((product) => (
                <Text key={product.id} style={styles.listItem}>
                    {product.name} - {getTotalQuantity(product)}
                </Text>
            ))
        ) : (
            <Text style={styles.emptyText}>No data available</Text>
        )}
    </Card>
);

const StatisticsScreen: React.FC = () => {
    const { products } = useProducts();

    const statistics = useMemo<Statistics>(() => {
        if (!products?.length) {
            return {
                totalProducts: 0,
                outOfStock: 0,
                totalStockValue: 0,
                mostAddedProducts: [],
                mostRemovedProducts: [],
            };
        }

        const outOfStock = products.filter(product => getTotalQuantity(product) === 0).length;
        const totalStockValue = products.reduce(
            (sum, product) =>
                sum + (product.stocks.reduce((stockSum, stock) => stockSum + stock.quantity, 0) * product.price),
            0
        );


        return {
            totalProducts: products.length,
            outOfStock,
            totalStockValue,
            mostAddedProducts: [...products]
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 3),
            mostRemovedProducts: [...products]
                .sort((a, b) => a.quantity - b.quantity)
                .slice(0, 3),
        };
    }, [products]);

    const formatCurrency = (value: number): string =>
        `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.header}>Statistics Overview</Text>

                <View style={styles.cardRow}>
                    <Card containerStyle={styles.smallCard}>
                        <StatCard
                            icon="cube-outline"
                            title="Total Products"
                            value={statistics.totalProducts}
                            color="#007AFF"
                        />
                    </Card>

                    <Card containerStyle={styles.smallCard}>
                        <StatCard
                            icon="alert-circle-outline"
                            title="Out of Stock"
                            value={statistics.outOfStock}
                            color="#FF3B30"
                        />
                    </Card>
                </View>

                <Card containerStyle={styles.largeCard}>
                    <StatCard
                        icon="cash-outline"
                        title="Total Stock Value"
                        value={formatCurrency(statistics.totalStockValue)}
                        color="#34C759"
                    />
                </Card>

                <ProductList
                    title="Most Added Products"
                    products={statistics.mostAddedProducts}
                />

                <ProductList
                    title="Most Removed Products"
                    products={statistics.mostRemovedProducts}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 16,
        color: '#000',
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    smallCard: {
        flex: 1,
        margin: 8,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    largeCard: {
        margin: 16,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardContent: {
        alignItems: 'center',
        padding: 8,
    },
    cardTitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#000',
    },
    listItem: {
        fontSize: 16,
        marginVertical: 4,
        color: '#333',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
});

export default StatisticsScreen;