import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Flags} from '../flags';
import {getMockVehicles, Vehicle} from '../data/mockData';

interface Props {
  navigation: any;
}

export default function HomeScreen({navigation}: Props): React.JSX.Element {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockVehicles = getMockVehicles();

      // Apply search algorithm based on feature flag
      const algorithm = Flags.searchAlgorithm.getValue();
      const sortedVehicles = sortVehicles(mockVehicles, algorithm);

      setVehicles(sortedVehicles);
      setIsLoading(false);
    }, 500);
  }, []);

  const sortVehicles = (vehicleList: Vehicle[], algorithm: string): Vehicle[] => {
    const sorted = [...vehicleList];

    switch (algorithm) {
      case 'price-focused':
        return sorted.sort((a, b) => a.price - b.price);
      case 'feature-focused':
        return sorted.sort((a, b) => b.year - a.year);
      case 'ai-recommended':
        // In real app, this would use ML recommendations
        return sorted.sort(() => Math.random() - 0.5);
      default:
        return sorted;
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showMonthlyPayment = Flags.showMonthlyPaymentFirst.isEnabled();

  const renderVehicle = ({item}: {item: Vehicle}) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => navigation.navigate('VehicleDetail', {vehicle: item})}>
      <Image source={{uri: item.imageUrl}} style={styles.vehicleImage} />
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={styles.vehicleTrim}>{item.trim}</Text>
        {showMonthlyPayment ? (
          <View>
            <Text style={styles.monthlyPayment}>
              ${item.monthlyPayment}/mo
            </Text>
            <Text style={styles.totalPrice}>${item.price.toLocaleString()}</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.totalPrice}>${item.price.toLocaleString()}</Text>
            <Text style={styles.monthlyPayment}>
              ${item.monthlyPayment}/mo
            </Text>
          </View>
        )}
        <Text style={styles.mileage}>
          {item.mileage.toLocaleString()} miles
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by make or model..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {Flags.enableAdvancedFilters.isEnabled() && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Advanced Filters Available</Text>
        </View>
      )}

      <FlatList
        data={filteredVehicles}
        renderItem={renderVehicle}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  filterContainer: {
    padding: 12,
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  vehicleInfo: {
    padding: 16,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vehicleTrim: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  monthlyPayment: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  mileage: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
