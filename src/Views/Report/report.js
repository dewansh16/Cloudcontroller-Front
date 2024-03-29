import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'col',
        backgroundColor: '#FFFFFF',
        width:"50%",
        height:"50vh"
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        
    }
});

// Create Document Component
export default function MyDocument() {
    return (
        <Document >
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    )
}

