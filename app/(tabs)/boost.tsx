import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Boost = () => {
  const [expandedBoost, setExpandedBoost] = useState<number | null>(null);

  // Sample data for boost items
  const boostData = [
    { id: 1, name: 'Boost 1', duration: '1 hour', price: 10 },
    { id: 2, name: 'Boost 2', duration: '2 hours', price: 20 },
    { id: 3, name: 'Boost 3', duration: '3 hours', price: 30 },
    { id: 4, name: 'Boost 4', duration: '4 hours', price: 40 },
    { id: 5, name: 'Boost 5', duration: '5 hours', price: 50 },
  ];

  // Function to toggle expansion of boost item
  const toggleExpansion = (boostId: number) => {
    setExpandedBoost(expandedBoost === boostId ? null : boostId);
  };

  // Render item for each boost
  const renderItem = ({ item }: { item: { id: number; name: string; duration: string; price: number } }) => (
    <View style={styles.boostItem}>
      <TouchableOpacity onPress={() => toggleExpansion(item.id)} style={styles.boostHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="flash" size={24} color="black" />
        </View>
        <Text style={styles.boostName}>{item.name}</Text>
        <Text style={styles.boostDuration}>{item.duration}</Text>
      </TouchableOpacity>
      {expandedBoost === item.id && (
        <View style={styles.expandedContent}>
          <Text style={styles.priceText}>Price: ${item.price}</Text>
          <Pressable style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boost</Text>
      <View style={styles.boostList}>
        {boostData.map((boost) => (
          <React.Fragment key={boost.id}>
            {renderItem({ item: boost })}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'goldenrod',
    textAlign: 'center',
  },
  boostList: {
    marginTop: 10,
  },
  boostItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  boostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  boostName: {
    fontSize: 18,
    color: 'black',
  },
  boostDuration: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 'auto',
  },
  expandedContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  priceText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  buyButton: {
    backgroundColor: 'goldenrod',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  buyButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Boost;
