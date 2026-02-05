import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CATEGORIES, HomeBottomTabsParamList } from '../../utils/types.ts';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart, pieDataItem } from 'react-native-gifted-charts';
import { useDb } from '../../context/DbContext.tsx';
import { NitroSQLiteConnection } from 'react-native-nitro-sqlite';
import { getCategoryInsights } from '../../utils/utils.ts';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = BottomTabScreenProps<HomeBottomTabsParamList, 'Home'>;
type PercentageData = { text: string; percentage: number };
const HomeScreen = ({ navigation }: Props) => {
  const db: NitroSQLiteConnection | null = useDb();

  const [data, setData] = useState<pieDataItem[]>([]);
  const [maxPercentage, setMaxPercentage] = useState<
    PercentageData | undefined
  >();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!db) return;

        const totalByCategory = await getCategoryInsights(db);
        if (!totalByCategory) return;

        let total = 0;

        for (const item of CATEGORIES) {
          total += totalByCategory[item];
        }

        const chartData: pieDataItem[] = CATEGORIES.map(category => ({
          label: category,
          text: category,
          value: totalByCategory[category] ?? 0,
          color: `#${Math.floor(Math.random() * 10)}f${Math.floor(
            Math.random() * 10,
          )}f${Math.floor(Math.random() * 10)}f`,
          tooltipText: Math.round(
            (totalByCategory[category] / total) * 100,
          ).toString(),
        })).filter(item => item.value > 0);

        const percentagesList: PercentageData[] = chartData.map(item => {
          return {
            text: item.text ? item.text : '',
            percentage: Math.round((item.value / total) * 100),
          };
        });

        const maxItem = percentagesList.reduce<PercentageData | undefined>(
          (max, item) =>
            !max || item.percentage > max.percentage ? item : max,
          undefined,
        );

        setMaxPercentage(maxItem);
        setData(chartData);
      };

      fetchData();
    }, [db]),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/*<ScrollView contentContainerStyle={styles.main}>*/}
      <Text style={styles.text}>Spendings</Text>
      <PieChart
        donut
        focusOnPress
        radius={90}
        innerRadius={60}
        data={data}
        innerCircleColor={'#232B5D'}
        centerLabelComponent={() => {
          return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}
              >
                {maxPercentage?.percentage}%
              </Text>

              <Text style={{ fontSize: 14, color: 'white' }}>
                {maxPercentage?.text}
              </Text>
            </View>
          );
        }}
      />
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: item.color }]}
            />
            <Text style={styles.legendText}>
              {item.tooltipText}% {item.text} — ₡{item.value}
            </Text>
          </View>
        ))}
      </View>
      {/*</ScrollView>*/}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // bottom: 150,
    backgroundColor: '#070709',
    // height: '50%', // excluding the footer
  },
  main: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
    width: '100%',
  },
  footer: {
    position: 'absolute',
    backgroundColor: '#cacaca',
    width: '100%',
    height: '20%',
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  footerBtn: {
    backgroundColor: '#531289',
    borderRadius: 8,
    padding: 15,
  },
  text: {
    fontSize: 18,
    color: '#fff',
  },
  item: {
    color: '#fff',
  },
  legendContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default HomeScreen;
