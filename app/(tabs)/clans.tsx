import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';

const Clans = () => {
  const [expandedClan, setExpandedClan] = useState<number | null>(null);

  // Sample data for clans
  const clansData = [
    { id: 1, name: 'Clan A', leader: 'Leader A', achievements: 100, users: 10 },
    { id: 2, name: 'Clan B', leader: 'Leader B', achievements: 150, users: 15 },
    { id: 3, name: 'Clan C', leader: 'Leader C', achievements: 80, users: 8 },
    { id: 4, name: 'Clan D', leader: 'Leader D', achievements: 200, users: 20 },
    { id: 5, name: 'Clan E', leader: 'Leader E', achievements: 120, users: 12 },
  ];

  // Function to toggle expansion of clan item
  const toggleExpansion = (clanId: number) => {
    setExpandedClan(expandedClan === clanId ? null : clanId);
  };

  // Render item for each clan
  const renderItem = ({ item }: { item: { id: number; name: string; leader: string; achievements: number; users: number } }) => (
    <View style={styles.clanItem}>
      <Pressable onPress={() => toggleExpansion(item.id)} style={styles.clanHeader}>
        <Text style={styles.clanName}>{item.name}</Text>
        <Text style={styles.usersCount}>{item.users} Members</Text>
      </Pressable>
      {expandedClan === item.id && (
        <View style={styles.expandedContent}>
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Leader:</Text>
              <Text style={styles.detailText}>{item.leader}</Text>
              <Text style={styles.detailLabel}>Total Achievements:</Text>
              <Text style={styles.detailText}>{item.achievements}</Text>
            </View>
            <Pressable style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clans</Text>
      <FlatList
        data={clansData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
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
  clanItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  clanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  clanName: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  usersCount: {
    fontSize: 16,
    color: 'gray',
  },
  expandedContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: 'black',
  },
  detailText: {
    fontSize: 16,
    color: 'black',
  },
  joinButton: {
    backgroundColor: 'goldenrod',
    width:80,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  joinButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Clans;
