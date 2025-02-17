import React from "react";
import { View, Button, Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useProducts } from "@/hooks/useProducts";
import {getTotalQuantity} from "@/utils/productUtils"; // Custom Hook for product data

const ExportReport = ({ products, statistics }) => {

    const generateHtml = () => {
        return `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { text-align: center; color: #333; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f4f4f4; }
                    </style>
                </head>
                <body>
                    <h1>Product Report</h1>
                    <h2>Statistics Overview</h2>
                    <p><strong>Total Products:</strong> ${statistics.totalProducts}</p>
                    <p><strong>Out of Stock:</strong> ${statistics.outOfStock}</p>
                    <p><strong>Total Stock Value:</strong> $${statistics.totalStockValue.toFixed(2)}</p>

                    <h2>Product List</h2>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Stocks</th>
                            <th>Price</th>
                            <th>Total Value</th>
                        </tr>
                        ${products.map((product) => `
                            <tr>
                                <td>${product.name}</td>
                                <td>${product.stocks?.map(stock => stock.name)}</td>
                                <td>$${product.price.toFixed(2)}</td>
                                <td>$${(getTotalQuantity(product) * product.price).toFixed(2)}</td>
                            </tr>
                        `).join("")}
                    </table>
                </body>
            </html>
        `;
    };

    // Function to generate and export the PDF
    const exportToPdf = async () => {
        try {
            const { uri } = await Print.printToFileAsync({
                html: generateHtml(),
                base64: false,
            });

            Alert.alert("PDF Generated", "Would you like to share the PDF?", [
                { text: "Cancel", style: "cancel" },
                { text: "Share", onPress: () => sharePdf(uri) }
            ]);
        } catch (error) {
            console.error("Error generating PDF", error);
        }
    };

    // Function to share the generated PDF
    const sharePdf = async (uri: string) => {
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri);
        } else {
            Alert.alert("Sharing Not Available", "You can find the file at: " + uri);
        }
    };
    return (
        <View style={{ padding: 20 }}>
            <Button color={"#555555"} title="Export Report to PDF" onPress={exportToPdf} />
        </View>
    );
};

export default ExportReport;
