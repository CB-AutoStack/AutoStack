import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Flags} from '../flags';
import {Vehicle} from '../data/mockData';

interface Props {
  route: {
    params: {
      vehicle: Vehicle;
    };
  };
}

export default function VehicleDetailScreen({route}: Props): React.JSX.Element {
  const {vehicle} = route.params;
  const showFinancing = Flags.showFinancingCalculator.isEnabled();
  const showTradeIn = Flags.showInstantTradeIn.isEnabled();
  const show360 = Flags.enable360View.isEnabled();

  return (
    <ScrollView style={styles.container}>
      <Image source={{uri: vehicle.imageUrl}} style={styles.heroImage} />

      {show360 && (
        <View style={styles.feature360}>
          <Text style={styles.feature360Text}>🔄 360° View Available</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <Text style={styles.trim}>{vehicle.trim}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${vehicle.price.toLocaleString()}</Text>
          <Text style={styles.monthly}>or ${vehicle.monthlyPayment}/mo</Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Mileage</Text>
            <Text style={styles.detailValue}>
              {vehicle.mileage.toLocaleString()} mi
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Color</Text>
            <Text style={styles.detailValue}>{vehicle.color}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>VIN</Text>
            <Text style={styles.detailValue}>{vehicle.vin}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          {vehicle.features.map((feature, index) => (
            <Text key={index} style={styles.featureItem}>
              • {feature}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{vehicle.description}</Text>
        </View>

        {showTradeIn && (
          <TouchableOpacity style={styles.tradeInButton}>
            <Text style={styles.tradeInButtonText}>
              Get Instant Trade-In Value
            </Text>
          </TouchableOpacity>
        )}

        {showFinancing && (
          <TouchableOpacity style={styles.financingButton}>
            <Text style={styles.financingButtonText}>
              Calculate Financing
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Schedule Test Drive</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  feature360: {
    backgroundColor: '#007AFF',
    padding: 12,
    alignItems: 'center',
  },
  feature360Text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  trim: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  priceContainer: {
    marginBottom: 24,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  monthly: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  tradeInButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  tradeInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  financingButton: {
    backgroundColor: '#5856D6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  financingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
